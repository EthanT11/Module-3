/**
 * IMPORTANT:
 * ---------
 * Do not manually edit this file if you'd like to host your server on Colyseus Cloud
 *
 * If you're self-hosting (without Colyseus Cloud), you can manually
 * instantiate a Colyseus Server as documented here:
 *
 * See: https://docs.colyseus.io/server/api/#constructor-options
 */
import { listen } from "@colyseus/tools";
import cors from "cors";
import express from "express";
import { monitor } from "@colyseus/monitor";

// Import Colyseus config
import app from "./app.config";

// Import express
const expressApp = express();

// Add CORS to express app
expressApp.use(cors());
expressApp.options("*", cors());

// Add routes to express app
expressApp.get("/", (req, res) => {
  res.send("Colyseus Server Running");
});

// Add monitor to express app
expressApp.use("/colyseus", monitor());

// Create and listen on 2567 (or PORT environment variable.)
const port = Number(process.env.PORT) || 2567;
listen(app, port);
console.log(`Listening on port ${port}`);
