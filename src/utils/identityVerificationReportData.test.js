import { describe, it, expect } from 'vitest';
import {
    AUTOMATIC_OUTCOMES,
    MANUAL_OUTCOMES,
    automaticOutcomeRows,
    formatPct,
    funnelChartData,
    funnelRows,
    isReportEmpty,
    manualOutcomeRows,
    outcomeChartData,
    periodHeaderKey,
    seriesTableRows
} from './identityVerificationReportData';
import {
    makeEmptyIdentityVerificationReport,
    makeIdentityVerificationReport
} from './identityVerificationReport.fixture';

const t = (key) => `t:${key}`;

describe('outcome lists', () => {
    it('keeps manual and automatic outcome classes in display order', () => {
        expect(MANUAL_OUTCOMES).toEqual(['approved', 'rejected', 'inconclusive', 'pending_review']);
        expect(AUTOMATIC_OUTCOMES).toEqual(['approved', 'rejected', 'error', 'cancelled', 'abandoned']);
    });
});

describe('manualOutcomeRows', () => {
    it('lists approved, rejected, inconclusive and pending review as separate rows with count and pct', () => {
        const rows = manualOutcomeRows(makeIdentityVerificationReport().totals.manual);

        expect(rows).toEqual([
            { key: 'approved', labelKey: 'adminIvrAprobadas', count: 13, pct: 43.33 },
            { key: 'rejected', labelKey: 'adminIvrRechazadas', count: 4, pct: 13.33 },
            { key: 'inconclusive', labelKey: 'adminIvrInconclusas', count: 8, pct: 26.67 },
            { key: 'pending_review', labelKey: 'adminIvrPendientesDeRevision', count: 5, pct: 16.67 }
        ]);
    });

    it('treats a missing section as zeros', () => {
        expect(manualOutcomeRows(undefined).map((row) => [row.count, row.pct])).toEqual([
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ]);
    });
});

describe('automaticOutcomeRows', () => {
    it('lists approved, rejected, error, cancelled and abandoned with count and pct', () => {
        const rows = automaticOutcomeRows(makeIdentityVerificationReport().totals.automatic);

        expect(rows.map((row) => row.key)).toEqual(AUTOMATIC_OUTCOMES);
        expect(rows.map((row) => row.labelKey)).toEqual([
            'adminIvrAprobadas',
            'adminIvrRechazadas',
            'adminIvrError',
            'adminIvrCanceladas',
            'adminIvrAbandonadas'
        ]);
        expect(rows.map((row) => row.count)).toEqual([78, 18, 6, 8, 10]);
        expect(rows.map((row) => row.pct)).toEqual([65, 15, 5, 6.67, 8.33]);
    });
});

describe('seriesTableRows', () => {
    it('flattens every period into counts per method and outcome', () => {
        const rows = seriesTableRows(makeIdentityVerificationReport().series);

        expect(rows).toHaveLength(2);
        expect(rows[0]).toEqual({
            period: '2026-09',
            attempts: 100,
            manual: {
                attempts: 20,
                approved: 9,
                rejected: 3,
                inconclusive: 6,
                pending_review: 2
            },
            automatic: {
                attempts: 80,
                approved: 52,
                rejected: 12,
                error: 4,
                cancelled: 6,
                abandoned: 6
            }
        });
    });

    it('returns an empty list when there is no series', () => {
        expect(seriesTableRows(undefined)).toEqual([]);
    });
});

