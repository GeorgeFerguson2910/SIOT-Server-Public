import http from "http";
import app from "./app.js";
import { initPlantWebSocketServer } from "./ws/plantSocket.js";

const PORT = process.env.PORT || 4000;

// Create server
const server = http.createServer(app);

// websocket
initPlantWebSocketServer(server);

// start websocket and server
server.listen(PORT, () => {
  console.log(` HTTP+WS server listening on port ${PORT}`);
  console.log(` HTTP: http://localhost:${PORT}`);
  console.log(` WS:   ws://localhost:${PORT}/ws/plant`);
});
