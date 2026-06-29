import client from "prom-client";

/*
|--------------------------------------------------------------------------
| Registry
|--------------------------------------------------------------------------
*/

export const register = new client.Registry();

/*
|--------------------------------------------------------------------------
| Default Node.js Metrics
|--------------------------------------------------------------------------
*/

client.collectDefaultMetrics({
    register,
    prefix: "pingme_",
});

/*
|--------------------------------------------------------------------------
| HTTP Request Counter
|--------------------------------------------------------------------------
*/

export const httpRequestsTotal = new client.Counter({

    name: "pingme_http_requests_total",

    help: "Total number of HTTP requests",

    labelNames: [
        "method",
        "route",
        "status"
    ],

    registers: [register],

});

/*
|--------------------------------------------------------------------------
| HTTP Errors Counter
|--------------------------------------------------------------------------
*/

export const httpErrorsTotal = new client.Counter({

    name: "pingme_http_errors_total",

    help: "Total number of HTTP errors",

    labelNames: [
        "method",
        "route",
        "status"
    ],

    registers: [register],

});

/*
|--------------------------------------------------------------------------
| HTTP Request Duration
|--------------------------------------------------------------------------
*/

export const httpRequestDuration = new client.Histogram({

    name: "pingme_http_request_duration_seconds",

    help: "HTTP request duration in seconds",

    labelNames: [
        "method",
        "route",
        "status"
    ],

    buckets: [
        0.005,
        0.01,
        0.025,
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2,
        5
    ],

    registers: [register],

});

/*
|--------------------------------------------------------------------------
| Active Socket Users
|--------------------------------------------------------------------------
*/

export const activeUsersGauge = new client.Gauge({

    name: "pingme_active_users",

    help: "Current connected users",

    registers: [register],

});