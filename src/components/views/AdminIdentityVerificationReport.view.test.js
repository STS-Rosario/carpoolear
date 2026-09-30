// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import i18n from '../../i18n';
import AdminIdentityVerificationReport from './AdminIdentityVerificationReport.vue';
import {
    makeEmptyIdentityVerificationReport,
    makeIdentityVerificationReport
} from '../../utils/identityVerificationReport.fixture';

const apiMock = vi.hoisted(() => ({
    getIdentityVerificationReport: vi.fn()
}));

vi.mock('../../services/api', () => ({
    AdminApi: class {
        getIdentityVerificationReport(filters) {
            return apiMock.getIdentityVerificationReport(filters);
        }
    }
}));

vi.mock('../layouts/AdminLayout.vue', async () => {
    const { h } = await import('vue');
    return {
        default: {
            name: 'AdminLayout',
            render() {
                return h('div', { class: 'admin-layout-stub' }, this.$slots.default && this.$slots.default());
            }
        }
    };
});

vi.mock('vue-chartjs', async () => {
    const { h } = await import('vue');
    const stub = (type) => ({
        name: `${type}ChartStub`,
        props: ['chartData', 'chartOptions'],
        render() {
            return h('div', {
                class: 'chart-stub',
                'data-chart-type': type,
                'data-chart-data': JSON.stringify(this.chartData)
            });
        }
    });
    return { Bar: stub('bar'), Doughnut: stub('doughnut') };
});

const ROUTE_PATH = '/admin/identity-verification-report';

function deferred() {
    const handlers = {};
    const promise = new Promise((resolve, reject) => {
        handlers.resolve = resolve;
        handlers.reject = reject;
    });
    return { promise, ...handlers };
}

async function mountReport(url = ROUTE_PATH) {
    const router = createRouter({
        history: createMemoryHistory(),
        routes: [
            {
                path: ROUTE_PATH,
                name: 'admin-identity-verification-report',
                component: AdminIdentityVerificationReport
            }
        ]
    });
    router.push(url);
    await router.isReady();
    const wrapper = mount(AdminIdentityVerificationReport, {
        global: { plugins: [router, i18n] }
    });
    await flushPromises();
    return { wrapper, router };
}

/** Types into a text/date input and commits it (change fires on blur/enter or when a date is picked). */
async function commitInput(wrapper, selector, value) {
    const input = wrapper.find(selector);
    await input.setValue(value);
    await input.trigger('change');
    await flushPromises();
}

function rowText(wrapper, tableTestId, outcome) {
    return wrapper.find(`[data-testid="${tableTestId}"] [data-outcome="${outcome}"]`).text();
}

beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 9, 15, 12, 0, 0));
    apiMock.getIdentityVerificationReport.mockReset();
    apiMock.getIdentityVerificationReport.mockResolvedValue(makeIdentityVerificationReport());
});

afterEach(() => {
    vi.useRealTimers();
});

