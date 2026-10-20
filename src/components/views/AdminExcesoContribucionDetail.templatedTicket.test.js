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
        trip_date: '2026-10-01 10:30:00',
        exceso_contribucion_status: 'pending',
        excess_contribution_support_tickets_count: 0,
        maximum_seat_price_cents: 1200000,
        ...overrides
    };
}

async function mountDetail({
    permissions = [EXCESS, SUPPORT_TICKETS],
    detail = item(),
    router = { push: vi.fn(), replace: vi.fn() }
} = {}) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    useAuthStore().$patch({
        auth: true,
        user: { id: 1, name: 'Lucía Gómez', is_admin: true, admin_permissions: permissions }
    });
    adminApi.getTripExcessContribution.mockResolvedValue({ data: detail });
    const { default: AdminExcesoContribucionDetail } = await import(
        './AdminExcesoContribucionDetail.vue'
    );
    const wrapper = mount(AdminExcesoContribucionDetail, {
        props: { tripId: detail.id },
        global: {
            plugins: [pinia, i18n],
            mocks: { $publicImg: () => '', $router: router },
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
    return { wrapper, router };
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

function templateModal(wrapper) {
    return wrapper.find('[data-testid="excess-ticket-template-modal"]');
}

function createFromTemplateButton(wrapper) {
    return wrapper.find('[data-testid="excess-ticket-template-create"]');
}

function selectTemplate(wrapper, templateId) {
    return wrapper.find(`[data-testid="excess-ticket-template-${templateId}"]`).setValue(true);
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
    beforeAll(async () => {
        await import('./AdminExcesoContribucionDetail.vue');
    }, 30000);

    beforeEach(() => {
        ticketsApi.adminCreate.mockReset();
        dialogs.message.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows the templated ticket button next to the existing support ticket button', async () => {
        const { wrapper } = await mountDetail();

        const actions = wrapper.find('.admin-exceso-actions');
        const button = actions.find('.admin-exceso-templated-ticket');
        expect(button.exists()).toBe(true);
        expect(button.element.tagName).toBe('BUTTON');
        expect(button.text()).toBe(i18n.global.t('excessContributionTemplatedTicketButton'));
        expect(actions.text()).toContain(i18n.global.t('crearTicketSoporte'));
        expect(existingTicketLink(wrapper).exists()).toBe(false);
        expect(templateModal(wrapper).exists()).toBe(false);
    });

    it('prefills the manual support ticket form with the trip', async () => {
        const { wrapper } = await mountDetail();

        expect(linkTarget(supportTicketButton(wrapper))).toMatchObject({
            name: 'admin-support-ticket-new',
            query: { userId: 15, type: 'excess_contribution', tripId: 321 }
        });
        expect(linkTarget(supportTicketButton(wrapper)).query.message).toBeUndefined();
    });

    it('hides both ticket buttons for admins without the support tickets permission', async () => {
        const { wrapper } = await mountDetail({ permissions: [EXCESS] });

        expect(templatedButton(wrapper).exists()).toBe(false);
        expect(supportTicketButton(wrapper).exists()).toBe(false);
        expect(wrapper.text()).not.toContain(i18n.global.t('crearTicketSoporte'));
    });

    it('links to the existing excess ticket instead of offering new ones', async () => {
        const { wrapper } = await mountDetail({
            detail: item({ excess_contribution_ticket_id: 55 })
        });

        expectExistingTicketLink(wrapper, 55);
    });

    it('hides the button when the item has no user', async () => {
        const { wrapper } = await mountDetail({ detail: item({ user_id: null }) });

        expect(templatedButton(wrapper).exists()).toBe(false);
    });

    it('opens a template picker instead of creating the ticket immediately', async () => {
        const { wrapper, router } = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await flushPromises();

        expect(templateModal(wrapper).exists()).toBe(true);
        expect(templateModal(wrapper).text()).toContain(i18n.global.t('plantillasModalTitulo'));
        expect(templateModal(wrapper).text()).toContain('1er falta');
        expect(templateModal(wrapper).text()).toContain('2da falta');
        expect(templateModal(wrapper).text()).toContain('3er falta');
        expect(createFromTemplateButton(wrapper).attributes('disabled')).toBeDefined();
        expect(ticketsApi.adminCreate).not.toHaveBeenCalled();
        expect(router.push).not.toHaveBeenCalled();
    });

    it('goes to the new ticket page with the selected markdown template', async () => {
        const { wrapper, router } = await mountDetail();

        await templatedButton(wrapper).trigger('click');
        await selectTemplate(wrapper, 'second');
        await createFromTemplateButton(wrapper).trigger('click');
        await flushPromises();

        expect(ticketsApi.adminCreate).not.toHaveBeenCalled();
        expect(router.push).toHaveBeenCalledTimes(1);
        const route = router.push.mock.calls[0][0];
        expect(route.name).toBe('admin-support-ticket-new');
        expect(route.query).toMatchObject({
            userId: '15',
            userName: 'Ana Pérez',
            type: 'excess_contribution',
            subject: i18n.global.t('ticketTypeExcessContribution'),
            tripId: '321'
        });
        expect(route.query.message).toContain('Hola Ana Pérez');
        expect(route.query.message).toContain('Soy Lucía Gómez,');
        expect(route.query.message).toContain('**Al ser el segundo incumplimiento, implica 3 meses de suspension.**');
        expect(route.query.message).toContain('https://mpago.la/2Fq9F9U');
    });
});
