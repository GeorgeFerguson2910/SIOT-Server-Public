// scripts/importCsvToMongo.js
// Usage:
//   node importCsvToMongo.js <collectionName> <path/to/file.csv> [source] [deviceId]
//
// Example for O2 CSV:
//   node importCsvToMongo.js sensor_readings data/o2.csv historical plant_1
//
// Example for temps CSV:
//   node importCsvToMongo.js sensor_readings data/temps_t1_t5.csv historical plant_1

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import csv from "csv-parser";

dotenv.config();

// ✅ Use Node env, not React env
const MONGO_URI = "mongodb+srv://georgewferguson:Jarocin1962@cluster0.wx0js61.mongodb.net/";

if (!MONGO_URI) {
  console.error("❌ No DATABASE / MONGO_URI found in .env");
  process.exit(1);
}

const [,, collectionName, csvPathArg, sourceArg, deviceIdArg] = process.argv;

if (!collectionName || !csvPathArg) {
  console.error("Usage: node importCsvToMongo.js <collectionName> <path/to/file.csv> [source] [deviceId]");
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👉 Resolve CSV path from *current working directory* so you can run from preprocessing/
const csvFilePath = path.resolve(process.cwd(), csvPathArg);
console.log("📄 CSV path:", csvFilePath);

// ---------- Helpers ----------

// Strip units like "796 °C", "11.9%", etc. and convert to Number
const toNum = (val) => {
  if (val === "" || val == null) return null;
  const cleaned = String(val)
    .replace(/[^0-9.,-]/g, "") // keep digits, dot, comma, minus
    .replace(",", ".");        // normalize decimal comma

  if (cleaned === "") return null;
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
};

const toDate = (val) => {
  if (!val) return null;
  const s = String(val).trim();

  // Match: 13/09/2025 00:15 or 13/09/2025 00:15:30
  const m = s.match(
    /^(\d{2})\/(\d{2})\/(\d{4})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/
  );

  if (m) {
    const [, dd, mm, yyyy, hh, min, ss] = m;
    // Local time:
    return new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      ss ? Number(ss) : 0
    );
  }

  // Fallback: try native parser (for ISO-like strings, etc.)
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

// Default auto-cast (not used in the custom mapping but kept for events/_default)
const autoCastRow = (row) => {
  const doc = {};
  for (const [key, raw] of Object.entries(row)) {
    const val = raw?.trim?.() ?? raw;

    if (val === "" || val == null) {
      doc[key] = null;
      continue;
    }

    const n = Number(val);
    if (!Number.isNaN(n) && val !== "") {
      doc[key] = n;
      continue;
    }

    const d = new Date(val);
    if (!Number.isNaN(d.getTime()) && /^\d{4}-\d{2}-\d{2}/.test(val)) {
      doc[key] = d;
      continue;
    }

    doc[key] = val;
  }
  return doc;
};

// ---------- Per-collection mapping ----------

const COLLECTION_TRANSFORMS = {
  // Your main time-series collection
  sensor_readings: (row, ctx) => {
    // Your CSV uses "Time" as the timestamp column
    const ts = toDate(row.Time);

    const deviceId =
      row.deviceId ||
      row.device_id ||
      ctx.defaultDeviceId ||
      "unknown_device";

    const source =
      row.source ||
      ctx.source ||
      "historical";

    const metrics = {};

    // O2 CSV:
    // "Time","prozess.sensor.sonst.sauerstoff"
    if (row["prozess.sensor.sonst.sauerstoff"] != null) {
      metrics.o2_percent = toNum(row["prozess.sensor.sonst.sauerstoff"]);
    }

    // Temps CSV:
    // "Time","prozess.sensor.temp.t1 ET_200SP","prozess.sensor.temp.t2 ET_200SP",...
    if (row["prozess.sensor.temp.t1 ET_200SP"] != null) {
      metrics.temp_T1 = toNum(row["prozess.sensor.temp.t1 ET_200SP"]);
    }
    if (row["prozess.sensor.temp.t2 ET_200SP"] != null) {
      metrics.temp_T2 = toNum(row["prozess.sensor.temp.t2 ET_200SP"]);
    }
    if (row["prozess.sensor.temp.t3 ET_200SP"] != null) {
      metrics.temp_T3 = toNum(row["prozess.sensor.temp.t3 ET_200SP"]);
    }
    if (row["prozess.sensor.temp.t4 ET_200SP"] != null) {
      metrics.temp_T4 = toNum(row["prozess.sensor.temp.t4 ET_200SP"]);
    }
    if (row["prozess.sensor.temp.t5 ET_200SP"] != null) {
      metrics.temp_T5 = toNum(row["prozess.sensor.temp.t5 ET_200SP"]);
    }

    // --- Heat output loop: fore/return, deltaT, flow, heat ---

    // heat output data (FF/RF side)
    if (row["prozess.sensor.temp.t8 ET_200SP"] != null) {
      metrics.return_flow_temp = toNum(row["prozess.sensor.temp.t8 ET_200SP"]);
    }

    if (row["prozess.sensor.temp.t7 ET_200SP"] != null) {
      metrics.fore_flow_temp = toNum(row["prozess.sensor.temp.t7 ET_200SP"]);
    }

    // ΔT = fore - return
    if (metrics.fore_flow_temp != null && metrics.return_flow_temp != null) {
      metrics.delta_t = metrics.fore_flow_temp - metrics.return_flow_temp;
    }

    // flow rate (kg/s)
    if (row["flow.rate"] != null) {
      metrics.flow_rate = toNum(row["flow.rate"]);
    }

    if (row["prozess.aktor.pyrolyse.m26_drehzahl_unterdruckventilator ET_200SP"] != null) {
      metrics.fan_speed = toNum(row["prozess.aktor.pyrolyse.m26_drehzahl_unterdruckventilator ET_200SP"]);
    }

    // compute heat output (kW) ONLY if both deltaT and flow_rate exist
    if (metrics.delta_t != null && metrics.flow_rate != null) {
      const cp = 4.18; // kJ/kgK for water
      metrics.heat_output = metrics.flow_rate * cp * metrics.delta_t;
    }

    // --- Exhaust gas data ---

    if (row["prozess.sensor.sonst.unterdruck ET_200SP"] != null) {
      const raw = row["prozess.sensor.sonst.unterdruck ET_200SP"].toString().trim();

      // extract numeric part
      const num = toNum(raw);

      if (num != null) {
        // detect units
        if (/µbar|microbar/i.test(raw)) {
          // µbar → mbar (1 mbar = 1000 µbar)
          metrics.gas_pressure = num / 1000;
        } else if (/mbar/i.test(raw)) {
          // already in mbar
          metrics.gas_pressure = num;
        } else {
          // fallback: assume value is already in mbar
          metrics.gas_pressure = num;
        }
      }
    }

    // Exhaust temp
    if (row["prozess.sensor.temp.t6"] != null) {
      metrics.gas_temp = toNum(row["prozess.sensor.temp.t6"]);
    }

    // --- Buffer tanks (T9/T10) ---

    if (row["prozess.sensor.temp.t10 ET_200SP"] != null) {
      metrics.buffer_lower_temp = toNum(row["prozess.sensor.temp.t10 ET_200SP"]);
    }

    if (row["prozess.sensor.temp.t9 ET_200SP"] != null) {
      metrics.buffer_upper_temp = toNum(row["prozess.sensor.temp.t9 ET_200SP"]);
    }

    return {
      deviceId,
      ts,
      source,
      metrics,
    };
  },

  // Example: events collection (faults, maintenance, etc.)
  events: (row, ctx) => ({
    deviceId: row.deviceId || row.device_id || ctx.defaultDeviceId || "unknown_device",
    ts: toDate(row.timestamp || row.time || row.ts),
    eventType: row.eventType || row.type || "fault",
    code: row.code || row.faultCode || null,
    message: row.message || row.description || null,
    raw: autoCastRow(row),
  }),

  _default: (row) => autoCastRow(row),
};

// ---------- Main import logic with upsert/merge (simplified, no pause/resume) ----------

async function importCsv() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const ctx = {
    source: sourceArg,           // e.g. "historical", "simulated"
    defaultDeviceId: deviceIdArg // e.g. "plant_1"
  };

  const transform =
    COLLECTION_TRANSFORMS[collectionName] || COLLECTION_TRANSFORMS._default;

  console.log(`📄 Importing ${csvFilePath} into collection "${collectionName}"`);

  const rawDocs = [];

  // 1) Read the CSV into memory and transform rows
  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const transformed = transform(row, ctx);
          if (!transformed) return;

          const { deviceId, ts, source, metrics } = transformed;

          if (!ts || !deviceId || !metrics || Object.keys(metrics).length === 0) {
            return; // skip bad/empty rows
          }

          rawDocs.push({ deviceId, ts, source, metrics });
        } catch (err) {
          console.error("⚠️ Error transforming row:", err);
        }
      })
      .on("end", () => {
        console.log(`✅ Finished reading CSV (${rawDocs.length} valid rows)`);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });

  if (!rawDocs.length) {
    console.log("No valid rows found, nothing to insert.");
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }

  // 2) Build bulk upsert operations from transformed docs
  const collection = mongoose.connection.collection(collectionName);
  const BATCH_SIZE = 2000;
  let totalUpserts = 0;

  for (let i = 0; i < rawDocs.length; i += BATCH_SIZE) {
    const batch = rawDocs.slice(i, i + BATCH_SIZE);
    const bulkOps = [];

    for (const { deviceId, ts, source, metrics } of batch) {
      const metricsSet = {};
      for (const [k, v] of Object.entries(metrics)) {
        if (v == null) continue;
        metricsSet[`metrics.${k}`] = v;
      }
      if (!Object.keys(metricsSet).length) continue;

      bulkOps.push({
        updateOne: {
          filter: { deviceId, ts },
          update: {
            $set: {
              source,
              ...metricsSet,
            },
            $setOnInsert: {
              deviceId,
              ts,
            },
          },
          upsert: true,
        },
      });
    }

    if (!bulkOps.length) continue;

    const res = await collection.bulkWrite(bulkOps, { ordered: false });
    totalUpserts += res.upsertedCount || 0;
    console.log(`📥 Processed batch ${i / BATCH_SIZE + 1}, total upserts so far: ${totalUpserts}`);
  }

  console.log(`🎉 Done. Processed ${rawDocs.length} rows into "${collectionName}"`);
  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB");
}

importCsv().catch((err) => {
  console.error("❌ Import failed:", err);
  process.exit(1);
});