describe('AdminIdentityVerificationReport rendering', () => {
    it('requests the last six months grouped by month for all methods by default', async () => {
        await mountReport();

        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledTimes(1);
        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledWith({
            from: '2026-05-01',
            to: '2026-10-15',
            groupBy: 'month',
            method: 'all',
            surface: '',
            platform: '',
            appVersion: ''
        });
    });

    it('shows the page title and the data availability note', async () => {
        const { wrapper } = await mountReport();

        expect(wrapper.find('h2').text()).toBe('Reporte de verificaciones de identidad');
        expect(wrapper.find('[data-testid="ivr-data-availability-note"]').text()).toContain('17/09/2026');
    });

    it('shows total, manual and Mercado Pago attempt counts', async () => {
        const { wrapper } = await mountReport();

        expect(wrapper.find('[data-testid="ivr-total-attempts"]').text()).toContain('150');
        expect(wrapper.find('[data-testid="ivr-manual-attempts"]').text()).toContain('30');
        expect(wrapper.find('[data-testid="ivr-automatic-attempts"]').text()).toContain('120');
    });

    it('lists manual outcomes in separate rows with count and percentage', async () => {
        const { wrapper } = await mountReport();

        expect(rowText(wrapper, 'ivr-manual-table', 'approved')).toContain('Aprobadas');
        expect(rowText(wrapper, 'ivr-manual-table', 'approved')).toContain('13');
        expect(rowText(wrapper, 'ivr-manual-table', 'approved')).toContain('43,33 %');
        expect(rowText(wrapper, 'ivr-manual-table', 'rejected')).toContain('4');
        expect(rowText(wrapper, 'ivr-manual-table', 'rejected')).toContain('13,33 %');
        expect(rowText(wrapper, 'ivr-manual-table', 'inconclusive')).toContain('Inconclusas');
        expect(rowText(wrapper, 'ivr-manual-table', 'inconclusive')).toContain('26,67 %');
        expect(rowText(wrapper, 'ivr-manual-table', 'pending_review')).toContain('Pendientes de revisión');
        expect(rowText(wrapper, 'ivr-manual-table', 'pending_review')).toContain('16,67 %');
    });

    it('lists Mercado Pago outcomes with count and percentage', async () => {
        const { wrapper } = await mountReport();

        expect(wrapper.findAll('[data-testid="ivr-automatic-table"] tbody tr')).toHaveLength(5);
        expect(rowText(wrapper, 'ivr-automatic-table', 'approved')).toContain('78');
        expect(rowText(wrapper, 'ivr-automatic-table', 'approved')).toContain('65 %');
        expect(rowText(wrapper, 'ivr-automatic-table', 'error')).toContain('6');
        expect(rowText(wrapper, 'ivr-automatic-table', 'cancelled')).toContain('6,67 %');
        expect(rowText(wrapper, 'ivr-automatic-table', 'abandoned')).toContain('Abandonadas');
        expect(rowText(wrapper, 'ivr-automatic-table', 'abandoned')).toContain('8,33 %');
    });

    it('renders one row per period in the series table', async () => {
        const { wrapper } = await mountReport();

        const rows = wrapper.findAll('[data-testid="ivr-series-table"] tbody tr');
        expect(rows).toHaveLength(2);
        const firstRowCells = rows[0].findAll('th, td').map((cell) => cell.text());
        expect(firstRowCells).toEqual(['2026-09', '100', '20', '9', '3', '6', '2', '80', '52', '12', '4', '6', '6']);
        expect(wrapper.find('[data-testid="ivr-series-table"] thead').text()).toContain('Mes');
    });

    it('shows the fall-through funnel after failed Mercado Pago attempts', async () => {
        const { wrapper } = await mountReport();
        const funnel = wrapper.find('[data-testid="ivr-funnel"]');

        expect(funnel.find('[data-testid="ivr-funnel-failed-users"]').text()).toContain('21');
        expect(funnel.find('[data-testid="ivr-funnel-resolved"]').text()).toContain('12');
        expect(funnel.find('[data-testid="ivr-funnel-resolved"]').text()).toContain('57,14 %');
        expect(funnel.find('[data-testid="ivr-funnel-unresolved"]').text()).toContain('9');
        expect(funnel.find('[data-testid="ivr-funnel-unresolved"]').text()).toContain('42,86 %');
        expect(funnel.find('[data-testid="ivr-funnel-unlinked"]').text()).toContain('2');
        expect(funnel.find('[data-funnel-row="mercado_pago"]').text()).toContain('7');
        expect(funnel.find('[data-funnel-row="admin_edit"]').text()).toContain('1');
    });
});

