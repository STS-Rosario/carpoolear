import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripInviteFriends.vue');
const tripViewPath = path.resolve(__dirname, '../views/Trip.vue');
const tripSeatsPath = path.resolve(__dirname, '../elements/TripSeats.vue');
const newTripViewPath = path.resolve(__dirname, '../views/NewTrip.vue');
const tripsApiPath = path.resolve(__dirname, '../../services/api/Trips.js');
const isUpcomingTripPath = path.resolve(
    __dirname,
    '../../utils/isUpcomingTrip.js'
);

const componentSource = fs.readFileSync(componentPath, 'utf8');
const tripViewSource = fs.readFileSync(tripViewPath, 'utf8');
const tripSeatsSource = fs.readFileSync(tripSeatsPath, 'utf8');
const newTripViewSource = fs.readFileSync(newTripViewPath, 'utf8');
const tripsApiSource = fs.readFileSync(tripsApiPath, 'utf8');
const isUpcomingTripSource = fs.readFileSync(isUpcomingTripPath, 'utf8');

describe('TripApi invite friends', () => {
    it('targets invite-friends endpoint with friend_ids payload', () => {
        expect(tripsApiSource).toContain('inviteFriends');
        expect(tripsApiSource).toContain('/invite-friends');
        expect(tripsApiSource).toContain('friend_ids');
    });
});

describe('isUpcomingTrip', () => {
    it('mirrors backend expired rules for weekly schedule and trip_date', () => {
        expect(isUpcomingTripSource).toContain('weekly_schedule');
        expect(isUpcomingTripSource).toContain('trip_date');
    });
});

describe('TripInviteFriends.vue', () => {
    it('lists friends with checkboxes and master invite-all toggle', () => {
        expect(componentSource).toContain("$t('invitarATodosMisAmigos')");
        expect(componentSource).toContain('v-for="friend in friends"');
        expect(componentSource).toContain('selectedFriendIds');
        expect(componentSource).toContain('inviteAllFriends');
    });

    it('submits selected friends through TripApi inviteFriends', () => {
        expect(componentSource).toContain('inviteFriends');
        expect(componentSource).toContain('onSubmit');
    });

    it('emits close instead of persisting dismiss preference', () => {
        expect(componentSource).toContain("emits: ['close']");
        expect(componentSource).toContain('resolveTripInviteFriendsClose');
        expect(componentSource).toContain('dismiss()');
        expect(componentSource).not.toContain('dismiss_trip_invite_');
        expect(componentSource).not.toContain('noVolverAMostrarInvitarAmigos');
    });

    it('supports modal emit close and success-screen trip detail navigation', () => {
        expect(componentSource).toContain('closeBehavior');
        expect(componentSource).toContain('TRIP_INVITE_FRIENDS_CLOSE_BEHAVIOR');
        expect(componentSource).toContain('resolveTripInviteFriendsClose');
        expect(componentSource).toContain('v-if="showPrompt"');
    });
});

describe('Trip.vue TripInviteFriends integration', () => {
    it('does not render invite friends UI directly in Trip.vue', () => {
        expect(tripViewSource).not.toContain('canInviteFriendsToTrip');
        expect(tripViewSource).not.toContain('showInviteFriendsModal');
        expect(tripViewSource).not.toContain("$t('invitarAmigosAlViaje')");
    });
});

describe('TripSeats.vue TripInviteFriends integration', () => {
    it('shows invite button and modal below available seats for upcoming owner trips', () => {
        expect(tripSeatsSource).toContain('canInviteFriendsToTrip');
        expect(tripSeatsSource).toContain('isUpcomingTrip');
        expect(tripSeatsSource).toContain('showInviteFriendsModal');
        expect(tripSeatsSource).toContain("$t('invitarAmigosAlViaje')");
        expect(tripSeatsSource).toContain('maybeOpenInviteFriendsFromQuery');
        expect(tripSeatsSource).toMatch(
            /trip-seats__availability[\s\S]*?trip-invite-friends-trigger/
        );
    });

    it('auto-opens invite modal only from inviteFriends query param', () => {
        expect(tripSeatsSource).toContain("query.inviteFriends !== '1'");
        expect(tripSeatsSource).toContain('delete nextQuery.inviteFriends');
    });

    it('closes invite modal through TripInviteFriends close emit', () => {
        expect(tripSeatsSource).toContain('@close="onInviteFriendsModalClose"');
        expect(tripSeatsSource).not.toContain('close-behavior="trip-detail"');
    });
});

describe('NewTrip.vue post-create success flow', () => {
    it('shows embedded invite friends on the trip creation success screen', () => {
        expect(newTripViewSource).toContain('TripCreationSuccess');
        expect(newTripViewSource).toContain('showWizardSuccess');
        expect(newTripViewSource).toContain('clearTripCreationDraft');
        expect(newTripViewSource).toContain('viajeYaPublicado');
    });
});
