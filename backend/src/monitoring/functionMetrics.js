import client from "prom-client";

import { register } from "./prometheus.js";

export const functionDuration = new client.Histogram({

    name: "pingme_function_duration_seconds",

    help: "Execution time of application functions",

    labelNames: [
        "function_name",
        "status",
    ],

    buckets: [
        0.001,
        0.005,
        0.01,
        0.05,
        0.1,
        0.2,
        0.5,
        1,
        2,
        5,
    ],

    registers: [register],

});

export const functionCalls = new client.Counter({

    name: "pingme_function_calls_total",

    help: "Total number of function executions",

    labelNames: [
        "function_name",
        "status",
    ],

    registers: [register],

});