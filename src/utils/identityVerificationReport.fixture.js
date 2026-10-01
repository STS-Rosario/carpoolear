// Sample payload of GET /api/admin/identity-verification-report used by unit tests.
function outcome(count, pct) {
    return { count, pct };
}

export function makeIdentityVerificationReport() {
    return {
        filters: {
            from: '2026-09-01',
            to: '2026-10-31',
            group_by: 'month',
            method: 'all',
            surface: null,
            platform: null,
            app_version: null
        },
        totals: {
            attempts: 150,
            manual: {
                attempts: 30,
                approved: outcome(13, 43.33),
                rejected: outcome(4, 13.33),
                inconclusive: outcome(8, 26.67),
                pending_review: outcome(5, 16.67)
            },
            automatic: {
                attempts: 120,
                approved: outcome(78, 65),
                rejected: outcome(18, 15),
                error: outcome(6, 5),
                cancelled: outcome(8, 6.67),
                abandoned: outcome(10, 8.33)
            }
        },
        series: [
            {
                period: '2026-09',
                attempts: 100,
                manual: {
                    attempts: 20,
                    approved: outcome(9, 45),
                    rejected: outcome(3, 15),
                    inconclusive: outcome(6, 30),
                    pending_review: outcome(2, 10)
                },
                automatic: {
                    attempts: 80,
                    approved: outcome(52, 65),
                    rejected: outcome(12, 15),
                    error: outcome(4, 5),
                    cancelled: outcome(6, 7.5),
                    abandoned: outcome(6, 7.5)
                }
            },
            {
                period: '2026-10',
                attempts: 50,
                manual: {
                    attempts: 10,
                    approved: outcome(4, 40),
                    rejected: outcome(1, 10),
                    inconclusive: outcome(2, 20),
                    pending_review: outcome(3, 30)
                },
                automatic: {
                    attempts: 40,
                    approved: outcome(26, 65),
                    rejected: outcome(6, 15),
                    error: outcome(2, 5),
                    cancelled: outcome(2, 5),
                    abandoned: outcome(4, 10)
                }
            }
        ],
        funnel: {
            failed_users: 21,
            resolved: {
                count: 12,
                pct: 57.14,
                by_method: { mercado_pago: 7, manual: 3, mp_rejection_approved: 1, admin_edit: 1 }
            },
            unresolved: { count: 9, pct: 42.86 },
            unlinked_failures: 2
        }
    };
}

export function makeEmptyIdentityVerificationReport() {
    const report = makeIdentityVerificationReport();
    const zeroSection = (section) =>
        Object.keys(section).reduce((acc, key) => {
            acc[key] = key === 'attempts' ? 0 : outcome(0, 0);
            return acc;
        }, {});
    const zeroBucket = (bucket) => ({
        ...bucket,
        attempts: 0,
        manual: zeroSection(bucket.manual),
        automatic: zeroSection(bucket.automatic)
    });
    return {
        ...report,
        totals: zeroBucket(report.totals),
        series: report.series.map(zeroBucket),
        funnel: {
            failed_users: 0,
            resolved: {
                count: 0,
                pct: 0,
                by_method: { mercado_pago: 0, manual: 0, mp_rejection_approved: 0, admin_edit: 0 }
            },
            unresolved: { count: 0, pct: 0 },
            unlinked_failures: 0
        }
    };
}
