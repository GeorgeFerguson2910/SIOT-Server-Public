// models/PlantReading.js
import mongoose from "mongoose";

const MetricsSchema = new mongoose.Schema(
  {
    buffer_lower_temp: { type: Number },
    buffer_upper_temp: { type: Number },
    fan_speed: { type: Number },
    gas_temp: { type: Number },
    fore_flow_temp: { type: Number },
    return_flow_temp: { type: Number },
    o2_percent: { type: Number },

    temp_T1: { type: Number },
    temp_T2: { type: Number },
    temp_T3: { type: Number },
    temp_T4: { type: Number },
    temp_T5: { type: Number },

    flow_rate: { type: Number },
    delta_t: { type: Number },
    heat_output: { type: Number },
    gas_pressure: { type: Number },
  },
  {
    _id: false,
  }
);

const SensorReadingSchema = new mongoose.Schema(
  {
    ts: {
      type: Date,
      required: true,
      index: true,
    },

    device_id: {
      type: String,
      required: true,
      index: true,
    },

    _device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SensorDevice",
      required: true,
      index: true,
    },

    source: {
      type: String,
      enum: ["historical", "plant_sim", "live"],
      required: true,
      index: true,
    },

    metrics: MetricsSchema,
  },
  {
    collection: "sensor_readings",
    timestamps: false,
  }
);

const SensorReading = mongoose.model("SensorReading", SensorReadingSchema);
export default SensorReading;
