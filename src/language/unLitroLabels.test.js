import { describe, expect, it } from 'vitest';
import messages from './i18n';

const KEYS = {
    unLitroName: 'Un litro para Carpoolear',
    unLitroWhatIsThis: '¿Qué es esto?',
    unLitroAppliesTitle: 'Este viaje suma Un litro para Carpoolear',
    unLitroAppliesBody:
        'Es 1 litro de nafta que ayuda a mantener la plataforma, la mesa de ayuda y las mejoras. Lo pagás vos al publicar y ya está incluido en el aporte por persona, así que se reparte entre todos los que viajan.',
    unLitroBonificadoBadge: 'Bonificado',
    unLitroBonificadoTitle: 'Este viaje es bonificado',
    unLitroBonificadoRemainingSingular:
        'Te queda {remaining} viaje sin Un litro para Carpoolear. Después se suma 1 litro al costo del viaje.',
    unLitroBonificadoRemainingPlural:
        'Te quedan {remaining} viajes sin Un litro para Carpoolear. Después se suma 1 litro al costo del viaje.',
    unLitroModalTitle: '¿Qué es Un litro para Carpoolear?',
    unLitroModalBody1:
        'Carpoolear es un proyecto sin fines de lucro que se sostiene con trabajo voluntario. En algunos trayectos (por ahora Rosario ↔ Buenos Aires), al crear un viaje se suma 1 litro de nafta a los gastos, y ese litro va para Carpoolear.',
    unLitroModalBody2:
        'Ese litro ayuda a mantener la plataforma, la mesa de ayuda y las mejoras.',
    unLitroModalBody3:
        'Lo paga quien conduce al publicar el viaje, y se reparte entre todos los que viajan, como si fuera un peaje.',
    unLitroModalBody4:
        'Tenés {freeTrips} viajes bonificados para probar la plataforma. Después, cada viaje en estos trayectos suma el litro.',
    unLitroReviewIncludes:
        'Contribución por persona · incluye Un litro para Carpoolear',
    unLitroReviewPaidCaption:
        'Lo pagás al publicar. Ya está incluido en los {amount} por persona.',
    unLitroSectionTitle: 'Un litro para Carpoolear',
    tripCreationContinueToPayment: 'Continuar al pago',
    tripCreationStepLastDetailsSubtitleBeforePayment:
        'Antes de continuar, chequeá que esté todo bien.',
    unLitroPublishTitle: 'Publicá tu viaje',
    unLitroPendingPaymentBadge: 'Pendiente de pago',
    unLitroTripCreatedHidden:
        'Tu viaje ya está creado, pero solo lo ves vos. Se publica apenas se acredite el pago.',
    unLitroChooseHowToPay: 'Elegí cómo pagar',
    unLitroPayMercadoPago: 'Mercado Pago',
    unLitroPayMercadoPagoHint: 'Con tu cuenta o tarjeta',
    unLitroPayQr: 'Código QR',
    unLitroPayQrHint: 'Escanealo desde tu app de pagos',
    unLitroPayOneLiter: 'Pagar 1L para Carpoolear',
    unLitroPayLater: 'Pagar después',
    unLitroBannerPending:
        'Tu viaje todavía no es visible. Pagá Un litro para Carpoolear para publicarlo.',
    unLitroBannerPayAmount: 'Pagar {amount}',
    unLitroBannerRapipago:
        'Tu viaje se publica cuando pagues en RapiPago. Te avisamos apenas se acredite.',
    unLitroBannerRapipagoAction: 'Ver código',
    unLitroBannerFailed:
        'No pudimos procesar el pago. Tu viaje sigue sin publicarse. Probá de nuevo.',
    unLitroBannerRetry: 'Reintentar',
    unLitroBannerPublished:
        'Pago acreditado. Tu viaje ya es visible para toda la comunidad. Gracias por sumar Un litro para Carpoolear.',
    tripContributionBreakdownFuel: 'Combustible',
    tripContributionBreakdownTollsLabel: 'Peajes',
    tripContributionBreakdownTripTotal: 'Total del viaje',
    tripContributionBreakdownOccupantsSplit:
        'Entre {count} personas (vos incluido)',
    tripContributionBreakdownPerPersonLabel: 'Por persona',
    tripContributionHowCalculatedExplainer:
        'La contribución sugerida se calcula en función del recorrido, los peajes, Un litro para Carpoolear y el consumo de combustible, tomando como referencia un vehículo promedio con un consumo de 8 L cada 100 km en ruta.',
    tripContributionHowCalculatedExplainerWithoutUnLitro:
        'La contribución sugerida se calcula en función del recorrido, los peajes y el consumo de combustible, tomando como referencia un vehículo promedio con un consumo de 8 L cada 100 km en ruta.',
    tripContributionTankTip:
        'Si tenés dudas sobre el consumo real de tu vehículo, la forma más precisa de calcularlo es llenar el tanque antes de salir y volver a llenarlo al llegar: la diferencia entre ambas cargas corresponde al combustible utilizado durante el viaje.'
};

