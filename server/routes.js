import express from "express"; // controller imports

import authController from "./controllers/authController.js";

var routes = express(); // '/' default page message

routes.get("/", function (req, res) {
  return res.status(200).json({
    success: true,
    message: "Application is up and running"
  });
});

routes.post("/login", authController.login);
routes.post("/refresh-session", authController.refreshSession);

export default routes;