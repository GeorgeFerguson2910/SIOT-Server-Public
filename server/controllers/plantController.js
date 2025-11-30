import { broadcastPlantReading } from "../ws/plantSocket.js";
import {
  ValidationError,
  errorResponseHandler,
  successResponse,
} from "../helpers.js";

import SensorReading from "../models/sensorReadings.js";
import SensorDevice from "../models/SensorDevice.js";
import { FifteenMinuteAggregator } from "../services/dataAggregator.js";

const WINDOW_24H_MS = 24 * 60 * 60 * 1000;

const currentStateByDevice = new Map();
const recentReadingsByDevice = new Map(); 

//agregator
const agg = new FifteenMinuteAggregator();

function pushToRecentCache(device_id, tsMs, metrics) {
  let arr = recentReadingsByDevice.get(device_id);
  if (!arr) {
    arr = [];
    recentReadingsByDevice.set(device_id, arr);
  }

  arr.push({ tsMs, metrics: { ...metrics } });

  const cutoff = tsMs - WINDOW_24H_MS;
  while (arr.length && arr[0].tsMs < cutoff) {
    arr.shift();
  }
}

function recomputeDerived(metrics) {
  const fore = metrics.fore_flow_temp;
  const ret = metrics.return_flow_temp;
  const flow = metrics.flow_rate;

  if (fore != null && ret != null) {
    const delta_t = fore - ret;
    metrics.delta_t = delta_t;

    if (flow != null) {
      metrics.heat_output = 4.18 * flow * delta_t;
    }
  }

  return metrics;
}

const plantController = {};

plantController.incomingPlantReading = async (req, res) => {
  try {
    const { device_id, ts, metrics, source } = req.body;

    if (!device_id || !ts || !metrics) {
      throw new ValidationError(
        400,
        "device_id, ts and metrics are required"
      );
    }

    const timestamp = new Date(ts);
    if (isNaN(timestamp.getTime())) {
      throw new ValidationError(400, "Invalid ts");
    }

    const device = await SensorDevice.findOne({ device_id }).lean();
    if (!device) {
      throw new ValidationError(400, `Unknown device_id ${device_id}`);
    }

    const effectiveSource = source || "live";

    const enrichedMetrics = recomputeDerived({ ...metrics });

    const tsMs = timestamp.getTime();
    const tsIso = timestamp.toISOString();
    const key = device_id;

    let state = currentStateByDevice.get(key);
    if (!state) {
      state = { ts: tsIso, metrics: {} };
    }

    state.ts = tsIso;
    state.metrics = {
      ...state.metrics,
      ...enrichedMetrics,
    };
    currentStateByDevice.set(key, state);

    pushToRecentCache(device_id, tsMs, state.metrics);

    const reading = await SensorReading.create({
      ts: timestamp,
      device_id,
      _device: device._id,
      source: effectiveSource,
      metrics: state.metrics,
    });

    broadcastPlantReading({
      device_id,
      ts: state.ts,
      source: effectiveSource,
      metrics: state.metrics,
    });

    return successResponse(res, { ok: true, id: reading._id });
  } catch (err) {
    console.error("[incoming/plant-reading] error:", err);
    return errorResponseHandler(err, res);
  }
};

plantController.incomingSimReading = async (req, res) => {
  try {
    const { device_id, ts, metrics, source } = req.body;

    if (!device_id || !ts || !metrics) {
      throw new ValidationError(
        400,
        "device_id, ts and metrics are required"
      );
    }

    const timestamp = new Date(ts);
    if (isNaN(timestamp.getTime())) {
      throw new ValidationError(400, "Invalid ts");
    }

    const tsMs = timestamp.getTime();
    const tsIso = timestamp.toISOString();
    const effectiveSource = source || "plant_sim";
    const key = device_id;

    // merge
    let state = currentStateByDevice.get(key);
    if (!state) {
      state = { ts: tsIso, metrics: {} };
    }

    state.ts = tsIso;
    state.metrics = {
      ...state.metrics,
      ...metrics,
    };
    state.metrics = recomputeDerived(state.metrics);
    currentStateByDevice.set(key, state);

    // cache last 24h of data
    pushToRecentCache(device_id, tsMs, state.metrics);

    // Feed into 15-min aggregator and only send that
    const result = agg.addSample(tsMs, state.metrics);

    if (result) {
      const { bucketMs, avg } = result;
      const bucketTs = new Date(bucketMs);

      const device = await SensorDevice.findOne({ device_id }).lean();
      if (!device) {
        throw new ValidationError(400, `Unknown device_id ${device_id}`);
      }

      console.log(
        "[incomingSimReading] writing 15m aggregate",
        device_id,
        "at",
        bucketTs.toISOString()
      );

      await SensorReading.create({
        ts: bucketTs,
        metrics: avg,
        source: `${effectiveSource}`,
        device_id,
        _device: device._id,
      });
    }

    broadcastPlantReading({
      device_id,
      ts: state.ts,
      source: effectiveSource,
      metrics: state.metrics,
    });

    return successResponse(res, { ok: true });
  } catch (err) {
    console.error("[incomingSimReading] error:", err);
    return errorResponseHandler(err, res);
  }
};

// send last 24h cache for dashboard
plantController.getRecentReadings = async (req, res) => {
  try {
    const { device_id } = req.params;
    const arr = recentReadingsByDevice.get(device_id) || [];
    return successResponse(res, {
      device_id,
      readings: arr.map((r) => ({
        ts: new Date(r.tsMs).toISOString(),
        metrics: r.metrics,
      })),
    });
  } catch (err) {
    return errorResponseHandler(err, res);
  }
};

plantController.debugCache = (req, res) => {
  const out = [];

  for (const [device_id, arr] of recentReadingsByDevice.entries()) {
    out.push({
      device_id,
      count: arr.length,
      first: arr[0] ? new Date(arr[0].tsMs).toISOString() : null,
      last: arr[arr.length - 1] ? new Date(arr[arr.length - 1].tsMs).toISOString() : null,
      sample: arr[0] || null,
    });
  }

  return res.json({ ok: true, devices: out });
};


export default plantController;
