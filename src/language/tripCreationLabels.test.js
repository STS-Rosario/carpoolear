import { describe, expect, it } from 'vitest';
import messages from './i18n';

const KEYS = [
    'tripCreationTitleDriver',
    'tripCreationTitlePassenger',
    'tripCreationStepRoleQuestion',
    'tripCreationStepRoleSubtitle',
    'tripCreationRoleDriverTitle',
    'tripCreationRoleDriverDescription',
    'tripCreationRolePassengerTitle',
    'tripCreationRolePassengerDescription',
    'tripCreationWantsIntermediateStops',
    'tripCreationStepStopsQuestion',
    'tripCreationAddStop',
    'tripCreationStepOriginQuestion',
    'tripCreationStepDestinationQuestion',
    'tripCreationStepScheduleQuestion',
    'tripCreationStepCarQuestion',
    'tripCreationStepSeatsQuestion',
    'tripCreationStepDescriptionQuestion',
    'tripCreationStepLastDetailsTitle',
    'tripCreationStepLabelRole',
    'tripCreationStepLabelStops',
    'tripCreationStepLabelOrigin',
    'tripCreationStepLabelDestination',
    'tripCreationStepLabelSchedule',
    'tripCreationStepLabelCar',
    'tripCreationStepLabelSeats',
    'tripCreationStepLabelDescription',
    'tripCreationStepLabelLastDetails',
    'tripCreationSuccessTitle',
    'tripCreationSuccessAllSet',
    'tripCreationSuccessSharePrompt',
    'tripCreationShareTrip',
    'tripShareMessage',
    'tripCreationViewTrip',
    'tripCreationSaveTemplate',
    'tripCreationSaveTemplateTitle',
    'tripCreationSaveTemplateBody',
    'tripCreationTemplateNameLabel',
    'tripCreationTemplateSaved',
    'tripCreationUseTemplate',
    'tripCreationChooseTemplateTitle',
    'tripCreationRouteDetails',
    'tripCreationTotalPeopleLabel',
    'tripCreationIncompleteTitle',
    'tripCreationIncompleteBody',
    'eliminar'
];

describe('trip creation labels (i18n)', () => {
    it.each(['arg', 'chl', 'en'])('%s locale has trip creation wizard keys', (locale) => {
        KEYS.forEach((key) => {
            expect(messages[locale][key]).toBeTruthy();
        });
    });
});
