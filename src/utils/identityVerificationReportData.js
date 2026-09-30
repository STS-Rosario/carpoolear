export const MANUAL_OUTCOMES = ['approved', 'rejected', 'inconclusive', 'pending_review'];
export const AUTOMATIC_OUTCOMES = ['approved', 'rejected', 'error', 'cancelled', 'abandoned'];
export const FUNNEL_RESOLVED_METHODS = ['mercado_pago', 'manual', 'mp_rejection_approved', 'admin_edit'];

const OUTCOME_LABEL_KEYS = {
    approved: 'adminIvrAprobadas',
    rejected: 'adminIvrRechazadas',
    inconclusive: 'adminIvrInconclusas',
    pending_review: 'adminIvrPendientesDeRevision',
    error: 'adminIvrError',
    cancelled: 'adminIvrCanceladas',
    abandoned: 'adminIvrAbandonadas'
};

const OUTCOME_COLORS = {
    approved: '#2e9e5b',
    rejected: '#d9534f',
    inconclusive: '#9e9e9e',
    pending_review: '#f0ad4e',
    error: '#8e44ad',
    cancelled: '#5b7fa6',
    abandoned: '#c7c7c7'
};

const FUNNEL_LABEL_KEYS = {
    mercado_pago: 'adminIvrFunnelMercadoPago',
    manual: 'adminIvrFunnelManual',
    mp_rejection_approved: 'adminIvrFunnelRechazoMpAprobado',
    admin_edit: 'adminIvrFunnelEdicionAdmin',
    unresolved: 'adminIvrFunnelSinResolver'
};

const FUNNEL_COLORS = {
    mercado_pago: '#009ee3',
    manual: '#2e9e5b',
    mp_rejection_approved: '#7cc47f',
    admin_edit: '#0f4fa8',
    unresolved: '#d9534f'
};

const PERIOD_HEADER_KEYS = {
    month: 'adminIvrPeriodoMes',
    week: 'adminIvrPeriodoSemana',
    day: 'adminIvrPeriodoDia'
};

const METHOD_OUTCOMES = {
    manual: MANUAL_OUTCOMES,
    automatic: AUTOMATIC_OUTCOMES
};

function outcomeRows(section, outcomes) {
    const safe = section || {};
    return outcomes.map((key) => {
        const value = safe[key] || {};
        return {
            key,
            labelKey: OUTCOME_LABEL_KEYS[key],
            count: value.count || 0,
            pct: value.pct || 0
        };
    });
}

export function manualOutcomeRows(section) {
    return outcomeRows(section, MANUAL_OUTCOMES);
}

export function automaticOutcomeRows(section) {
    return outcomeRows(section, AUTOMATIC_OUTCOMES);
}

function sectionCounts(section, outcomes) {
    const safe = section || {};
    return outcomes.reduce(
        (acc, key) => {
            acc[key] = (safe[key] && safe[key].count) || 0;
            return acc;
        },
        { attempts: safe.attempts || 0 }
    );
}

export function seriesTableRows(series) {
    return (series || []).map((bucket) => ({
        period: bucket.period,
        attempts: bucket.attempts || 0,
        manual: sectionCounts(bucket.manual, MANUAL_OUTCOMES),
        automatic: sectionCounts(bucket.automatic, AUTOMATIC_OUTCOMES)
    }));
}

/** Stacked bar data: one dataset per outcome of `method` ('manual' | 'automatic'), one bar per period. */
export function outcomeChartData(series, method, t) {
    const buckets = series || [];
    return {
        labels: buckets.map((bucket) => bucket.period),
        datasets: METHOD_OUTCOMES[method].map((key) => ({
            label: t(OUTCOME_LABEL_KEYS[key]),
            data: buckets.map((bucket) => {
                const section = bucket[method] || {};
                return (section[key] && section[key].count) || 0;
            }),
            backgroundColor: OUTCOME_COLORS[key],
            stack: method
        }))
    };
}

export function funnelRows(funnel) {
    const safe = funnel || {};
    const byMethod = (safe.resolved && safe.resolved.by_method) || {};
    return FUNNEL_RESOLVED_METHODS.map((key) => ({
        key,
        labelKey: FUNNEL_LABEL_KEYS[key],
        count: byMethod[key] || 0
    })).concat([
        {
            key: 'unresolved',
            labelKey: FUNNEL_LABEL_KEYS.unresolved,
            count: (safe.unresolved && safe.unresolved.count) || 0
        }
    ]);
}

export function funnelChartData(funnel, t) {
    const rows = funnelRows(funnel);
    return {
        labels: rows.map((row) => t(row.labelKey)),
        datasets: [
            {
                data: rows.map((row) => row.count),
                backgroundColor: rows.map((row) => FUNNEL_COLORS[row.key])
            }
        ]
    };
}

export function isReportEmpty(report) {
    if (!report) {
        return true;
    }
    const attempts = (report.totals && report.totals.attempts) || 0;
    const funnel = report.funnel || {};
    return !attempts && !funnel.failed_users && !funnel.unlinked_failures;
}

export function formatPct(pct) {
    return `${Number(pct || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })} %`;
}

export function periodHeaderKey(groupBy) {
    return PERIOD_HEADER_KEYS[groupBy] || PERIOD_HEADER_KEYS.month;
}