describe('AdminIdentityVerificationReport states', () => {
    it('shows a loading state while the report is being fetched', async () => {
        const pending = deferred();
        apiMock.getIdentityVerificationReport.mockReturnValue(pending.promise);

        const { wrapper } = await mountReport();

        expect(wrapper.find('[data-testid="ivr-loading"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="ivr-total-attempts"]').exists()).toBe(false);

        pending.resolve(makeIdentityVerificationReport());
        await flushPromises();

        expect(wrapper.find('[data-testid="ivr-loading"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ivr-total-attempts"]').exists()).toBe(true);
    });

    it('shows an empty state when the range has no data', async () => {
        apiMock.getIdentityVerificationReport.mockResolvedValue(makeEmptyIdentityVerificationReport());

        const { wrapper } = await mountReport();

        expect(wrapper.find('[data-testid="ivr-empty"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="ivr-manual-table"]').exists()).toBe(false);
    });

    it('shows an error state and retries on demand', async () => {
        apiMock.getIdentityVerificationReport.mockRejectedValueOnce({ status: 500, data: {} });

        const { wrapper } = await mountReport();

        const error = wrapper.find('[data-testid="ivr-error"]');
        expect(error.exists()).toBe(true);
        expect(error.text()).toContain('No se pudo cargar el reporte');

        await error.find('button').trigger('click');
        await flushPromises();

        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledTimes(2);
        expect(wrapper.find('[data-testid="ivr-error"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ivr-total-attempts"]').text()).toContain('150');
    });
});

