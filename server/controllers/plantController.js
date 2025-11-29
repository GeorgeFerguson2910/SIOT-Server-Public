import { broadcastPlantReading } from "../ws/plantSocket.js";
import {
  ValidationError,
  errorResponseHandler,
  successResponse,
} from "../helpers.js";

const currentStateByDevice = new Map();

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

plantController.ingestReading = async (req, res) => {
  try {
    const { deviceId, nodeId, ts, metrics, source } = req.body;

    if (!deviceId || !nodeId || !ts || !metrics) {
      throw new ValidationError(400, "deviceId, nodeId, ts and metrics are required");
    }

    const timestamp = new Date(ts);
    if (isNaN(timestamp.getTime())) {
      throw new ValidationError(400, "Invalid ts");
    }

    //in case i want raw stuff
    // await db.SensorReading.create({
    //   deviceId,
    //   nodeId,
    //   ts: timestamp,
    //   source: source || "simulator",
    //   metrics,
    // });

    // 2) Merge into current full state for this device
    const key = deviceId;
    const tsIso = timestamp.toISOString();

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

    broadcastPlantReading({
      deviceId,
      ts: state.ts,
      source: source || "simulator",
      nodeId,
      metrics: state.metrics,
    });

    return successResponse(res, { ok: true });
  } catch (err) {
    console.error("Ingest error:", err);
    return errorResponseHandler(err, res);
  }
};

export default plantController;
