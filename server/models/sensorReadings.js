import mongoose from "mongoose";

const SensorReadingSchema = new mongoose.Schema(
  {
    deviceId: { type: String, index: true, required: true },
    ts: { type: Date, index: true, required: true },
    source: { type: String },

    metrics: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: false,
    collection: "sensor_readings",
  }
);

SensorReadingSchema.index({ deviceId: 1, ts: 1 }, { unique: true }); // historic data all has same device id of plant_1

const SensorReading = mongoose.model("SensorReading", SensorReadingSchema);
export default SensorReading;
