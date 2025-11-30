import { WebSocketServer } from "ws";
import { FifteenMinuteAggregator } from "../services/dataAggregator.js";
import FifteenMinModel from "../models/FifteenMinModel.js";

const agg = new FifteenMinuteAggregator();

let wss = null;
const plantClients = new Set();

export function initPlantWebSocketServer(server) {
  wss = new WebSocketServer({ server, path: "/ws/plant" });

  wss.on("connection", (ws) => {
    plantClients.add(ws);
    console.log(`WS connected. Total: ${plantClients.size}`);

    ws.on("close", () => {
      plantClients.delete(ws);
      console.log(`WS disconnected. Total: ${plantClients.size}`);
    });

    ws.on("error", (err) => {
      console.error("WS error:", err);
      plantClients.delete(ws);
    });
  });

  console.log("web socket started");
}

export async function broadcastPlantReading(reading) {
  console.log("[ws broadcast]", JSON.stringify(payload));
  if (!wss) return;

  const nowTsMs = Date.now();

  const result = agg.addSample(nowTsMs, reading);
  if (result) {
    const { bucketMs, avg } = result;
    const bucketTs = new Date(bucketMs); // hh:00:00, hh:15:00, etc

    try {
      await FifteenMinModel.create({
        timestamp: bucketTs,
        ...avg,
      });
    } catch (err) {
      console.error("Failed to save 15-min aggregate:", err);
    }
  }

  const msg = JSON.stringify({
    type: "plant-reading",
    t: nowTsMs,
    ...reading,
  });

  for (const ws of plantClients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  }
}
