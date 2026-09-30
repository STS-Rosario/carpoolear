// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import IdentityVerificationOutcomesChart from './IdentityVerificationOutcomesChart.vue';
import IdentityVerificationFunnelChart from './IdentityVerificationFunnelChart.vue';

// Chart.js needs a real canvas; unit tests only check what is handed to vue-chartjs.
vi.mock('vue-chartjs', async () => {
    const { h } = await import('vue');
    const stub = (type) => ({
        name: `${type}ChartStub`,
        props: ['chartData', 'chartOptions', 'height'],
        render() {
            return h('div', { class: 'chart-stub', 'data-chart-type': type });
        }
    });
    return { Bar: stub('bar'), Doughnut: stub('doughnut') };
});

const outcomesData = {
    labels: ['2026-09', '2026-10'],
    datasets: [
        { label: 'Aprobadas', data: [9, 4], backgroundColor: '#2e9e5b', stack: 'manual' },
        { label: 'Rechazadas', data: [3, 1], backgroundColor: '#d9534f', stack: 'manual' }
    ]
};

const funnelData = {
    labels: ['Reintento con Mercado Pago', 'Sin verificar'],
    datasets: [{ data: [7, 9], backgroundColor: ['#009ee3', '#d9534f'] }]
};

describe('IdentityVerificationOutcomesChart', () => {
    it('renders a stacked bar chart with the given data and title', () => {
        const wrapper = mount(IdentityVerificationOutcomesChart, {
            props: { chartData: outcomesData, title: 'Resultados por período' }
        });

        const bar = wrapper.findComponent({ name: 'barChartStub' });
        expect(bar.exists()).toBe(true);
        expect(bar.props('chartData')).toEqual(outcomesData);
        const options = bar.props('chartOptions');
        expect(options.scales.x.stacked).toBe(true);
        expect(options.scales.y.stacked).toBe(true);
        expect(options.scales.y.beginAtZero).toBe(true);
        expect(options.scales.y.ticks.precision).toBe(0);
        expect(options.plugins.title).toMatchObject({ display: true, text: 'Resultados por período' });
        expect(options.maintainAspectRatio).toBe(false);
    });
});

describe('IdentityVerificationFunnelChart', () => {
    it('renders a doughnut chart with the funnel slices and title', () => {
        const wrapper = mount(IdentityVerificationFunnelChart, {
            props: { chartData: funnelData, title: 'Resolución de los fallos' }
        });

        const doughnut = wrapper.findComponent({ name: 'doughnutChartStub' });
        expect(doughnut.exists()).toBe(true);
        expect(doughnut.props('chartData')).toEqual(funnelData);
        expect(doughnut.props('chartOptions').plugins.title).toMatchObject({
            display: true,
            text: 'Resolución de los fallos'
        });
        expect(doughnut.props('chartOptions').plugins.legend.position).toBe('right');
    });
});
