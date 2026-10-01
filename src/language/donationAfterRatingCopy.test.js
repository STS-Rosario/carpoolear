import { describe, expect, it } from 'vitest';
import messages from './i18n';

/** Donation page copy: the user's document, verbatim (arg), and its English translation. */
const ES_COPY = {
    donationAfterRatingHeroTitlePrimary:
        'Tu aporte',
    donationAfterRatingHeroTitleAccent:
        'es fundamental',
    donationAfterRatingMissionLead:
        'Queremos seguir siendo la mejor comunidad de carpooling de Argentina.',
    donationAfterRatingMissionBody:
        'Carpoolear es un proyecto colaborativo sin fines de lucro de la ONG STS Rosario. En ruta desde el 2013, hoy día es la comunidad de Carpooling más grande de Argentina, integrada por más de 450.000 personas y más de 1500 viajes mensuales. Se requiere mucho trabajo, ya no es suficiente sólo con voluntariado. Por eso, es importante tu aporte para poder mantener y mejorar Carpoolear tal como lo venimos haciendo desde que salimos de “Zona de derrumbe” en 2025.',
    donationAfterRatingJoinPrefix:
        'Sumate al',
    donationAfterRatingJoinAccent:
        'Club Carpoolear',
    donationAfterRatingMonthlyBenefitsIntro:
        'Con tu aporte mensual podemos mantenernos y seguir mejorando, a cambio obtenés los siguientes beneficios por ser parte:',
    donationAfterRatingBenefitPrioritySupportTitle:
        'Soporte prioritario:',
    donationAfterRatingBenefitPrioritySupportText:
        'tus tickets de Mesa de Ayuda tendrán prioridad.',
    donationAfterRatingBenefitEarlyAccessTitle:
        'Acceso anticipado:',
    donationAfterRatingBenefitEarlyAccessText:
        'vas a poder probar funcionalidades nuevas antes que salgan.',
    donationAfterRatingBenefitSemiannualReportTitle:
        'Informe semestral:',
    donationAfterRatingBenefitSemiannualReportText:
        'cada 6 meses te vamos a mandar un mail contándote lo que logramos gracias a tu aporte.',
    donationAfterRatingBenefitBadgeTitle:
        'Pin:',
    donationAfterRatingBenefitBadgeText:
        'tu perfil tendrá una insignia y vas a aparecer en una lista de personas que forman parte del Club Carpoolear (si así lo querés).',
    donationAfterRatingMonthlyAmountIntro:
        'Puedo aportar cada mes con el equivalente a...',
    donationAfterRatingJoinCommunityMonthly:
        'Quiero formar parte del Club Carpoolear',
    donationAfterRatingJoinCommunityMonthlyHint:
        'cancelá cuando quieras',
    donationAfterRatingOnceIntro:
        '¿No podés comprometerte a aportar cada mes? Podés hacerlo por única vez:',
    donationAfterRatingOnceCta:
        'Quiero aportar por única vez',
    donationAfterRatingVolunteerParagraph:
        '¿No estás en condiciones de aportar económicamente? ¿Simplemente te gusta meter las manos en el barro? Podés aportar tu tiempo {link}, siempre necesitamos una mano en las distintas áreas del proyecto.',
    donationAfterRatingVolunteerLink:
        'sumándote al voluntariado',
    donationAfterRatingWordOfMouthIntro:
        'Siempre recordá que el aporte más sencillo y fundamental es hacer correr la voz. Sí, el boca en boca es fundamental para que crezca la comunidad Carpoolear y se compartan más viajes:',
    donationAfterRatingInstagramParagraph:
        'Si usas las redes sociales virtuales {instagram}, {facebook} y compartí nuestras publicaciones/historias.',
    donationAfterRatingInstagramLink:
        'Instagram',
    donationAfterRatingFacebookLink:
        'Facebook',
    donationAfterRatingWordOfMouthFaceToFace:
        'Mejor aún, la red social del cara a cara… contale a tus amistades y familia sobre Carpoolear, contales de ese viaje que compartiste, de la gente que conociste, contales que compartir no es una locura.',
    donationAfterRatingSignOffGreeting:
        'Buen viaje!',
    donationAfterRatingSignOffTeam:
        '{team} (también conocido como “La gente de Carpu”)',
    donationAfterRatingSignOffTeamName:
        'Equipo Carpoolear'
};

