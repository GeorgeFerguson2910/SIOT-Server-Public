const SensorReadingSchema = new mongoose.Schema({
  deviceId: { type: String, index: true },
  ts: { type: Date, index: true },
  source: String,
  metrics: {
    type: Map,
    of: Number,
  },
});

SensorReadingSchema.index({ deviceId: 1, ts: 1 }, { unique: true });
