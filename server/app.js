import express from "express";
import mongoose from "mongoose";
import fetch from 'node-fetch';
import bodyParser from "body-parser";
import formData from 'express-form-data';
import cors from "cors";
import routes from "./routes.js";
import { jwtParser } from './helpers.js';
import dotenv from "dotenv";
import jwtExcludedRoutes from "./config/jwtRoutes.js";

// Load environment variables from .env
dotenv.config();

// === Database Connection ===
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  const dbEnv = process.env.DATABASE.includes('staging')
    ? '🟡 STAGING'
    : process.env.DATABASE.includes('cluster')
    ? '🟢 PRODUCTION'
    : '⚪ UNKNOWN ENV';
    
  console.log(`✅ Connected to MongoDB — ${dbEnv}`);
})
.catch(err => console.error("❌ MongoDB connection failed:", err));

// === Create Express App ===
const app = express();

// === Global Middleware ===
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
function formDataUnless(jwtExcludedRoutes) {
  const parser = formData.parse();

  return (req, res, next) => {
    const match = jwtExcludedRoutes.some(route => {
      const methodMatch = route.methods.includes(req.method);
      const pathMatch =
        typeof route.url === "string"
          ? route.url === req.path
          : route.url.test(req.path);

      return methodMatch && pathMatch;
    });

    if (match) {
      return next(); // skip formData.parse for these routes
    }

    return parser(req, res, next); // apply formData.parse otherwise
  };
}

// === JWT Auth Middleware ===
// Only applies to routes not listed in the `path` exclusions, in the future use utils config file.
app.use(jwtParser.unless({
  path: [
    { url: "/admin", methods: ["POST"] },
    { url: "/user", methods: ["POST"] },
    { url: "/login", methods: ["POST"] },
    { url: "/support-ticket", methods: ["POST"] },
    { url: "/sensor-readings", methods: ['GET'] },
  ]
}));

// === Routes ===
app.use("/", routes);

export default app;