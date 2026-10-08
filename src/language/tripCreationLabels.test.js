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
    'tripCreationStepCarSubtitle',
    'tripCreationAddVehicle',
    'tripSeatLayoutPrompt',
    'tripSeatLayoutTip',
    'tripSeatLayoutFour',
    'tripSeatLayoutFive',
    'tripSeatLayoutRequired',
    'tripCreationStepSeatsQuestion',
    'tripSeatMapSubtitle',
    'tripSeatMapDriver',
    'tripSeatMapDriverRole',
    'tripSeatMapFront',
    'tripSeatMapRear1',
    'tripSeatMapRear2',
    'tripSeatMapRear3',
    'tripSeatMapAvailable',
    'tripSeatMapUnavailable',
    'tripSeatMapOffering',
    'tripSeatMapOfferAtLeastOne',
    'tripSeatMapHint',
    'tripCreationStepContributionQuestion',
    'tripCreationStepContributionSubtitle',
    'tripCreationStepLabelContribution',
    'tripContributionPerPerson',
    'tripContributionSuggested',
    'tripContributionHowCalculated',
    'tripContributionImportantTitle',
    'tripContributionImportantBody',
    'meComprometoNoCobrarSena',
    'teComprometesANoCobrarSena',
    'tripCreationStepDescriptionQuestion',
    'tripCreationStepLastDetailsTitle',
    'tripCreationStepLastDetailsSubtitle',
    'tripPrefToggleKids',
    'tripPrefToggleSmoking',
    'tripPrefTogglePets',
    'tripPrefFriendsSection',
    'tripPrefFriendsTitle',
    'tripPrefFriendsHelper',
    'tripPrefCommentsSection',
    'tripReviewEdit',
    'tripReviewSectionRoute',
    'tripReviewSectionVehicle',
    'tripReviewSectionSeats',
    'tripReviewSectionContribution',
    'tripReviewSectionPreferences',
    'tripReviewSeatsCount',
    'tripReviewContributionPerPerson',
    'tripReviewPrefKids',
    'tripReviewPrefSmoking',
    'tripReviewPrefPets',
    'tripReviewYes',
    'tripReviewNo',
    'tripReviewNoLucrarLead',
    'tripReviewMoreInfo',
    'tripReviewNoLucrarModalTitle',
    'tripReviewNoLucrarModalBody',
    'tripCreationPublish',
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
    'tripCreationShareTrip',
    'tripShareMessage',
    'tripCreationViewTrip',
    'tripCreationSaveTemplate',
    'tripCreationSaveTemplateTitle',
    'tripCreationSaveTemplateBody',
    'tripCreationTemplateNameLabel',
    'tripCreationTemplateSaved',
    'tripCreationUseTemplate',
    'tripCreationOr',
    'tripCreationChooseTemplateTitle',
    'tripCreationChooseTemplatePlaceholder',
    'tripCreationReplaceTemplateLabel',
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

    it('uses the no-deposit commitment copy on the contribution step', () => {
        ['arg', 'chl'].forEach((locale) => {
            expect(messages[locale].meComprometoNoCobrarSena).toBe(
                'Me comprometo a no cobrar seña a los pasajeros'
            );
            expect(messages[locale].teComprometesANoCobrarSena).toBe(
                'Debes indicar que te comprometes a no cobrar seña a los pasajeros.'
            );
        });
    });
});