describe('outcomeChartData', () => {
    it('builds one stacked dataset per manual outcome with a value per period', () => {
        const data = outcomeChartData(makeIdentityVerificationReport().series, 'manual', t);

        expect(data.labels).toEqual(['2026-09', '2026-10']);
        expect(data.datasets.map((dataset) => dataset.label)).toEqual([
            't:adminIvrAprobadas',
            't:adminIvrRechazadas',
            't:adminIvrInconclusas',
            't:adminIvrPendientesDeRevision'
        ]);
        expect(data.datasets[0].data).toEqual([9, 4]);
        expect(data.datasets[3].data).toEqual([2, 3]);
        data.datasets.forEach((dataset) => {
            expect(dataset.stack).toBe('manual');
            expect(dataset.backgroundColor).toMatch(/^#[0-9a-f]{6}$/i);
        });
    });

    it('builds automatic outcome datasets', () => {
        const data = outcomeChartData(makeIdentityVerificationReport().series, 'automatic', t);

        expect(data.datasets).toHaveLength(5);
        expect(data.datasets[4]).toMatchObject({
            label: 't:adminIvrAbandonadas',
            data: [6, 4],
            stack: 'automatic'
        });
    });

    it('uses distinct colors per outcome', () => {
        const data = outcomeChartData(makeIdentityVerificationReport().series, 'automatic', t);
        const colors = data.datasets.map((dataset) => dataset.backgroundColor);

        expect(new Set(colors).size).toBe(colors.length);
    });
});

describe('funnelRows', () => {
    it('lists users resolved by each method and the unresolved ones', () => {
        expect(funnelRows(makeIdentityVerificationReport().funnel)).toEqual([
            { key: 'mercado_pago', labelKey: 'adminIvrFunnelMercadoPago', count: 7 },
            { key: 'manual', labelKey: 'adminIvrFunnelManual', count: 3 },
            { key: 'mp_rejection_approved', labelKey: 'adminIvrFunnelRechazoMpAprobado', count: 1 },
            { key: 'admin_edit', labelKey: 'adminIvrFunnelEdicionAdmin', count: 1 },
            { key: 'unresolved', labelKey: 'adminIvrFunnelSinResolver', count: 9 }
        ]);
    });
});

describe('funnelChartData', () => {
    it('has one slice per resolution method plus unresolved', () => {
        const data = funnelChartData(makeIdentityVerificationReport().funnel, t);

        expect(data.labels).toEqual([
            't:adminIvrFunnelMercadoPago',
            't:adminIvrFunnelManual',
            't:adminIvrFunnelRechazoMpAprobado',
            't:adminIvrFunnelEdicionAdmin',
            't:adminIvrFunnelSinResolver'
        ]);
        expect(data.datasets).toHaveLength(1);
        expect(data.datasets[0].data).toEqual([7, 3, 1, 1, 9]);
        expect(data.datasets[0].backgroundColor).toHaveLength(5);
    });
});

describe('isReportEmpty', () => {
    it('is false when there are attempts', () => {
        expect(isReportEmpty(makeIdentityVerificationReport())).toBe(false);
    });

    it('is true when every counter is zero', () => {
        expect(isReportEmpty(makeEmptyIdentityVerificationReport())).toBe(true);
    });

    it('is false when only the funnel has data', () => {
        const report = makeEmptyIdentityVerificationReport();
        report.funnel.unlinked_failures = 1;

        expect(isReportEmpty(report)).toBe(false);
    });

    it('is true for a missing report', () => {
        expect(isReportEmpty(null)).toBe(true);
    });
});

describe('formatPct', () => {
    it('formats with Argentine decimals and a percent sign', () => {
        expect(formatPct(43.33)).toBe('43,33 %');
        expect(formatPct(65)).toBe('65 %');
        expect(formatPct(7.5)).toBe('7,5 %');
    });

    it('shows 0 % for missing values', () => {
        expect(formatPct(undefined)).toBe('0 %');
    });
});

describe('periodHeaderKey', () => {
    it('names the period column after the grouping', () => {
        expect(periodHeaderKey('month')).toBe('adminIvrPeriodoMes');
        expect(periodHeaderKey('week')).toBe('adminIvrPeriodoSemana');
        expect(periodHeaderKey('day')).toBe('adminIvrPeriodoDia');
        expect(periodHeaderKey('other')).toBe('adminIvrPeriodoMes');
    });
});