const EN_KEYS = {
    unLitroName: 'One liter for Carpoolear',
    unLitroWhatIsThis: 'What is this?',
    unLitroAppliesTitle: 'This trip adds One liter for Carpoolear',
    unLitroAppliesBody:
        'It is 1 liter of fuel that helps keep the platform, the help desk and improvements running. You pay it when publishing and it is already included in the per-person contribution, so it is split among everyone traveling.',
    unLitroBonificadoBadge: 'Waived',
    unLitroBonificadoTitle: 'This trip is waived',
    unLitroBonificadoRemainingSingular:
        'You have {remaining} trip left without One liter for Carpoolear. After that, 1 liter is added to the trip cost.',
    unLitroBonificadoRemainingPlural:
        'You have {remaining} trips left without One liter for Carpoolear. After that, 1 liter is added to the trip cost.',
    unLitroModalTitle: 'What is One liter for Carpoolear?',
    unLitroModalBody1:
        'Carpoolear is a non-profit project sustained by volunteer work. On some routes (for now Rosario ↔ Buenos Aires), creating a trip adds 1 liter of fuel to the expenses, and that liter goes to Carpoolear.',
    unLitroModalBody2:
        'That liter helps keep the platform, the help desk and improvements running.',
    unLitroModalBody3:
        'The driver pays it when publishing the trip, and it is split among everyone traveling, as if it were a toll.',
    unLitroModalBody4:
        'You have {freeTrips} waived trips to try the platform. After that, each trip on these routes adds the liter.',
    unLitroReviewIncludes:
        'Contribution per person · includes One liter for Carpoolear',
    unLitroReviewPaidCaption:
        'You pay it when publishing. It is already included in the {amount} per person.',
    unLitroSectionTitle: 'One liter for Carpoolear',
    tripCreationContinueToPayment: 'Continue to payment',
    tripCreationStepLastDetailsSubtitleBeforePayment:
        'Before continuing, check that everything looks good.',
    unLitroPublishTitle: 'Publish your trip',
    unLitroPendingPaymentBadge: 'Pending payment',
    unLitroTripCreatedHidden:
        'Your trip is already created, but only you can see it. It is published as soon as payment is confirmed.',
    unLitroChooseHowToPay: 'Choose how to pay',
    unLitroPayMercadoPago: 'Mercado Pago',
    unLitroPayMercadoPagoHint: 'With your account or card',
    unLitroPayQr: 'QR code',
    unLitroPayQrHint: 'Scan it from your payments app',
    unLitroPayOneLiter: 'Pay 1L for Carpoolear',
    unLitroPayLater: 'Pay later',
    unLitroBannerPending:
        'Your trip is not visible yet. Pay One liter for Carpoolear to publish it.',
    unLitroBannerPayAmount: 'Pay {amount}',
    unLitroBannerRapipago:
        'Your trip will be published when you pay at RapiPago. We will notify you as soon as it is confirmed.',
    unLitroBannerRapipagoAction: 'View code',
    unLitroBannerFailed:
        'We could not process the payment. Your trip is still unpublished. Try again.',
    unLitroBannerRetry: 'Retry',
    unLitroBannerPublished:
        'Payment confirmed. Your trip is now visible to the whole community. Thanks for adding One liter for Carpoolear.',
    tripContributionBreakdownFuel: 'Fuel',
    tripContributionBreakdownTollsLabel: 'Tolls',
    tripContributionBreakdownTripTotal: 'Trip total',
    tripContributionBreakdownOccupantsSplit:
        'Among {count} people (you included)',
    tripContributionBreakdownPerPersonLabel: 'Per person',
    tripContributionHowCalculatedExplainer:
        'The suggested contribution is calculated from the route, tolls, One liter for Carpoolear and fuel consumption, using an average vehicle that uses 8 L every 100 km on the highway.',
    tripContributionHowCalculatedExplainerWithoutUnLitro:
        'The suggested contribution is calculated from the route, tolls and fuel consumption, using an average vehicle that uses 8 L every 100 km on the highway.',
    tripContributionTankTip:
        'If you are unsure about your vehicle’s real consumption, the most accurate way to calculate it is to fill the tank before leaving and fill it again on arrival: the difference between both fills is the fuel used during the trip.'
};

describe('Un litro para Carpoolear copy', () => {
    it.each(['arg', 'chl'])('%s locale has Un litro screenshots copy', (locale) => {
        Object.entries(KEYS).forEach(([key, value]) => {
            expect(messages[locale][key]).toBe(value);
        });
    });

    it('en locale has Un litro screenshots copy', () => {
        Object.entries(EN_KEYS).forEach(([key, value]) => {
            expect(messages.en[key]).toBe(value);
        });
    });

    it('uses suggested contribution wording in Spanish locales', () => {
        expect(messages.arg.tripContributionSuggested).toBe(
            'Contribución sugerida: $ {amount}'
        );
        expect(messages.arg.tripContributionHowCalculated).toBe(
            '¿Cómo se calcula la contribución sugerida?'
        );
        expect(messages.chl.tripContributionSuggested).toBe(
            'Contribución sugerida: $ {amount}'
        );
    });
});
