
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);


import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js';
import { app,server} from "./lib/socket.js";
import { env } from "./config/env.js";
import monitoringMiddleware from "./middleware/monitoring.Middleware.js";

const PORT = env.port;


app.use(express.json({limit:"10mb"})); 
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser()); 

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
// Monitoring
app.use(monitoringMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/messages",messageRoutes);

connectDB()
  .then(() => {
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Stop the existing backend process before starting another one.`
        );
        process.exit(1);
      }

      throw error;
    });

    server.listen(PORT, () => {
      console.log(`server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
