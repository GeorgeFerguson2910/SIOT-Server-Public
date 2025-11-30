const BUCKET_MS = 15 * 60 * 1000; // 15 mins

export class FifteenMinuteAggregator {
  constructor() {
    this.currentBucketStartMs = null;
    this.sums = {};
    this.counts = {};
  }

  static alignToBucket(tsMs) {
    return Math.floor(tsMs / BUCKET_MS) * BUCKET_MS;
  }

  _accumulate(metrics) {
    for (const [key, value] of Object.entries(metrics || {})) {
      if (typeof value !== "number" || Number.isNaN(value)) continue;
      if (!this.sums[key]) {
        this.sums[key] = 0;
        this.counts[key] = 0;
      }
      this.sums[key] += value;
      this.counts[key] += 1;
    }
  }

  _flushCurrentBucket() {
    if (this.currentBucketStartMs == null) return null;

    const avg = {};
    for (const [key, sum] of Object.entries(this.sums)) {
      const c = this.counts[key] || 1;
      avg[key] = sum / c;
    }

    const bucketMs = this.currentBucketStartMs;

    this.currentBucketStartMs = null;
    this.sums = {};
    this.counts = {};

    return { bucketMs, avg };
  }

  addSample(tsMs, metrics) {
    const bucketStart = FifteenMinuteAggregator.alignToBucket(tsMs);

    if (this.currentBucketStartMs === null) {
      this.currentBucketStartMs = bucketStart;
    }

    if (bucketStart > this.currentBucketStartMs) {
      const result = this._flushCurrentBucket();

      this.currentBucketStartMs = bucketStart;
      this._accumulate(metrics);

      return result;
    }

    this._accumulate(metrics);
    return null;
  }

  flush() {
    return this._flushCurrentBucket();
  }
}
