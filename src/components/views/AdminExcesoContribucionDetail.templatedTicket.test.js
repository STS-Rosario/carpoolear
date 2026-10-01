// @vitest-environment happy-dom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

const adminApi = vi.hoisted(() => ({
    getTripExcessContribution: vi.fn(),
    updateTripExcessContributionStatus: vi.fn()
}));
const ticketsApi = vi.hoisted(() => ({ adminCreate: vi.fn() }));
const dialogs = vi.hoisted(() => ({ message: vi.fn() }));

vi.mock('../../services/api', async (importOriginal) => ({
    ...(await importOriginal()),
    AdminApi: vi.fn(function AdminApi() {
        return adminApi;
    }),
    TicketsApi: vi.fn(function TicketsApi() {
        return ticketsApi;
    })
}));
vi.mock('../../services/dialogs', () => ({ default: dialogs }));

const TEMPLATE = 'Just a test.\n\nthis is another paragraph\n\nEquipo Carpoolear';
const SUPPORT_TICKETS = 'admin.support.tickets';
const EXCESS = 'admin.trips.excess_contribution';

function item(overrides = {}) {
    return {
        id: 321,
        user_id: 15,
        user_name: 'Ana Pérez',
        user_email: 'ana@example.com',
        from_town: 'Rosario',
        to_town: 'Córdoba',
        exceso_contribucion_status: 'pending',
        excess_contribution_support_tickets_count: 0,
        ...overrides
    };
}

async function mountDetail({ permissions = [EXCESS, SUPPORT_TICKETS], detail = item() } = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    useAuthStore().$patch({
        auth: true,
        user: { id: 1, name: 'Admin', is_admin: true, admin_permissions: permissions }
    });
    adminApi.getTripExcessContribution.mockResolvedValue({ data: detail });
    const { default: AdminExcesoContribucionDetail } = await import(
        './AdminExcesoContribucionDetail.vue'
    );
    const wrapper = mount(AdminExcesoContribucionDetail, {
        props: { tripId: detail.id },
        global: {
            plugins: [pinia, i18n],
            mocks: { $publicImg: () => '' },
            stubs: {
                AdminLayout: { template: '<div><slot /></div>' },
                RouterLink: { template: '<a><slot /></a>' }
            }
        }
    });
    await flushPromises();
    return wrapper;
}

function ticketCountText(wrapper) {
    const label = `${i18n.global.t('ticketSoporte')}:`;
    const paragraph = wrapper.findAll('p').find((p) => p.text().startsWith(label));
    return paragraph.text().replace(/\s+/g, ' ').trim();
}

function templatedButton(wrapper) {
    return wrapper.find('.admin-exceso-templated-ticket');
}

describe('AdminExcesoContribucionDetail templated support ticket', () => {
    let confirmSpy;

    beforeAll(async () => {
        await import('./AdminExcesoContribucionDetail.vue');
    }, 30000);

    beforeEach(() => {
        confirmSpy = vi.fn(() => true);
        vi.stubGlobal('confirm', confirmSpy);
        ticketsApi.adminCreate.mockReset();
        dialogs.message.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('shows the templated ticket button next to the existing support ticket button', async () => {
        const wrapper = await mountDetail();

        const actions = wrapper.find('.admin-exceso-actions');
        const button = actions.find('.admin-exceso-templated-ticket');
        expect(button.exists()).toBe(true);
        expect(button.element.tagName).toBe('BUTTON');
        expect(button.text()).toBe(i18n.global.t('excessContributionTemplatedTicketButton'));
        expect(actions.text()).toContain(i18n.global.t('crearTicketSoporte'));
    });

    it('hides the button for admins without the support tickets permission', async () => {
        const wrapper = await mountDetail({ permissions: [EXCESS] });

        expect(templatedButton(wrapper).exists()).toBe(false);
    });

    it('hides the button when the item has no user', async () => {
        const wrapper = await mountDetail({ detail: item({ user_id: null }) });

        expect(templatedButton(wrapper).exists()).toBe(false);
    });

    it('asks for confirmation naming the user and does nothing when cancelled', async () => {
        confirmSpy.mockReturnValue(false);
        const wrapper = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await flushPromises();

        expect(confirmSpy).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTemplatedTicketConfirm', { name: 'Ana Pérez' })
        );
        expect(ticketsApi.adminCreate).not.toHaveBeenCalled();
        expect(dialogs.message).not.toHaveBeenCalled();
    });

    it('creates the templated excess-contribution ticket for the user and shows a success snackbar', async () => {
        ticketsApi.adminCreate.mockResolvedValue({ data: { id: 77 } });
        const wrapper = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await flushPromises();

        expect(ticketsApi.adminCreate).toHaveBeenCalledTimes(1);
        expect(ticketsApi.adminCreate).toHaveBeenCalledWith({
            user_id: 15,
            type: 'excess_contribution',
            subject: i18n.global.t('ticketTypeExcessContribution'),
            message_markdown: TEMPLATE
        });
        expect(dialogs.message).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTemplatedTicketCreated'),
            { estado: 'success' }
        );
        expect(ticketCountText(wrapper)).toBe(`${i18n.global.t('ticketSoporte')}: 1`);
        expect(templatedButton(wrapper).attributes('disabled')).toBeUndefined();
    });

    it('shows an error snackbar and re-enables the button when the API fails', async () => {
        ticketsApi.adminCreate.mockRejectedValue(new Error('403'));
        const wrapper = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await flushPromises();

        expect(dialogs.message).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTemplatedTicketError'),
            { estado: 'error' }
        );
        expect(ticketCountText(wrapper)).toBe(`${i18n.global.t('ticketSoporte')}: -`);
        expect(templatedButton(wrapper).attributes('disabled')).toBeUndefined();
    });

    it('prevents a double submit while the request is pending', async () => {
        let resolveCreate;
        ticketsApi.adminCreate.mockReturnValue(
            new Promise((resolve) => {
                resolveCreate = resolve;
            })
        );
        const wrapper = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await templatedButton(wrapper).trigger('click');
        wrapper.vm.createTemplatedTicket();
        await flushPromises();

        expect(templatedButton(wrapper).attributes('disabled')).toBeDefined();
        expect(ticketsApi.adminCreate).toHaveBeenCalledTimes(1);
        expect(confirmSpy).toHaveBeenCalledTimes(1);

        resolveCreate({ data: { id: 77 } });
        await flushPromises();
        expect(templatedButton(wrapper).attributes('disabled')).toBeUndefined();
    });
});
