const metrics = new Map();

function initializeMetric(route) {
  if (!metrics.has(route)) {
    metrics.set(route, {
      requests: 0,

      success: 0,

      clientErrors: 0,

      serverErrors: 0,

      totalResponseTime: 0,

      averageResponseTime: 0,

      maxResponseTime: 0,

      minResponseTime: Infinity,

      successRate: 0,

      errorRate: 0,

      lastRequestAt: null,
    });
  }

  return metrics.get(route);
}

export function updateMetrics(route, status, duration) {
  const metric = initializeMetric(route);

  metric.requests++;

  if (status >= 200 && status < 400) {
    metric.success++;
  } else if (status >= 400 && status < 500) {
    metric.clientErrors++;
  } else if (status >= 500) {
    metric.serverErrors++;
  }

  metric.totalResponseTime += duration;

  metric.averageResponseTime =
    metric.totalResponseTime / metric.requests;

  metric.maxResponseTime = Math.max(
    metric.maxResponseTime,
    duration
  );

  metric.minResponseTime = Math.min(
    metric.minResponseTime,
    duration
  );

  metric.successRate =
    (metric.success / metric.requests) * 100;

  metric.errorRate =
    ((metric.clientErrors + metric.serverErrors) /
      metric.requests) *
    100;

  metric.lastRequestAt = new Date().toISOString();
}

export function getMetrics() {
  const result = {};

  for (const [route, metric] of metrics.entries()) {
    result[route] = {
      requests: metric.requests,

      success: metric.success,

      clientErrors: metric.clientErrors,

      serverErrors: metric.serverErrors,

      successRate: `${metric.successRate.toFixed(2)} %`,

      errorRate: `${metric.errorRate.toFixed(2)} %`,

      averageResponseTime: `${metric.averageResponseTime.toFixed(
        2
      )} ms`,

      maxResponseTime: `${metric.maxResponseTime.toFixed(2)} ms`,

      minResponseTime: `${metric.minResponseTime.toFixed(2)} ms`,

      totalResponseTime: `${metric.totalResponseTime.toFixed(
        2
      )} ms`,

      lastRequestAt: metric.lastRequestAt,
    };
  }

  return result;
}

export function resetMetrics() {
  metrics.clear();
}