// @vitest-environment happy-dom
// @vitest-environment-options { "url": "https://carpoolear.com.ar/" }
import { afterEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import i18n from '../i18n';
import { stubCapacitorPlatform } from '../utils/capacitorPlatform.fixture.js';

const capacitorMock = vi.hoisted(() => ({
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web')
}));

vi.mock('@capacitor/core', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Capacitor: {
            ...actual.Capacitor,
            isNativePlatform: capacitorMock.isNativePlatform,
            getPlatform: capacitorMock.getPlatform
        }
    };
});

async function mountMessage(text) {
    const { default: MessageView } = await import('./MessageView.vue');
    return shallowMount(MessageView, {
        props: {
            message: { id: 1, user_id: 2, text, created_at: '2026-10-01 10:00:00' },
            user: { id: 1 },
            users: [{ id: 2, name: 'Ana' }]
        },
        global: { plugins: [i18n], directives: { imgSrc: {} } }
    });
}

function hrefs(wrapper) {
    return wrapper.findAll('.message_text a').map((link) => link.attributes('href'));
}

const CHAT_TEXT =
    'Mirá [aportar](https://carpoolear.com.ar/aportar) y https://facebook.com/carpoolear';

describe('MessageView links in chat messages', () => {
    afterEach(() => {
        stubCapacitorPlatform(capacitorMock, 'web');
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it.each([
        ['web', 'https://carpoolear.com.ar/aportar'],
        ['android', 'https://www.carpoolear.com.ar/aportar'],
        ['ios', 'https://carpoolear.com.ar/aportar']
    ])(
        'on %s points app-host links at the remote site and leaves other sites alone',
        async (platform, expectedAportarHref) => {
            stubCapacitorPlatform(capacitorMock, platform);
            const wrapper = await mountMessage(CHAT_TEXT);

            expect(hrefs(wrapper)).toEqual([
                expectedAportarHref,
                'https://facebook.com/carpoolear'
            ]);
        }
    );
});
