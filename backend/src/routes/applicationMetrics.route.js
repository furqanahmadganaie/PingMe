import express from "express";
import { getApplicationMetrics } from "../monitoring/applicationMetrics.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      metrics: getApplicationMetrics(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;