import express from "express";

import authController from "./controllers/authController.js";
import plantController from "./controllers/plantController.js";

const routes = express();

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


// Authentication
routes.post("/login", authController.login);
routes.post("/refresh-session", authController.refreshSession);

export default routes;
