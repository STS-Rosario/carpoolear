// @vitest-environment happy-dom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';
import { resolveWebAppBaseUrl } from '../../utils/supportTicketTripReport.js';

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

const NOW = new Date(2026, 9, 1, 10, 30);

function expectedTemplateMessage() {
    const base = resolveWebAppBaseUrl();
    return i18n.global.t('excessContributionTemplatedTicketMessage', {
        tripLink: `[${base}/trips/321](${base}/trips/321)`,
        maxAmount: '$12000',
        bannedUntil: '08/10/2026',
        termsLink: `[${base}/terminos](${base}/terminos)`
    });
}
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
        maximum_seat_price_cents: 1200000,
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
                RouterLink: {
                    props: ['to'],
                    template: '<a :data-to="JSON.stringify(to)"><slot /></a>'
                }
            }
        }
    });
    await flushPromises();
    return wrapper;
}

function ticketCountText(wrapper) {
    const label = `${i18n.global.t('ticketSoporte')}:`;
    const paragraph = wrapper.findAll('p').find((p) => p.text().startsWith(label));
    return paragraph.text().replace(/\s+/g, '');
}

function templatedButton(wrapper) {
    return wrapper.find('.admin-exceso-templated-ticket');
}

function supportTicketButton(wrapper) {
    return wrapper.find('.admin-exceso-support-ticket');
}

function existingTicketLink(wrapper) {
    return wrapper.find('.admin-exceso-existing-ticket');
}

function linkTarget(link) {
    return JSON.parse(link.attributes('data-to'));
}

function expectExistingTicketLink(wrapper, ticketId) {
    expect(templatedButton(wrapper).exists()).toBe(false);
    expect(supportTicketButton(wrapper).exists()).toBe(false);
    const link = existingTicketLink(wrapper);
    expect(link.exists()).toBe(true);
    expect(linkTarget(link)).toEqual({
        name: 'admin-support-ticket-detail',
        params: { id: ticketId }
    });
    expect(link.text()).toContain(i18n.global.t('excessContributionTicketView'));
    expect(link.text()).toContain(`#${ticketId}`);
}

describe('AdminExcesoContribucionDetail templated support ticket', () => {
    let confirmSpy;

    beforeAll(async () => {
        await import('./AdminExcesoContribucionDetail.vue');
    }, 30000);

    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(NOW);
        confirmSpy = vi.fn(() => true);
        vi.stubGlobal('confirm', confirmSpy);
        ticketsApi.adminCreate.mockReset();
        dialogs.message.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
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
        expect(existingTicketLink(wrapper).exists()).toBe(false);
    });

    it('prefills the manual support ticket form with the trip', async () => {
        const wrapper = await mountDetail();

        expect(linkTarget(supportTicketButton(wrapper))).toMatchObject({
            name: 'admin-support-ticket-new',
            query: { userId: 15, type: 'excess_contribution', tripId: 321 }
        });
    });

    it('hides both ticket buttons for admins without the support tickets permission', async () => {
        const wrapper = await mountDetail({ permissions: [EXCESS] });

        expect(templatedButton(wrapper).exists()).toBe(false);
        expect(supportTicketButton(wrapper).exists()).toBe(false);
        expect(wrapper.text()).not.toContain(i18n.global.t('crearTicketSoporte'));
    });

    it('links to the existing excess ticket instead of offering new ones', async () => {
        const wrapper = await mountDetail({
            detail: item({ excess_contribution_ticket_id: 55 })
        });

        expectExistingTicketLink(wrapper, 55);
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
            message_markdown: expectedTemplateMessage(),
            trip_id: 321
        });
        expect(ticketsApi.adminCreate.mock.calls[0][0].message_markdown).toContain(
            'hasta el día 08/10/2026 '
        );
        expect(dialogs.message).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTemplatedTicketCreated'),
            { estado: 'success' }
        );
        expect(ticketCountText(wrapper)).toBe(`${i18n.global.t('ticketSoporte')}:1`.replace(/\s+/g, ''));
        expectExistingTicketLink(wrapper, 77);
    });

    it('shows the already-exists snackbar and links the existing ticket when the backend rejects a second one', async () => {
        ticketsApi.adminCreate.mockRejectedValue({
            status: 409,
            data: {
                error: 'This trip already has an excess contribution ticket.',
                existing_ticket_id: 55
            }
        });
        const wrapper = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await flushPromises();

        expect(dialogs.message).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTicketAlreadyExists'),
            { estado: 'error' }
        );
        expectExistingTicketLink(wrapper, 55);
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
        expect(ticketCountText(wrapper)).toBe(`${i18n.global.t('ticketSoporte')}:-`.replace(/\s+/g, ''));
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
        expectExistingTicketLink(wrapper, 77);
    });
});
