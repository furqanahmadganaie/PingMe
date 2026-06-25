const traces = new Map();
// for now we will stop trace manager we will implenet it later 
export function startTrace(requestId, metadata) {
    traces.set(requestId, {
        ...metadata,
        spans: [],
    });
}

export function addSpan(requestId, span) {
    const trace = traces.get(requestId);

    if (!trace) return;

    trace.spans.push(span);
}

export function getTrace(requestId) {
    return traces.get(requestId);
}

export function endTrace(requestId) {
    traces.delete(requestId);
}