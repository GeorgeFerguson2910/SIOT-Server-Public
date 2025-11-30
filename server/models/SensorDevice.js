import mongoose from "mongoose";

const MetricDefinitionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    unit: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const SensorDeviceSchema = new mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    group: {
      type: String,
      required: true,
      index: true,
    },

    metrics: {
      type: Map,
      of: MetricDefinitionSchema,
      required: true,
    },
  },
  {
    collection: "sensor_devices",
    timestamps: false,
  }
);

const SensorDevice = mongoose.model("SensorDevice", SensorDeviceSchema);
export default SensorDevice;
