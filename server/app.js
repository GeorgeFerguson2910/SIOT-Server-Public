import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes.js";
import { jwtParser } from "./helpers.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const dbEnv = process.env.DATABASE.includes("staging")
      ? "🟡 STAGING"
      : process.env.DATABASE.includes("cluster")
      ? "🟢 PRODUCTION"
      : "⚪ UNKNOWN ENV";

    console.log(`Connected to MongoDB — ${dbEnv}`);
  })
  .catch((err) => console.error("MongoDB connection failed:", err));

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//routes that dont need a login
app.use(
  jwtParser.unless({
    path: [
      { url: "/user", methods: ["POST"] },
      { url: "/login", methods: ["POST"] },
      { url: "/support-ticket", methods: ["POST"] },
      { url: "/ingest/plant-reading", methods: ["POST"] },
    ],
  })
);

// === Routes ===
app.use("/", routes);

export default app;