describe('AdminIdentityVerificationReport filters', () => {
    it('reads the filters from the URL query, sends them and shows them in the form', async () => {
        const { wrapper } = await mountReport(
            `${ROUTE_PATH}?from=2026-09-17&to=2026-09-30&group_by=day&method=manual&surface=choice_cards&platform=ios&app_version=4.0.19`
        );

        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledWith({
            from: '2026-09-17',
            to: '2026-09-30',
            groupBy: 'day',
            method: 'manual',
            surface: 'choice_cards',
            platform: 'ios',
            appVersion: '4.0.19'
        });
        expect(wrapper.find('#ivr-filter-from').element.value).toBe('2026-09-17');
        expect(wrapper.find('#ivr-filter-to').element.value).toBe('2026-09-30');
        expect(wrapper.find('#ivr-filter-group-by').element.value).toBe('day');
        expect(wrapper.find('#ivr-filter-method').element.value).toBe('manual');
        expect(wrapper.find('#ivr-filter-surface').element.value).toBe('choice_cards');
        expect(wrapper.find('#ivr-filter-platform').element.value).toBe('ios');
        expect(wrapper.find('#ivr-filter-app-version').element.value).toBe('4.0.19');
    });

    it('offers month, week and day grouping and all, manual and Mercado Pago methods', async () => {
        const { wrapper } = await mountReport();

        const optionValues = (selector) =>
            wrapper.findAll(`${selector} option`).map((option) => option.element.value);
        expect(optionValues('#ivr-filter-group-by')).toEqual(['month', 'week', 'day']);
        expect(optionValues('#ivr-filter-method')).toEqual(['all', 'manual', 'mercado_pago']);
        expect(optionValues('#ivr-filter-platform')).toEqual(['', 'android', 'ios', 'web']);
        expect(wrapper.find('#ivr-filter-method').text()).toContain('Mercado Pago');
    });

    it('changing the method updates the URL and refetches', async () => {
        const { wrapper, router } = await mountReport();

        await wrapper.find('#ivr-filter-method').setValue('mercado_pago');
        await flushPromises();

        expect(router.currentRoute.value.query).toMatchObject({ method: 'mercado_pago', group_by: 'month' });
        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledTimes(2);
        expect(apiMock.getIdentityVerificationReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ method: 'mercado_pago', from: '2026-05-01', to: '2026-10-15' })
        );
    });

    it('changing the grouping refetches and renames the period column', async () => {
        const { wrapper, router } = await mountReport();

        await wrapper.find('#ivr-filter-group-by').setValue('week');
        await flushPromises();

        expect(router.currentRoute.value.query.group_by).toBe('week');
        expect(apiMock.getIdentityVerificationReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ groupBy: 'week' })
        );
        expect(wrapper.find('[data-testid="ivr-series-table"] thead').text()).toContain('Semana (lunes)');
    });

    it('changing a date refetches with the new range', async () => {
        const { wrapper, router } = await mountReport();

        await commitInput(wrapper, '#ivr-filter-from', '2026-09-17');

        expect(router.currentRoute.value.query.from).toBe('2026-09-17');
        expect(apiMock.getIdentityVerificationReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ from: '2026-09-17', to: '2026-10-15' })
        );
    });

    it('sends optional platform, surface and app version filters, trimmed', async () => {
        const { wrapper, router } = await mountReport();

        await wrapper.find('#ivr-filter-platform').setValue('android');
        await flushPromises();
        await commitInput(wrapper, '#ivr-filter-app-version', ' 4.0.19 ');
        await commitInput(wrapper, '#ivr-filter-surface', 'pending_switch');

        expect(router.currentRoute.value.query).toMatchObject({
            platform: 'android',
            app_version: '4.0.19',
            surface: 'pending_switch'
        });
        expect(apiMock.getIdentityVerificationReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ platform: 'android', appVersion: '4.0.19', surface: 'pending_switch' })
        );
    });

    it('warns that manual attempts are not tracked by client-context filters', async () => {
        const { wrapper } = await mountReport(`${ROUTE_PATH}?platform=android`);

        expect(wrapper.find('[data-testid="ivr-client-filters-note"]').exists()).toBe(true);
    });

    it('does not refetch and explains the problem when the range is inverted', async () => {
        const { wrapper, router } = await mountReport();

        await commitInput(wrapper, '#ivr-filter-from', '2026-11-01');

        expect(wrapper.find('[data-testid="ivr-filters-error"]').text()).toContain('igual o posterior');
        expect(apiMock.getIdentityVerificationReport).toHaveBeenCalledTimes(1);
        expect(router.currentRoute.value.query.from).toBeUndefined();
    });

    it('refetches when the URL query changes (back/forward navigation)', async () => {
        const { router } = await mountReport();

        await router.push(`${ROUTE_PATH}?from=2026-09-01&to=2026-09-30&group_by=day&method=all`);
        await flushPromises();

        expect(apiMock.getIdentityVerificationReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ from: '2026-09-01', to: '2026-09-30', groupBy: 'day' })
        );
    });

    it('ignores a slow response that arrives after a newer one', async () => {
        const slow = deferred();
        apiMock.getIdentityVerificationReport.mockReturnValueOnce(slow.promise);
        const newer = makeIdentityVerificationReport();
        newer.totals.attempts = 999;
        apiMock.getIdentityVerificationReport.mockResolvedValueOnce(newer);

        const { wrapper } = await mountReport();
        await wrapper.find('#ivr-filter-method').setValue('manual');
        await flushPromises();
        slow.resolve(makeIdentityVerificationReport());
        await flushPromises();

        expect(wrapper.find('[data-testid="ivr-total-attempts"]').text()).toContain('999');
    });

    it('shows only the manual section when filtering by manual', async () => {
        const { wrapper } = await mountReport(`${ROUTE_PATH}?method=manual`);

        expect(wrapper.find('[data-testid="ivr-manual-table"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="ivr-automatic-table"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ivr-funnel"]').exists()).toBe(false);
    });

    it('shows only Mercado Pago sections when filtering by Mercado Pago', async () => {
        const { wrapper } = await mountReport(`${ROUTE_PATH}?method=mercado_pago`);

        expect(wrapper.find('[data-testid="ivr-manual-table"]').exists()).toBe(false);
        expect(wrapper.find('[data-testid="ivr-automatic-table"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="ivr-funnel"]').exists()).toBe(true);
    });
});
