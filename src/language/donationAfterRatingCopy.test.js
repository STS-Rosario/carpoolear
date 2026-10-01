import { describe, expect, it } from 'vitest';
import messages from './i18n';

/** Donation-after-rating page copy (2026 copy document). */
const ES_COPY = {
    donationAfterRatingHeroTitlePrimary:
        'Tu aporte',
    donationAfterRatingHeroTitleAccent:
        'es fundamental',
    donationAfterRatingMissionLead:
        ' Queremos seguir siendo la mejor comunidad de carpooling de Argentina.',
    donationAfterRatingMissionOrg:
        'Carpoolear es un proyecto colaborativo sin fines de lucro de la <strong>ONG STS Rosario</strong>.',
    donationAfterRatingMissionBody:
        'En ruta desde el 2013, hoy día es la comunidad de Carpooling más grande de Argentina, integrada por más de 450.000 personas y más de 1500 viajes mensuales. Se requiere mucho trabajo, ya no es suficiente sólo con voluntariado. Por eso, es importante tu aporte para poder mantener y mejorar Carpoolear tal como lo venimos haciendo desde que salimos de “Zona de derrumbe” en 2025.',
    donationAfterRatingJoinPrefix:
        'Sumate al',
    donationAfterRatingJoinAccent:
        'Club Carpoolear',
    donationAfterRatingMonthlyBenefitsIntro:
        'Con tu <strong>aporte mensual</strong> podemos mantenernos y seguir mejorando, a cambio obtenés los siguientes beneficios por ser parte:',
    donationAfterRatingBenefitPrioritySupport:
        '<strong>Soporte prioritario:</strong> tus tickets de Mesa de Ayuda tendrán prioridad.',
    donationAfterRatingBenefitEarlyAccess:
        '<strong>Acceso anticipado:</strong> vas a poder probar funcionalidades nuevas antes que salgan.',
    donationAfterRatingBenefitSemiannualReport:
        '<strong>Informe semestral:</strong> cada 6 meses te vamos a mandar un mail contándote lo que logramos gracias a tu aporte.',
    donationAfterRatingBenefitBadge:
        '<strong>Pin:</strong> tu perfil tendrá una insignia y vas a aparecer en una lista de personas que forman parte del Club Carpoolear (si así lo querés).',
    donationAfterRatingMonthlyAmountIntro:
        'Puedo <strong>aportar cada mes</strong> con el equivalente a...',
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
        'sumándote al voluntariado'
};

const EN_COPY = {
    donationAfterRatingHeroTitlePrimary:
        'Your contribution',
    donationAfterRatingHeroTitleAccent:
        'is essential',
    donationAfterRatingMissionLead:
        ' We want to keep being Argentina\'s best carpooling community.',
    donationAfterRatingMissionOrg:
        'Carpoolear is a collaborative non-profit project of the <strong>NGO STS Rosario</strong>.',
    donationAfterRatingMissionBody:
        'On the road since 2013, today it is the largest carpooling community in Argentina, with more than 450,000 people and more than 1,500 trips a month. It takes a lot of work, and volunteering alone is no longer enough. That\'s why your contribution matters: it lets us keep maintaining and improving Carpoolear the way we have been doing since we left the “Zona de derrumbe” in 2025.',
    donationAfterRatingJoinPrefix:
        'Join the',
    donationAfterRatingJoinAccent:
        'Carpoolear Club',
    donationAfterRatingMonthlyBenefitsIntro:
        'With your <strong>monthly contribution</strong> we can keep going and keep improving, and in return you get the following benefits for being part of it:',
    donationAfterRatingBenefitPrioritySupport:
        '<strong>Priority support:</strong> your Help Desk tickets will get priority.',
    donationAfterRatingBenefitEarlyAccess:
        '<strong>Early access:</strong> you\'ll be able to try new features before they are released.',
    donationAfterRatingBenefitSemiannualReport:
        '<strong>Semiannual report:</strong> every 6 months we\'ll email you about what we achieved thanks to your contribution.',
    donationAfterRatingBenefitBadge:
        '<strong>Pin:</strong> your profile will have a badge and you\'ll appear on a list of people who are part of the Carpoolear Club (if you want).',
    donationAfterRatingMonthlyAmountIntro:
        'I can <strong>contribute each month</strong> with the equivalent of...',
    donationAfterRatingJoinCommunityMonthly:
        'I want to be part of the Carpoolear Club',
    donationAfterRatingJoinCommunityMonthlyHint:
        'cancel anytime',
    donationAfterRatingOnceIntro:
        'Can\'t commit to contributing every month? You can do it once:',
    donationAfterRatingOnceCta:
        'I want to contribute once',
    donationAfterRatingVolunteerParagraph:
        'Not in a position to contribute financially? Do you simply like getting your hands dirty? You can contribute your time by {link}; we always need a hand in the different areas of the project.',
    donationAfterRatingVolunteerLink:
        'joining our volunteers'
};

describe('donation after rating copy document', () => {
    it.each(['arg', 'chl'])('uses the copy document texts in %s', (locale) => {
        Object.keys(ES_COPY).forEach((key) => {
            expect(messages[locale][key], key).toBe(ES_COPY[key]);
        });
    });

    it('uses the translated copy document texts in en', () => {
        Object.keys(EN_COPY).forEach((key) => {
            expect(messages.en[key], key).toBe(EN_COPY[key]);
        });
    });
});
