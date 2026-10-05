// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

vi.mock('../../router', () => ({ default: { push: vi.fn() } }));

vi.mock('../../classes/Threads.js', () => ({
    Thread: class Thread {
        run() {}
        stop() {}
    }
}));

const selectedConversation = {
    id: 11,
    title: 'Fernando Robledo',
    trip: {
        from_town: 'Rosario',
        to_town: 'Buenos Aires',
        description: 'Salgo desde Oroño'
    }
};

function isCoordinateTripShown(wrapper) {
    const el = wrapper.find('.coordinate-trip-stub');
    if (!el.exists()) {
        return false;
    }
    return !/display:\s*none/.test(el.attributes('style') || '');
}

async function mountConversationList({ isMobile, conversationOpen }) {
    const pinia = createPinia();
    setActivePinia(pinia);

    const { useConversationsStore } = await import('../../stores/conversations');
    const { useDeviceStore } = await import('../../stores/device');
    const { useAuthStore } = await import('../../stores/auth');

    const conversationsStore = useConversationsStore();
    conversationsStore.listSearch = vi.fn(() => Promise.resolve());
    conversationsStore.getUnreaded = vi.fn();
    conversationsStore.select = vi.fn();
    conversationsStore.$patch({
        _list: [selectedConversation],
        conversationSelected: selectedConversation,
        selectedID: selectedConversation.id
    });

    useDeviceStore().$patch({
        resolution: {
            width: isMobile ? 375 : 1024,
            height: 800
        }
    });
    useAuthStore().$patch({
        appConfig: {
            web_push_notification: true,
            enable_footer: true
        }
    });

    const { default: ConversationList } = await import('./ConversationList.vue');
    return mount(ConversationList, {
        global: {
            plugins: [pinia, i18n],
            mocks: {
                $route: {
                    meta: { hide: conversationOpen }
                },
                $publicImg: () => ''
            },
            directives: { imgSrc: {} },
            stubs: {
                CoordinateTrip: {
                    name: 'CoordinateTrip',
                    template: '<div class="coordinate-trip-stub" />'
                },
                Loading: {
                    template: '<div><slot /><slot name="no-data" /><slot name="loading" /></div>'
                },
                FilterChips: true,
                AppInput: true,
                AppButton: true,
                UserNameWithBadge: true,
                'router-view': true
            }
        }
    });
}

describe('ConversationList mobile trip header', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('hides the trip header on the mobile conversations list even if a chat is still selected', async () => {
        const wrapper = await mountConversationList({
            isMobile: true,
            conversationOpen: false
        });

        expect(isCoordinateTripShown(wrapper)).toBe(false);
        wrapper.unmount();
    });

    it('shows the trip header on mobile while a conversation is open', async () => {
        const wrapper = await mountConversationList({
            isMobile: true,
            conversationOpen: true
        });

        expect(isCoordinateTripShown(wrapper)).toBe(true);
        wrapper.unmount();
    });

    it('hides the list trip header on desktop where chat renders its own', async () => {
        const wrapper = await mountConversationList({
            isMobile: false,
            conversationOpen: true
        });

        expect(isCoordinateTripShown(wrapper)).toBe(false);
        wrapper.unmount();
    });
});
