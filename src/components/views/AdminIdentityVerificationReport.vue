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

                    <form class="ivr-filters" :aria-label="$t('adminIvrFiltros')" @submit.prevent>
                        <AppField label-for="ivr-filter-from" :label="$t('adminIvrDesde')">
                            <input
                                id="ivr-filter-from"
                                type="date"
                                class="form-control"
                                :value="filters.from"
                                @change="onFilterChange('from', $event.target.value)"
                            />
                        </AppField>
                        <AppField label-for="ivr-filter-to" :label="$t('adminIvrHasta')">
                            <input
                                id="ivr-filter-to"
                                type="date"
                                class="form-control"
                                :value="filters.to"
                                @change="onFilterChange('to', $event.target.value)"
                            />
                        </AppField>
                        <AppField label-for="ivr-filter-group-by" :label="$t('adminIvrAgruparPor')">
                            <select
                                id="ivr-filter-group-by"
                                class="form-control"
                                :value="filters.groupBy"
                                @change="onFilterChange('groupBy', $event.target.value)"
                            >
                                <option v-for="option in groupByOptions" :key="option.value" :value="option.value">
                                    {{ $t(option.labelKey) }}
                                </option>
                            </select>
                        </AppField>
                        <AppField label-for="ivr-filter-method" :label="$t('adminIvrMetodo')">
                            <select
                                id="ivr-filter-method"
                                class="form-control"
                                :value="filters.method"
                                @change="onFilterChange('method', $event.target.value)"
                            >
                                <option v-for="option in methodOptions" :key="option.value" :value="option.value">
                                    {{ $t(option.labelKey) }}
                                </option>
                            </select>
                        </AppField>
                        <AppField label-for="ivr-filter-platform" :label="$t('adminIvrPlataforma')" optional>
                            <select
                                id="ivr-filter-platform"
                                class="form-control"
                                :value="filters.platform"
                                @change="onFilterChange('platform', $event.target.value)"
                            >
                                <option value="">{{ $t('adminIvrPlataformaTodas') }}</option>
                                <option v-for="platform in platformOptions" :key="platform" :value="platform">
                                    {{ platform }}
                                </option>
                            </select>
                        </AppField>
                        <AppField label-for="ivr-filter-surface" :label="$t('adminIvrSuperficie')" optional>
                            <input
                                id="ivr-filter-surface"
                                type="text"
                                class="form-control"
                                list="ivr-surface-suggestions"
                                maxlength="64"
                                :value="filters.surface"
                                @change="onFilterChange('surface', $event.target.value)"
                                @keydown.enter="onFilterChange('surface', $event.target.value)"
                            />
                            <datalist id="ivr-surface-suggestions">
                                <option v-for="surface in surfaceSuggestions" :key="surface" :value="surface"></option>
                            </datalist>
                        </AppField>
                        <AppField label-for="ivr-filter-app-version" :label="$t('adminIvrVersionApp')" optional>
                            <input
                                id="ivr-filter-app-version"
                                type="text"
                                class="form-control"
                                maxlength="64"
                                :value="filters.appVersion"
                                @change="onFilterChange('appVersion', $event.target.value)"
                                @keydown.enter="onFilterChange('appVersion', $event.target.value)"
                            />
                        </AppField>
                    </form>
                    <p v-if="filtersError" class="alert alert-warning" data-testid="ivr-filters-error">
                        {{ $t(filtersError) }}
                    </p>
                    <p v-if="hasClientContextFilter && showManual" class="ivr-help" data-testid="ivr-client-filters-note">
                        {{ $t('adminIvrNotaFiltrosCliente') }}
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
                            <div v-if="showManual" class="ivr-card" data-testid="ivr-manual-attempts">
                                <span class="ivr-card__label">{{ $t('adminIvrIntentosManuales') }}</span>
                                <span class="ivr-card__value">{{ report.totals.manual.attempts }}</span>
                            </div>
                            <div v-if="showAutomatic" class="ivr-card" data-testid="ivr-automatic-attempts">
                                <span class="ivr-card__label">{{ $t('adminIvrIntentosMercadoPago') }}</span>
                                <span class="ivr-card__value">{{ report.totals.automatic.attempts }}</span>
                            </div>
                        </div>

                        <div class="ivr-sections">
                            <section v-if="showManual" class="ivr-section">
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
                                <IdentityVerificationOutcomesChart
                                    :chart-data="manualChartData"
                                    :title="$t('adminIvrGraficoManual')"
                                />
                            </section>

                            <section v-if="showAutomatic" class="ivr-section">
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
                                <IdentityVerificationOutcomesChart
                                    :chart-data="automaticChartData"
                                    :title="$t('adminIvrGraficoAutomatica')"
                                />
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
                                            <th v-if="showManual" scope="colgroup" :colspan="manualOutcomes.length + 1">
                                                {{ $t('adminIvrMetodoManual') }}
                                            </th>
                                            <th v-if="showAutomatic" scope="colgroup" :colspan="automaticOutcomes.length + 1">
                                                {{ $t('adminIvrMetodoMercadoPago') }}
                                            </th>
                                        </tr>
                                        <tr>
                                            <template v-if="showManual">
                                                <th scope="col" class="ivr-num">{{ $t('adminIvrIntentos') }}</th>
                                                <th v-for="row in manualRows" :key="`m-${row.key}`" scope="col" class="ivr-num">
                                                    {{ $t(row.labelKey) }}
                                                </th>
                                            </template>
                                            <template v-if="showAutomatic">
                                                <th scope="col" class="ivr-num">{{ $t('adminIvrIntentos') }}</th>
                                                <th v-for="row in automaticRows" :key="`a-${row.key}`" scope="col" class="ivr-num">
                                                    {{ $t(row.labelKey) }}
                                                </th>
                                            </template>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in seriesRows" :key="row.period">
                                            <th scope="row">{{ row.period }}</th>
                                            <td class="ivr-num">{{ row.attempts }}</td>
                                            <template v-if="showManual">
                                                <td class="ivr-num">{{ row.manual.attempts }}</td>
                                                <td v-for="key in manualOutcomes" :key="`m-${key}`" class="ivr-num">{{ row.manual[key] }}</td>
                                            </template>
                                            <template v-if="showAutomatic">
                                                <td class="ivr-num">{{ row.automatic.attempts }}</td>
                                                <td v-for="key in automaticOutcomes" :key="`a-${key}`" class="ivr-num">{{ row.automatic[key] }}</td>
                                            </template>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section v-if="showAutomatic" class="ivr-section" data-testid="ivr-funnel">
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
                            <div class="ivr-sections">
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
                            <IdentityVerificationFunnelChart
                                :chart-data="funnelChartData"
                                :title="$t('adminIvrGraficoFunnel')"
                            />
                            </div>
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
import AppField from '../ui/AppField.vue';
import IdentityVerificationFunnelChart from '../elements/IdentityVerificationFunnelChart.vue';
import IdentityVerificationOutcomesChart from '../elements/IdentityVerificationOutcomesChart.vue';
import { AdminApi } from '../../services/api';
import dayjs from '../../dayjs';
import {
    REPORT_DATA_AVAILABLE_FROM,
    REPORT_PLATFORM_OPTIONS,
    REPORT_SURFACE_SUGGESTIONS,
    reportFiltersFromQuery,
    reportFiltersToQuery,
    validateReportFilters
} from '../../utils/identityVerificationReportFilters';
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
} from '../../utils/identityVerificationReportData';

