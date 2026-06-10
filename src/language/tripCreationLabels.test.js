import { describe, expect, it } from 'vitest';
import messages from './i18n';

const KEYS = [
    'tripCreationTitleDriver',
    'tripCreationTitlePassenger',
    'tripCreationStepOriginQuestion',
    'tripCreationStepDestinationQuestion',
    'tripCreationStepScheduleQuestion',
    'tripCreationStepCarQuestion',
    'tripCreationStepSeatsQuestion',
    'tripCreationStepDescriptionQuestion',
    'tripCreationStepLastDetailsTitle',
    'tripCreationSuccessTitle',
    'tripCreationSuccessAllSet',
    'tripCreationSuccessSharePrompt',
    'tripCreationShareTrip',
    'tripCreationViewTrip',
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
