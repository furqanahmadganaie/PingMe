import crypto from "crypto";
import { env } from "../config/env.js";

const monitoringMiddleware = (req, res, next) => {

    const start = process.hrtime.bigint();

    // Unique request id
    const requestId = crypto.randomUUID();

    // Attach request id to request
    req.requestId = requestId;

    // Request Size
    const requestSize =
        req.headers["content-length"] || 0;

    res.on("finish", () => {

        const end = process.hrtime.bigint();

        const duration =
            Number(end - start) / 1_000_000;

        // Response Size
        const responseSize =
            res.getHeader("content-length") || 0;

        // If authentication middleware sets req.user
        const userId =
            req.user?._id ||
            req.user?.id ||
            "Anonymous";

        // Client IP
        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress;

        // Browser / Client
        const userAgent =
            req.headers["user-agent"];

        // Environment
        const environment =
            env.nodeEnv;

        // Hostname
        const serverName =
            process.env.HOSTNAME ||
            "Localhost";

        console.log({
            timestamp: new Date().toISOString(),

            requestId,

            method: req.method,

            route: req.originalUrl,

            status: res.statusCode,

            duration: `${duration.toFixed(2)} ms`,

            ip,

            userId,

            requestSize: `${requestSize} Bytes`,

            responseSize: `${responseSize} Bytes`,

            userAgent,

            environment,

            serverName
        });

    });

    next();
};

export default monitoringMiddleware;