export default {
    name: 'admin-identity-verification-report',
    components: {
        AdminLayout,
        AppButton,
        AppField,
        IdentityVerificationFunnelChart,
        IdentityVerificationOutcomesChart
    },
    data() {
        return {
            filters: reportFiltersFromQuery(this.$route.query),
            report: null,
            loading: false,
            loadError: false,
            filtersError: null,
            groupByOptions: [
                { value: 'month', labelKey: 'adminIvrAgruparMes' },
                { value: 'week', labelKey: 'adminIvrAgruparSemana' },
                { value: 'day', labelKey: 'adminIvrAgruparDia' }
            ],
            methodOptions: [
                { value: 'all', labelKey: 'adminIvrMetodoTodos' },
                { value: 'manual', labelKey: 'adminIvrMetodoManual' },
                { value: 'mercado_pago', labelKey: 'adminIvrMetodoMercadoPago' }
            ],
            platformOptions: REPORT_PLATFORM_OPTIONS,
            surfaceSuggestions: REPORT_SURFACE_SUGGESTIONS,
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
        manualChartData() {
            return outcomeChartData(this.report && this.report.series, 'manual', (key) => this.$t(key));
        },
        automaticChartData() {
            return outcomeChartData(this.report && this.report.series, 'automatic', (key) => this.$t(key));
        },
        funnelChartData() {
            return funnelChartData(this.report && this.report.funnel, (key) => this.$t(key));
        },
        funnelTableRows() {
            return funnelRows(this.report && this.report.funnel);
        },
        periodHeader() {
            return periodHeaderKey(this.filters.groupBy);
        },
        showManual() {
            return this.filters.method !== 'mercado_pago';
        },
        showAutomatic() {
            return this.filters.method !== 'manual';
        },
        hasClientContextFilter() {
            return Boolean(this.filters.surface || this.filters.platform || this.filters.appVersion);
        }
    },
    watch: {
        '$route.query'(query) {
            // Ignore the query change of the navigation that leaves this page.
            if (this.$route.path !== this.routePath) {
                return;
            }
            this.filters = reportFiltersFromQuery(query);
            this.filtersError = null;
            this.fetchReport();
        }
    },
    methods: {
        formatPct,
        onFilterChange(key, rawValue) {
            const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
            const next = { ...this.filters, [key]: value };
            this.filters = next;
            this.filtersError = validateReportFilters(next);
            if (this.filtersError) {
                return;
            }
            // The $route.query watcher refetches; an unchanged query is a no-op.
            this.$router.replace({ query: reportFiltersToQuery(next) });
        },
        async fetchReport() {
            const requestId = ++this.requestSeq;
            this.loading = true;
            this.loadError = false;
            try {
                const report = await this.adminApi.getIdentityVerificationReport({ ...this.filters });
                if (requestId === this.requestSeq) {
                    this.report = report;
                }
            } catch (e) {
                if (requestId === this.requestSeq) {
                    this.report = null;
                    this.loadError = true;
                }
            } finally {
                if (requestId === this.requestSeq) {
                    this.loading = false;
                }
            }
        }
    },
    created() {
        this.requestSeq = 0;
        this.routePath = this.$route.path;
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

.ivr-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: flex-end;
    margin-bottom: 16px;
}

.ivr-filters > * {
    flex: 1 1 150px;
    min-width: 140px;
    max-width: 220px;
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
