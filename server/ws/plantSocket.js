import { WebSocketServer } from "ws";

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

export function broadcastPlantReading(reading) {
  if (!wss) return;

  const msg = JSON.stringify({
    type: "plant-reading",
    ...reading,
  });

  for (const ws of plantClients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  }
}