const EN_COPY = {
    donationAfterRatingHeroTitlePrimary:
        'Your contribution',
    donationAfterRatingHeroTitleAccent:
        'is essential',
    donationAfterRatingMissionLead:
        'We want to keep being the best carpooling community in Argentina.',
    donationAfterRatingMissionBody:
        'Carpoolear is a collaborative non-profit project of the NGO STS Rosario. On the road since 2013, today it is the largest carpooling community in Argentina, made up of more than 450,000 people and more than 1500 trips a month. It takes a lot of work, and volunteering alone is no longer enough. That is why your contribution is important, so we can keep maintaining and improving Carpoolear the way we have been doing since we got out of the “Landslide Zone” in 2025.',
    donationAfterRatingJoinPrefix:
        'Join the',
    donationAfterRatingJoinAccent:
        'Carpoolear Club',
    donationAfterRatingMonthlyBenefitsIntro:
        'With your monthly contribution we can keep going and keep improving, and in return you get the following benefits for being part of it:',
    donationAfterRatingBenefitPrioritySupportTitle:
        'Priority support:',
    donationAfterRatingBenefitPrioritySupportText:
        'your Help Desk tickets will have priority.',
    donationAfterRatingBenefitEarlyAccessTitle:
        'Early access:',
    donationAfterRatingBenefitEarlyAccessText:
        'you\'ll be able to try new features before they come out.',
    donationAfterRatingBenefitSemiannualReportTitle:
        'Semiannual report:',
    donationAfterRatingBenefitSemiannualReportText:
        'every 6 months we\'ll send you an email telling you what we achieved thanks to your contribution.',
    donationAfterRatingBenefitBadgeTitle:
        'Pin:',
    donationAfterRatingBenefitBadgeText:
        'your profile will have a badge and you\'ll appear on a list of people who are part of the Carpoolear Club (if you want).',
    donationAfterRatingMonthlyAmountIntro:
        'I can contribute each month the equivalent of...',
    donationAfterRatingJoinCommunityMonthly:
        'I want to be part of the Carpoolear Club',
    donationAfterRatingJoinCommunityMonthlyHint:
        'cancel anytime',
    donationAfterRatingOnceIntro:
        'Can\'t commit to contributing every month? You can do it just once:',
    donationAfterRatingOnceCta:
        'I want to contribute just once',
    donationAfterRatingVolunteerParagraph:
        'Not in a position to contribute financially? Do you simply like getting your hands dirty? You can contribute your time {link}; we always need a hand in the different areas of the project.',
    donationAfterRatingVolunteerLink:
        'by joining our volunteers',
    donationAfterRatingWordOfMouthIntro:
        'Always remember that the simplest and most essential contribution is spreading the word. Yes, word of mouth is essential for the Carpoolear community to grow and for more trips to be shared:',
    donationAfterRatingInstagramParagraph:
        'If you use the virtual social networks {instagram} and {facebook}, share our posts/stories.',
    donationAfterRatingInstagramLink:
        'Instagram',
    donationAfterRatingFacebookLink:
        'Facebook',
    donationAfterRatingWordOfMouthFaceToFace:
        'Even better, the face-to-face social network… tell your friends and family about Carpoolear, tell them about that trip you shared, about the people you met, tell them that sharing is not crazy.',
    donationAfterRatingSignOffGreeting:
        'Have a good trip!',
    donationAfterRatingSignOffTeam:
        '{team} (also known as “La gente de Carpu”)',
    donationAfterRatingSignOffTeamName:
        'The Carpoolear Team'
};

/** Old copy that is not in the document. */
const REMOVED_KEYS = [
    'donationAfterRatingMissionOrg',
    'donationAfterRatingBenefitVisibility',
    'donationAfterRatingCannotContributeLink',
    'donationAfterRatingCannotContributeSuffix',
    'donationAfterRatingBenefitPrioritySupport',
    'donationAfterRatingBenefitEarlyAccess',
    'donationAfterRatingBenefitSemiannualReport',
    'donationAfterRatingBenefitBadge'
];

describe('donation page copy document', () => {
    it('uses the document texts verbatim in arg', () => {
        Object.keys(ES_COPY).forEach((key) => {
            expect(messages.arg[key], key).toBe(ES_COPY[key]);
        });
    });

    it('uses the translated document texts in en', () => {
        Object.keys(EN_COPY).forEach((key) => {
            expect(messages.en[key], key).toBe(EN_COPY[key]);
        });
    });

    it.each(['arg', 'en'])('drops the old copy that is not in the document in %s', (locale) => {
        REMOVED_KEYS.forEach((key) => {
            expect(messages[locale][key], key).toBeUndefined();
        });
    });

    it.each(['arg', 'en'])('does not bold anything the document does not bold in %s', (locale) => {
        Object.keys(messages[locale])
            .filter((key) => key.startsWith('donationAfterRating'))
            .forEach((key) => {
                expect(messages[locale][key], key).not.toContain('<strong>');
            });
    });
});
