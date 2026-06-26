import os from "os";
import process from "process";

/*
|--------------------------------------------------------------------------
| Application Statistics
|--------------------------------------------------------------------------
*/

const applicationStats = {
  startTime: Date.now(),

  totalRequests: 0,

  requestsThisSecond: 0,
  requestsThisMinute: 0,

  requestsPerSecond: 0,
  requestsPerMinute: 0,
};

/*
|--------------------------------------------------------------------------
| Calculate Requests / Second
|--------------------------------------------------------------------------
*/

setInterval(() => {
  applicationStats.requestsPerSecond =
    applicationStats.requestsThisSecond;

  applicationStats.requestsThisSecond = 0;
}, 1000);

/*
|--------------------------------------------------------------------------
| Calculate Requests / Minute
|--------------------------------------------------------------------------
*/

setInterval(() => {
  applicationStats.requestsPerMinute =
    applicationStats.requestsThisMinute;

  applicationStats.requestsThisMinute = 0;
}, 60000);

/*
|--------------------------------------------------------------------------
| Increment Request Counters
|--------------------------------------------------------------------------
*/

export function incrementRequestCounter() {
  applicationStats.totalRequests++;

  applicationStats.requestsThisSecond++;

  applicationStats.requestsThisMinute++;
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function bytesToMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor((seconds % 3600) / 60);

  const secs = Math.floor(seconds % 60);

  return `${hrs}h ${mins}m ${secs}s`;
}

/*
|--------------------------------------------------------------------------
| Main Function
|--------------------------------------------------------------------------
*/

export function getApplicationMetrics() {

  const memory = process.memoryUsage();

  const cpu = process.cpuUsage();

  const totalRam = os.totalmem();

  const freeRam = os.freemem();

  return {

    process: {

      pid: process.pid,

      nodeVersion: process.version,

      environment:
        process.env.NODE_ENV || "development",

      platform: process.platform,

      architecture: process.arch,

      uptime: formatUptime(process.uptime()),

      startedAt: new Date(
        applicationStats.startTime
      ).toISOString(),
    },

    system: {

      hostname: os.hostname(),

      operatingSystem: os.type(),

      release: os.release(),

      cpuCores: os.cpus().length,

      loadAverage: os.loadavg(),

      totalRAM: `${bytesToMB(totalRam)} MB`,

      freeRAM: `${bytesToMB(freeRam)} MB`,

      ramUsage: `${(
        ((totalRam - freeRam) / totalRam) *
        100
      ).toFixed(2)} %`,
    },

    cpu: {

      userCPUTime:
        `${(cpu.user / 1000).toFixed(2)} ms`,

      systemCPUTime:
        `${(cpu.system / 1000).toFixed(2)} ms`,

      totalCPUTime:
        `${(
          (cpu.user + cpu.system) /
          1000
        ).toFixed(2)} ms`,
    },

    memory: {

      rss:
        `${bytesToMB(memory.rss)} MB`,

      heapUsed:
        `${bytesToMB(memory.heapUsed)} MB`,

      heapTotal:
        `${bytesToMB(memory.heapTotal)} MB`,

      heapUsage:
        `${(
          (memory.heapUsed /
            memory.heapTotal) *
          100
        ).toFixed(2)} %`,

      external:
        `${bytesToMB(memory.external)} MB`,

      arrayBuffers:
        `${bytesToMB(memory.arrayBuffers)} MB`,
    },

    runtime: {

      activeHandles:
        process._getActiveHandles().length,

      activeRequests:
        process._getActiveRequests().length,
    },

    traffic: {

      totalRequests:
        applicationStats.totalRequests,

      requestsPerSecond:
        applicationStats.requestsPerSecond,

      requestsPerMinute:
        applicationStats.requestsPerMinute,
    },
  };
}