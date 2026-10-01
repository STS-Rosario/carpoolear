// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '../../i18n';

vi.mock('../../services/api/Donation.js', () => ({
    default: {
        getTiers: vi.fn(() => Promise.reject(new Error('offline'))),
        checkoutOnce: vi.fn(),
        checkoutMonthly: vi.fn()
    }
}));

const fmt = (amount) => amount.toLocaleString('es-AR');

/** Every text on the page, in the document's order. */
const DOCUMENT = {
    arg: [
        'Tu aporte',
        'es fundamental',
        'Queremos seguir siendo la mejor comunidad de carpooling de Argentina.',
        'Carpoolear es un proyecto colaborativo sin fines de lucro de la ONG STS Rosario. En ruta desde el 2013, hoy día es la comunidad de Carpooling más grande de Argentina, integrada por más de 450.000 personas y más de 1500 viajes mensuales. Se requiere mucho trabajo, ya no es suficiente sólo con voluntariado. Por eso, es importante tu aporte para poder mantener y mejorar Carpoolear tal como lo venimos haciendo desde que salimos de “Zona de derrumbe” en 2025.',
        'Sumate al',
        'Club Carpoolear',
        'Con tu aporte mensual podemos mantenernos y seguir mejorando, a cambio obtenés los siguientes beneficios por ser parte:',
        'Soporte prioritario: tus tickets de Mesa de Ayuda tendrán prioridad.',
        'Acceso anticipado: vas a poder probar funcionalidades nuevas antes que salgan.',
        'Informe semestral: cada 6 meses te vamos a mandar un mail contándote lo que logramos gracias a tu aporte.',
        'Pin: tu perfil tendrá una insignia y vas a aparecer en una lista de personas que forman parte del Club Carpoolear (si así lo querés).',
        'Puedo aportar cada mes con el equivalente a...',
        `$ ${fmt(5000)} (café)`,
        `$ ${fmt(7500)} (pinta de cerveza)`,
        `$ ${fmt(12000)} (comida)`,
        'Quiero formar parte del Club Carpoolear',
        '(cancelá cuando quieras)',
        '¿No podés comprometerte a aportar cada mes? Podés hacerlo por única vez:',
        `$ ${fmt(5000)} (café)`,
        `$ ${fmt(7500)} (pinta de cerveza)`,
        `$ ${fmt(12000)} (comida)`,
        'Quiero aportar por única vez',
        '¿No estás en condiciones de aportar económicamente? ¿Simplemente te gusta meter las manos en el barro? Podés aportar tu tiempo sumándote al voluntariado, siempre necesitamos una mano en las distintas áreas del proyecto.',
        'Siempre recordá que el aporte más sencillo y fundamental es hacer correr la voz. Sí, el boca en boca es fundamental para que crezca la comunidad Carpoolear y se compartan más viajes:',
        'Si usas las redes sociales virtuales Instagram, Facebook y compartí nuestras publicaciones/historias.',
        'Mejor aún, la red social del cara a cara… contale a tus amistades y familia sobre Carpoolear, contales de ese viaje que compartiste, de la gente que conociste, contales que compartir no es una locura.',
        'Buen viaje!',
        'Equipo Carpoolear (también conocido como “La gente de Carpu”)'
    ],
    en: [
        'Your contribution',
        'is essential',
        'We want to keep being the best carpooling community in Argentina.',
        'Carpoolear is a collaborative non-profit project of the NGO STS Rosario. On the road since 2013, today it is the largest carpooling community in Argentina, made up of more than 450,000 people and more than 1500 trips a month. It takes a lot of work, and volunteering alone is no longer enough. That is why your contribution is important, so we can keep maintaining and improving Carpoolear the way we have been doing since we got out of the “Landslide Zone” in 2025.',
        'Join the',
        'Carpoolear Club',
        'With your monthly contribution we can keep going and keep improving, and in return you get the following benefits for being part of it:',
        'Priority support: your Help Desk tickets will have priority.',
        'Early access: you\'ll be able to try new features before they come out.',
        'Semiannual report: every 6 months we\'ll send you an email telling you what we achieved thanks to your contribution.',
        'Pin: your profile will have a badge and you\'ll appear on a list of people who are part of the Carpoolear Club (if you want).',
        'I can contribute each month the equivalent of...',
        `$ ${fmt(5000)} (coffee)`,
        `$ ${fmt(7500)} (a pint of beer)`,
        `$ ${fmt(12000)} (a meal)`,
        'I want to be part of the Carpoolear Club',
        '(cancel anytime)',
        'Can\'t commit to contributing every month? You can do it just once:',
        `$ ${fmt(5000)} (coffee)`,
        `$ ${fmt(7500)} (a pint of beer)`,
        `$ ${fmt(12000)} (a meal)`,
        'I want to contribute just once',
        'Not in a position to contribute financially? Do you simply like getting your hands dirty? You can contribute your time by joining our volunteers; we always need a hand in the different areas of the project.',
        'Always remember that the simplest and most essential contribution is spreading the word. Yes, word of mouth is essential for the Carpoolear community to grow and for more trips to be shared:',
        'If you use the virtual social networks Instagram and Facebook, share our posts/stories.',
        'Even better, the face-to-face social network… tell your friends and family about Carpoolear, tell them about that trip you shared, about the people you met, tell them that sharing is not crazy.',
        'Have a good trip!',
        'The Carpoolear Team (also known as “La gente de Carpu”)'
    ]
};

