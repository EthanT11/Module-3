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

// Import Colyseus config
import app from "./app.config";

// Create Express app
const expressApp = express();
expressApp.use(cors({
  origin: ["https://idyllic-biscuit-59d1a9.netlify.app/", "http://localhost:5173"],
  credentials: true
}));

// Create and listen on 2567 (or PORT environment variable.)
listen(app);
