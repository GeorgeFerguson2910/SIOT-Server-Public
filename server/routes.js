import express from "express";

import authController from "./controllers/authController.js";
import plantController from "./controllers/plantController.js";
import { notifyNewFaults } from "./services/notificationService.js";

const routes = express();

routes.get("/test-notify", async (req, res) => {
  await notifyNewFaults(["test_fault"], {
    device_id: "test_device",
    ts: Date.now()
  });

  res.json({ ok: true, message: "Test notification sent" });
});

// Status
routes.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Application is up and running",
  });
});

// Plant incoming data
routes.post("/incoming/plant-reading", plantController.incomingPlantReading);
routes.post("/incoming/sim-reading", plantController.incomingSimReading);

// 24h cache
routes.get("/recent/:device_id", plantController.getRecentReadings);
routes.get("/debug/cache", plantController.debugCache);

// Historic readings from MongoDB
routes.get("/plant/history", plantController.getHistory);

// Authentication
routes.post("/login", authController.login);
routes.post("/refresh-session", authController.refreshSession);

export default routes;
