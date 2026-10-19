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

    it('keeps the invite-all checkbox in normal flow so the box is not cropped', () => {
        expect(componentSource).not.toMatch(
            /class="checkbox"[\s\S]*invitarATodosMisAmigos/
        );
        expect(componentSource).toMatch(
            /trip-invite-friends__friend[\s\S]*invitarATodosMisAmigos/
        );
        expect(componentSource).toMatch(
            /\.trip-invite-friends__list input\[type="checkbox"\]\s*\{[^}]*position:\s*static/s
        );
        expect(componentSource).toMatch(
            /\.trip-invite-friends__list\s*\{[^}]*overflow:\s*visible/s
        );
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
    it('does not keep invite friends on seats after trip-detail redesign', () => {
        expect(tripSeatsSource).not.toContain('canInviteFriendsToTrip');
        expect(tripSeatsSource).not.toContain('showInviteFriendsModal');
        expect(tripSeatsSource).not.toContain("$t('invitarAmigosAlViaje')");
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
