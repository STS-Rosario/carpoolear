<template>
    <AdminLayout>
        <div class="admin-identity-verification-report container">
            <div class="row">
                <div class="col-md-22 col-md-offset-1">
                    <h2>{{ $t('adminIvrTitulo') }}</h2>
                    <p class="ivr-intro">{{ $t('adminIvrDescripcion') }}</p>
                    <p class="ivr-note" data-testid="ivr-data-availability-note">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        {{ $t('adminIvrNotaDatosDesde', { date: dataAvailableFromLabel }) }}
                    </p>

                    <div v-if="loading" class="alert alert-info" data-testid="ivr-loading">
                        {{ $t('adminIvrCargando') }}
                    </div>
                    <div v-else-if="loadError" class="alert alert-danger ivr-error" data-testid="ivr-error">
                        <span>{{ $t('adminIvrErrorCarga') }}</span>
                        <AppButton variant="secondary" size="sm" @click="fetchReport">
                            {{ $t('adminIvrReintentar') }}
                        </AppButton>
                    </div>
                    <div v-else-if="isEmpty" class="alert alert-warning" data-testid="ivr-empty">
                        {{ $t('adminIvrSinDatos') }}
                    </div>
                    <template v-else-if="report">
                        <div class="ivr-cards">
                            <div class="ivr-card" data-testid="ivr-total-attempts">
                                <span class="ivr-card__label">{{ $t('adminIvrIntentosTotales') }}</span>
                                <span class="ivr-card__value">{{ report.totals.attempts }}</span>
                            </div>
                            <div class="ivr-card" data-testid="ivr-manual-attempts">
                                <span class="ivr-card__label">{{ $t('adminIvrIntentosManuales') }}</span>
                                <span class="ivr-card__value">{{ report.totals.manual.attempts }}</span>
                            </div>
                            <div class="ivr-card" data-testid="ivr-automatic-attempts">
                                <span class="ivr-card__label">{{ $t('adminIvrIntentosMercadoPago') }}</span>
                                <span class="ivr-card__value">{{ report.totals.automatic.attempts }}</span>
                            </div>
                        </div>

                        <div class="ivr-sections">
                            <section class="ivr-section">
                                <h3>{{ $t('adminIvrSeccionManual') }}</h3>
                                <p class="ivr-help">{{ $t('adminIvrSeccionManualAyuda') }}</p>
                                <table class="table table-bordered ivr-outcomes-table" data-testid="ivr-manual-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{ $t('adminIvrResultado') }}</th>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrCantidad') }}</th>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrPorcentaje') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in manualRows" :key="row.key" :data-outcome="row.key">
                                            <th scope="row">{{ $t(row.labelKey) }}</th>
                                            <td class="ivr-num">{{ row.count }}</td>
                                            <td class="ivr-num">{{ formatPct(row.pct) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <p class="ivr-help">{{ $t('adminIvrInconclusasAyuda') }}</p>
                            </section>

                            <section class="ivr-section">
                                <h3>{{ $t('adminIvrSeccionAutomatica') }}</h3>
                                <p class="ivr-help">{{ $t('adminIvrSeccionAutomaticaAyuda') }}</p>
                                <table class="table table-bordered ivr-outcomes-table" data-testid="ivr-automatic-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{{ $t('adminIvrResultado') }}</th>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrCantidad') }}</th>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrPorcentaje') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in automaticRows" :key="row.key" :data-outcome="row.key">
                                            <th scope="row">{{ $t(row.labelKey) }}</th>
                                            <td class="ivr-num">{{ row.count }}</td>
                                            <td class="ivr-num">{{ formatPct(row.pct) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </section>
                        </div>

                        <section class="ivr-section">
                            <h3>{{ $t('adminIvrSeccionPeriodos') }}</h3>
                            <div class="table-responsive">
                                <table class="table table-bordered table-condensed ivr-series-table" data-testid="ivr-series-table">
                                    <thead>
                                        <tr>
                                            <th scope="col" rowspan="2">{{ $t(periodHeader) }}</th>
                                            <th scope="col" rowspan="2" class="ivr-num">{{ $t('adminIvrIntentosTotales') }}</th>
                                            <th scope="colgroup" :colspan="manualOutcomes.length + 1">{{ $t('adminIvrMetodoManual') }}</th>
                                            <th scope="colgroup" :colspan="automaticOutcomes.length + 1">{{ $t('adminIvrMetodoMercadoPago') }}</th>
                                        </tr>
                                        <tr>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrIntentos') }}</th>
                                            <th v-for="row in manualRows" :key="`m-${row.key}`" scope="col" class="ivr-num">
                                                {{ $t(row.labelKey) }}
                                            </th>
                                            <th scope="col" class="ivr-num">{{ $t('adminIvrIntentos') }}</th>
                                            <th v-for="row in automaticRows" :key="`a-${row.key}`" scope="col" class="ivr-num">
                                                {{ $t(row.labelKey) }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in seriesRows" :key="row.period">
                                            <th scope="row">{{ row.period }}</th>
                                            <td class="ivr-num">{{ row.attempts }}</td>
                                            <td class="ivr-num">{{ row.manual.attempts }}</td>
                                            <td v-for="key in manualOutcomes" :key="`m-${key}`" class="ivr-num">{{ row.manual[key] }}</td>
                                            <td class="ivr-num">{{ row.automatic.attempts }}</td>
                                            <td v-for="key in automaticOutcomes" :key="`a-${key}`" class="ivr-num">{{ row.automatic[key] }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section class="ivr-section" data-testid="ivr-funnel">
                            <h3>{{ $t('adminIvrSeccionFunnel') }}</h3>
                            <p class="ivr-help">{{ $t('adminIvrFunnelAyuda') }}</p>
                            <div class="ivr-cards">
                                <div class="ivr-card" data-testid="ivr-funnel-failed-users">
                                    <span class="ivr-card__label">{{ $t('adminIvrFunnelUsuariosFallidos') }}</span>
                                    <span class="ivr-card__value">{{ report.funnel.failed_users }}</span>
                                </div>
                                <div class="ivr-card ivr-card--ok" data-testid="ivr-funnel-resolved">
                                    <span class="ivr-card__label">{{ $t('adminIvrFunnelResueltos') }}</span>
                                    <span class="ivr-card__value">{{ report.funnel.resolved.count }}</span>
                                    <span class="ivr-card__pct">{{ formatPct(report.funnel.resolved.pct) }}</span>
                                </div>
                                <div class="ivr-card ivr-card--bad" data-testid="ivr-funnel-unresolved">
                                    <span class="ivr-card__label">{{ $t('adminIvrFunnelSinResolver') }}</span>
                                    <span class="ivr-card__value">{{ report.funnel.unresolved.count }}</span>
                                    <span class="ivr-card__pct">{{ formatPct(report.funnel.unresolved.pct) }}</span>
                                </div>
                                <div class="ivr-card ivr-card--muted" data-testid="ivr-funnel-unlinked">
                                    <span class="ivr-card__label">{{ $t('adminIvrFunnelFallosSinUsuario') }}</span>
                                    <span class="ivr-card__value">{{ report.funnel.unlinked_failures }}</span>
                                </div>
                            </div>
                            <table class="table table-bordered ivr-outcomes-table">
                                <thead>
                                    <tr>
                                        <th scope="col">{{ $t('adminIvrFunnelResolucion') }}</th>
                                        <th scope="col" class="ivr-num">{{ $t('adminIvrCantidad') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in funnelTableRows" :key="row.key" :data-funnel-row="row.key">
                                        <th scope="row">{{ $t(row.labelKey) }}</th>
                                        <td class="ivr-num">{{ row.count }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </template>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AppButton from '../ui/AppButton.vue';
import { AdminApi } from '../../services/api';
import dayjs from '../../dayjs';
import {
    REPORT_DATA_AVAILABLE_FROM,
    reportFiltersFromQuery
} from '../../utils/identityVerificationReportFilters';
import {
    AUTOMATIC_OUTCOMES,
    MANUAL_OUTCOMES,
    automaticOutcomeRows,
    formatPct,
    funnelRows,
    isReportEmpty,
    manualOutcomeRows,
    periodHeaderKey,
    seriesTableRows
} from '../../utils/identityVerificationReportData';

export default {
    name: 'admin-identity-verification-report',
    components: {
        AdminLayout,
        AppButton
    },
    data() {
        return {
            filters: reportFiltersFromQuery(this.$route.query),
            report: null,
            loading: false,
            loadError: false,
            manualOutcomes: MANUAL_OUTCOMES,
            automaticOutcomes: AUTOMATIC_OUTCOMES
        };
    },
    computed: {
        dataAvailableFromLabel() {
            return dayjs(REPORT_DATA_AVAILABLE_FROM).format('DD/MM/YYYY');
        },
        isEmpty() {
            return isReportEmpty(this.report);
        },
        manualRows() {
            return manualOutcomeRows(this.report && this.report.totals.manual);
        },
        automaticRows() {
            return automaticOutcomeRows(this.report && this.report.totals.automatic);
        },
        seriesRows() {
            return seriesTableRows(this.report && this.report.series);
        },
        funnelTableRows() {
            return funnelRows(this.report && this.report.funnel);
        },
        periodHeader() {
            return periodHeaderKey(this.filters.groupBy);
        }
    },
    methods: {
        formatPct,
        async fetchReport() {
            this.loading = true;
            this.loadError = false;
            try {
                this.report = await this.adminApi.getIdentityVerificationReport({ ...this.filters });
            } catch (e) {
                this.report = null;
                this.loadError = true;
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.fetchReport();
    }
};
</script>

<style scoped>
.ivr-intro {
    color: var(--ds-text-secondary, #555);
    margin-bottom: 8px;
}

.ivr-note {
    font-size: 13px;
    color: #6b5d00;
    background: #fff8d6;
    border: 1px solid #f0e2a0;
    border-radius: 4px;
    padding: 6px 10px;
    display: inline-block;
    margin-bottom: 16px;
}

.ivr-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.ivr-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.ivr-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border: 1px solid #ddd;
    border-left: 4px solid #0f4fa8;
    border-radius: 6px;
    background: #fff;
    padding: 10px 14px;
}

.ivr-card--ok {
    border-left-color: #2e9e5b;
}

.ivr-card--bad {
    border-left-color: #d9534f;
}

.ivr-card--muted {
    border-left-color: #9e9e9e;
}

.ivr-card__label {
    font-size: 13px;
    color: #555;
}

.ivr-card__value {
    font-size: 26px;
    font-weight: 700;
    line-height: 1.1;
}

.ivr-card__pct {
    font-size: 13px;
    color: #555;
}

.ivr-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
}

.ivr-section {
    margin-bottom: 24px;
    min-width: 0;
}

.ivr-help {
    font-size: 13px;
    color: #666;
}

.ivr-num {
    text-align: right;
    white-space: nowrap;
}

.ivr-series-table th[scope='colgroup'] {
    text-align: center;
}

.ivr-series-table {
    font-size: 13px;
}
</style>
