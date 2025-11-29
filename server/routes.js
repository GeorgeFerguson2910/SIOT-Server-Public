import express from "express";

import authController from "./controllers/authController.js";
import plantController from "./controllers/plantController.js";

var routes = express();

routes.get("/", function (req, res) {
  return res.status(200).json({
    success: true,
    message: "Application is up and running"
  });
});

routes.post("/ingest/plant-reading", plantController.ingestReading);

routes.post("/login", authController.login);
routes.post("/refresh-session", authController.refreshSession);

export default routes;