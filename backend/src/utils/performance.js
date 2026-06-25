export async function measure(req, operationName, operation) {
  const start = process.hrtime.bigint();
  
  try {
    const result = await operation();

    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    console.log({
      type: "FUNCTION_MONITOR",

      requestId: req.requestId,

      userId:
        req.user?._id?.toString() || "Anonymous",

      method: req.method,

      route: req.originalUrl,

      operation: operationName,

      duration: `${duration.toFixed(2)} ms`,

      timestamp: new Date().toISOString(),

      status: "SUCCESS",
    });

    return result;
  } catch (error) {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    console.log({
      type: "FUNCTION_MONITOR",

      requestId: req.requestId,

      userId:
        req.user?._id?.toString() || "Anonymous",

      method: req.method,

      route: req.originalUrl,

      operation: operationName,

      duration: `${duration.toFixed(2)} ms`,

      timestamp: new Date().toISOString(),

      status: "FAILED",

      error: error.message,
    });

    throw error;
  }
}