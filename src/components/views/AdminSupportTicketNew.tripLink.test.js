// @vitest-environment happy-dom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

const ticketsApi = vi.hoisted(() => ({ adminCreate: vi.fn() }));
const dialogs = vi.hoisted(() => ({ message: vi.fn() }));

vi.mock('../../services/api', async (importOriginal) => ({
    ...(await importOriginal()),
    TicketsApi: vi.fn(function TicketsApi() {
        return ticketsApi;
    })
}));
vi.mock('../../services/dialogs', () => ({ default: dialogs }));

const EXCESS_QUERY = {
    userId: '15',
    userName: 'Ana Pérez',
    type: 'excess_contribution',
    subject: 'Exceso de contribución',
    message: 'Hola',
    tripId: '321'
};

async function mountForm(query = EXCESS_QUERY) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const router = { replace: vi.fn(), push: vi.fn() };
    const { default: AdminSupportTicketNew } = await import('./AdminSupportTicketNew.vue');
    const wrapper = mount(AdminSupportTicketNew, {
        global: {
            plugins: [pinia, i18n],
            mocks: { $route: { query }, $router: router },
            stubs: {
                AdminLayout: { template: '<div><slot /></div>' },
                UserSearchAutocomplete: true
            }
        }
    });
    await flushPromises();
    return { wrapper, router };
}

async function submit(wrapper) {
    const button = wrapper
        .findAll('button')
        .find((candidate) => candidate.text() === i18n.global.t('crearTicket'));
    await button.trigger('click');
    await flushPromises();
}

describe('AdminSupportTicketNew trip link', () => {
    beforeAll(async () => {
        await import('./AdminSupportTicketNew.vue');
    }, 30000);

    beforeEach(() => {
        ticketsApi.adminCreate.mockReset();
        dialogs.message.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sends the prefilled trip id with the ticket', async () => {
        ticketsApi.adminCreate.mockResolvedValue({ data: { id: 88 } });
        const { wrapper, router } = await mountForm();

        await submit(wrapper);

        expect(ticketsApi.adminCreate).toHaveBeenCalledWith({
            user_id: 15,
            type: 'excess_contribution',
            subject: 'Exceso de contribución',
            message_markdown: 'Hola',
            trip_id: 321
        });
        expect(router.push).toHaveBeenCalledWith({
            name: 'admin-support-ticket-detail',
            params: { id: 88 }
        });
    });

    it('keeps the trip id in the route query when the form changes', async () => {
        const { wrapper, router } = await mountForm();

        wrapper.vm.createForm.subject = 'Otro asunto';
        await flushPromises();

        expect(router.replace).toHaveBeenLastCalledWith({
            query: expect.objectContaining({ tripId: '321', subject: 'Otro asunto' })
        });
    });

    it('sends no trip when the form was not opened from a trip', async () => {
        ticketsApi.adminCreate.mockResolvedValue({ data: { id: 88 } });
        const { tripId: _tripId, ...query } = EXCESS_QUERY;
        const { wrapper } = await mountForm(query);

        await submit(wrapper);

        expect(ticketsApi.adminCreate).toHaveBeenCalledWith(
            expect.objectContaining({ user_id: 15, trip_id: null })
        );
    });

    it('drops the trip when another user is selected', async () => {
        ticketsApi.adminCreate.mockResolvedValue({ data: { id: 88 } });
        const { wrapper, router } = await mountForm();

        wrapper.vm.selectedUser = { id: 99, name: 'Otra persona', email: '' };
        await flushPromises();
        await submit(wrapper);

        expect(ticketsApi.adminCreate).toHaveBeenCalledWith(
            expect.objectContaining({ user_id: 99, trip_id: null })
        );
        expect(router.replace.mock.calls.at(-1)[0].query.tripId).toBeUndefined();
    });

    it('shows the already-exists snackbar when the trip already has an excess ticket', async () => {
        ticketsApi.adminCreate.mockRejectedValue({
            status: 409,
            data: { existing_ticket_id: 55 }
        });
        const { wrapper, router } = await mountForm();

        await submit(wrapper);

        expect(dialogs.message).toHaveBeenCalledWith(
            i18n.global.t('excessContributionTicketAlreadyExists'),
            { estado: 'error' }
        );
        expect(router.push).not.toHaveBeenCalled();
    });

    it('keeps the generic error snackbar for other failures', async () => {
        ticketsApi.adminCreate.mockRejectedValue({ status: 422, data: {} });
        const { wrapper } = await mountForm();

        await submit(wrapper);

        expect(dialogs.message).toHaveBeenCalledWith(i18n.global.t('errorDatos'), {
            estado: 'error'
        });
    });
});
