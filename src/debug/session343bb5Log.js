// #region agent log
/** Debug helper: POST to ingest (local) + mirror for production copy/paste via console. */
export function log343bb5(hypothesisId, location, message, data = {}) {
    const payload = {
        sessionId: '343bb5',
        hypothesisId,
        location,
        message,
        data,
        timestamp: Date.now(),
        runId: typeof window !== 'undefined' && window.__dbg343_runId ? window.__dbg343_runId : 'pre-fix'
    };
    fetch('http://127.0.0.1:7606/ingest/e65c7dbd-3b9f-4cb7-9135-310a836ba96d', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '343bb5'
        },
        body: JSON.stringify(payload)
    }).catch(() => {});
    console.warn('[DBG343bb5]', payload);
}
// #endregion