/** After-rating only: the "Continuar sin aportar" skip button, right before "Buen viaje!". */
const SKIP = {
    arg: 'Continuar sin aportar',
    en: 'Continue without contributing'
};

function expectedTexts(locale, showsSkip) {
    const texts = [...DOCUMENT[locale]];
    if (showsSkip) {
        texts.splice(texts.length - 2, 0, SKIP[locale]);
    }
    return texts;
}

function setLocale(locale) {
    if (typeof i18n.global.locale === 'object') {
        i18n.global.locale.value = locale;
    } else {
        i18n.global.locale = locale;
    }
}

async function mountPage(props) {
    const pinia = createPinia();
    setActivePinia(pinia);
    const { useAuthStore } = await import('../../stores/auth');
    useAuthStore().$patch({ auth: true, user: { id: 42, name: 'Ana' } });
    const { default: DonationAfterRating } = await import(
        './DonationAfterRating.vue'
    );
    const wrapper = mount(DonationAfterRating, {
        props,
        global: {
            plugins: [pinia, i18n],
            mocks: { $router: { push: vi.fn() }, $publicImg: () => '' }
        }
    });
    await flushPromises();
    return wrapper;
}

/** Bold texts: benefit titles, the volunteer/Instagram/Facebook links and the team name. */
const BOLD = {
    arg: [
        'Soporte prioritario:',
        'Acceso anticipado:',
        'Informe semestral:',
        'Pin:',
        'sumándote al voluntariado',
        'Instagram',
        'Facebook',
        'Equipo Carpoolear'
    ],
    en: [
        'Priority support:',
        'Early access:',
        'Semiannual report:',
        'Pin:',
        'by joining our volunteers',
        'Instagram',
        'Facebook',
        'The Carpoolear Team'
    ]
};

const squash = (text) => text.replace(/\s+/g, '');

describe('DonationAfterRating page matches the copy document', () => {
    beforeAll(async () => {
        await import('./DonationAfterRating.vue');
    }, 30000);

    afterEach(() => {
        setLocale('arg');
        vi.restoreAllMocks();
    });

    describe.each([
        ['after rating', { tripId: 7 }, true],
        ['/donate page', {}, false]
    ])('%s', (_label, props, showsSkip) => {
        it.each(['arg', 'en'])(
            'shows exactly the document texts (plus the skip button only after rating), in order, in %s',
            async (locale) => {
                vi.spyOn(console, 'warn').mockImplementation(() => {});
                setLocale(locale);
                const wrapper = await mountPage(props);

                const pageText = squash(wrapper.text());
                expect(pageText).toBe(squash(expectedTexts(locale, showsSkip).join('')));
            }
        );

        it.each(['arg', 'en'])(
            'bolds only the benefit titles, the links and the team name in %s',
            async (locale) => {
                vi.spyOn(console, 'warn').mockImplementation(() => {});
                setLocale(locale);
                const wrapper = await mountPage(props);

                expect(wrapper.findAll('strong').map((bold) => bold.text())).toEqual(
                    BOLD[locale]
                );
                wrapper
                    .findAll('.donation-after-rating__benefits-item')
                    .forEach((item, index) => {
                        expect(item.find('strong').text()).toBe(BOLD[locale][index]);
                        expect(item.text().startsWith(BOLD[locale][index])).toBe(true);
                    });
            }
        );

        it('links the volunteer, Instagram and Facebook texts in bold', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper = await mountPage(props);

            const boldLinks = wrapper
                .findAll('strong > a')
                .map((link) => [link.text(), link.attributes('href'), link.attributes('target')]);
            expect(boldLinks).toEqual([
                [
                    'sumándote al voluntariado',
                    'https://carpoolear.com.ar/colabora-como-colaborar',
                    '_blank'
                ],
                ['Instagram', 'https://instagram.com/carpoolear', '_blank'],
                ['Facebook', 'https://facebook.com/carpoolear', '_blank']
            ]);
        });

        it('lists the word-of-mouth bullets after their intro', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper = await mountPage(props);

            const bullets = wrapper.findAll(
                '.donation-after-rating__word-of-mouth > li'
            );
            expect(bullets.map((bullet) => squash(bullet.text()))).toEqual([
                squash(DOCUMENT.arg[DOCUMENT.arg.length - 4]),
                squash(DOCUMENT.arg[DOCUMENT.arg.length - 3])
            ]);
            expect(wrapper.find('.donation-after-rating__btn-skip').exists()).toBe(
                showsSkip
            );
        });

        it('places the skip button after the word-of-mouth bullets, right before "Buen viaje!"', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper = await mountPage(props);

            const skip = wrapper.find(
                '.donation-after-rating__alternatives > .donation-after-rating__btn-skip'
            );
            expect(skip.exists()).toBe(showsSkip);
            if (showsSkip) {
                expect(skip.element.tagName).toBe('BUTTON');
                expect(skip.classes()).toContain('app-button--secondary');
                expect(skip.element.previousElementSibling.className).toBe(
                    'donation-after-rating__word-of-mouth-block'
                );
                expect(skip.element.nextElementSibling.className).toBe(
                    'donation-after-rating__sign-off'
                );
                expect(skip.element.closest('strong')).toBeNull();
            }
        });
    });
});
