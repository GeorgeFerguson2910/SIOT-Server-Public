// controllers/plantController.js

import { broadcastPlantReading } from "../ws/plantSocket.js";
import {
  ValidationError,
  errorResponseHandler,
  successResponse,
} from "../helpers.js";

import SensorReading from "../models/sensorReadings.js";
import SensorDevice from "../models/SensorDevice.js";
import { FifteenMinuteAggregator } from "../services/dataAggregator.js";
import { detectFaults } from "../services/faultDetector.js";
import { notifyNewFaults } from "../services/notificationService.js";

const WINDOW_24H_MS = 24 * 60 * 60 * 1000;

const currentStateByDevice = new Map();
const recentReadingsByDevice = new Map();

// last known fault state (plant-wide), used to detect transitions
let lastFaults = null;

// aggregator (used for sim 15-min buckets)
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

// Compare previous and current faults, return list that just went false → true
function getNewlyActiveFaults(prev, current) {
  if (!current) return [];
  if (!prev) {
    // first time: any true flags count as "new"
    return Object.entries(current)
      .filter(([, v]) => v === true)
      .map(([k]) => k);
  }

  const newlyActive = [];
  for (const [key, value] of Object.entries(current)) {
    const prevVal = prev[key];
    if (value === true && prevVal !== true) {
      newlyActive.push(key);
    }
  }
  return newlyActive;
}

const plantController = {};

// ---------- LIVE PLANT READINGS ----------

plantController.incomingPlantReading = async (req, res) => {
  try {
    const { device_id, ts, metrics, source } = req.body;

    if (!device_id || !ts || !metrics) {
      throw new ValidationError(400, "device_id, ts and metrics are required");
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

    // 🧠 infer faults purely from currentStateByDevice (no sim help)
    const inferredFaults = detectFaults(currentStateByDevice);

    // 🔔 detect newly active faults (false → true) and notify
    const newlyActive = getNewlyActiveFaults(lastFaults, inferredFaults);
    if (newlyActive.length > 0) {
      notifyNewFaults(newlyActive, {
        device_id,
        ts: state.ts,
        metrics: state.metrics,
      }).catch((err) => {
        console.error("[notifyNewFaults] error:", err);
      });
    }
    lastFaults = inferredFaults;

    // broadcast including inferred faults
    broadcastPlantReading({
      device_id,
      ts: state.ts,
      source: effectiveSource,
      metrics: state.metrics,
      faults: inferredFaults,
    });

    return successResponse(res, { ok: true, id: reading._id });
  } catch (err) {
    console.error("[incoming/plant-reading] error:", err);
    return errorResponseHandler(err, res);
  }
};

// ---------- SIMULATED READINGS ----------

plantController.incomingSimReading = async (req, res) => {
  try {
    const { device_id, ts, metrics, source } = req.body;

    if (!device_id || !ts || !metrics) {
      throw new ValidationError(400, "device_id, ts and metrics are required");
    }

    const timestamp = new Date(ts);
    if (isNaN(timestamp.getTime())) {
      throw new ValidationError(400, "Invalid ts");
    }

    const tsMs = timestamp.getTime();
    const tsIso = timestamp.toISOString();
    const effectiveSource = source || "plant_sim";
    const key = device_id;

    // merge into per-device state
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

    // Feed into 15-min aggregator and only save the aggregate
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

    // 🧠 infer faults from current plant state
    const inferredFaults = detectFaults(currentStateByDevice);

    // 🔔 detect newly active faults and notify
    const newlyActive = getNewlyActiveFaults(lastFaults, inferredFaults);
    if (newlyActive.length > 0) {
      notifyNewFaults(newlyActive, {
        device_id,
        ts: state.ts,
        metrics: state.metrics,
      }).catch((err) => {
        console.error("[notifyNewFaults] error:", err);
      });
    }
    lastFaults = inferredFaults;

    broadcastPlantReading({
      device_id,
      ts: state.ts,
      source: effectiveSource,
      metrics: state.metrics,
      faults: inferredFaults,
    });

    return successResponse(res, { ok: true });
  } catch (err) {
    console.error("[incomingSimReading] error:", err);
    return errorResponseHandler(err, res);
  }
};

// ---------- LAST 24h CACHE FOR DASHBOARD ----------

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
      last: arr[arr.length - 1]
        ? new Date(arr[arr.length - 1].tsMs).toISOString()
        : null,
      sample: arr[0] || null,
    });
  }

  return res.json({ ok: true, devices: out });
};

// ---------- Historic history endpoint ----------

const HISTORY_DEFAULT_DEVICE_IDS = [
  "plant_1_historic_data",
  "plant_1_reactor_temp_node_1",
  "plant_1_buffer_node_1",
  "plant_1_heat_output_node_1",
  "plant_1_exhaust_node_1",
];

/**
 * GET /plant/history
 *
 * Query params:
 *   from     (ISO string or YYYY-MM-DD, optional)
 *   to       (ISO string or YYYY-MM-DD, optional)
 *   limit    (number, optional, default 2000)
 *   devices  (comma-separated list of device_ids, optional)
 *
 * Response:
 *   [ { ts, metrics, device_id, _device, source }, ... ]
 */
plantController.getHistory = async (req, res) => {
  try {
    const { from, to, limit = 2000, devices } = req.query;

    const deviceIds = devices
      ? String(devices)
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      : HISTORY_DEFAULT_DEVICE_IDS;

    if (!deviceIds.length) {
      throw new ValidationError(400, "No device_ids provided");
    }

    const query = {
      device_id: { $in: deviceIds },
    };

    let fromDate = null;
    let toDate = null;

    if (from) {
      const d = new Date(from);
      if (isNaN(d.getTime())) {
        throw new ValidationError(400, "Invalid 'from' timestamp");
      }
      fromDate = d;
    }

    if (to) {
      const d = new Date(to);
      if (isNaN(d.getTime())) {
        throw new ValidationError(400, "Invalid 'to' timestamp");
      }
      toDate = d;
    }

    // Optional: if no dates given at all, default to last 24h
    if (!fromDate && !toDate) {
      const now = Date.now();
      fromDate = new Date(now - WINDOW_24H_MS);
      toDate = new Date(now);
    }

    if (fromDate || toDate) {
      query.ts = {};
      if (fromDate) query.ts.$gte = fromDate;
      if (toDate) query.ts.$lte = toDate;
    }

    const numLimit = Number(limit) || 2000;

    const docs = await SensorReading.find(query, {
      ts: 1,
      metrics: 1,
      device_id: 1,
      _device: 1,
      source: 1,
    })
      .sort({ ts: 1 })
      .limit(numLimit);

    return successResponse(res, docs);
  } catch (err) {
    console.error("[GET /plant/history] error:", err);
    return errorResponseHandler(err, res);
  }
};

export default plantController;
