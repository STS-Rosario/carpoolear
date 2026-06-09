import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripInviteFriends.vue');
const tripViewPath = path.resolve(__dirname, '../views/Trip.vue');
const newTripViewPath = path.resolve(__dirname, '../views/NewTrip.vue');
const tripsApiPath = path.resolve(__dirname, '../../services/api/Trips.js');
const isUpcomingTripPath = path.resolve(
    __dirname,
    '../../utils/isUpcomingTrip.js'
);

const componentSource = fs.readFileSync(componentPath, 'utf8');
const tripViewSource = fs.readFileSync(tripViewPath, 'utf8');
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
        expect(componentSource).toContain("$emit('close')");
        expect(componentSource).not.toContain('dismiss_trip_invite_');
        expect(componentSource).not.toContain('noVolverAMostrarInvitarAmigos');
    });
});

describe('Trip.vue TripInviteFriends integration', () => {
    it('shows invite button and modal only for upcoming owner trips', () => {
        expect(tripViewSource).toContain('canInviteFriendsToTrip');
        expect(tripViewSource).toContain('isUpcomingTrip');
        expect(tripViewSource).toContain('showInviteFriendsModal');
        expect(tripViewSource).toContain("$t('invitarAmigosAlViaje')");
        expect(tripViewSource).toContain('maybeOpenInviteFriendsFromQuery');
        expect(tripViewSource).not.toContain('showTripInviteFriends');
        expect(tripViewSource).not.toContain('dismiss_trip_invite_');
    });

    it('auto-opens invite modal only from inviteFriends query param', () => {
        expect(tripViewSource).toContain("query.inviteFriends !== '1'");
        expect(tripViewSource).toContain('delete nextQuery.inviteFriends');
    });
});

describe('NewTrip.vue post-create invite friends redirect', () => {
    it('redirects to trip detail with inviteFriends query after create', () => {
        expect(newTripViewSource).toMatch(
            /name:\s*'detail_trip'[\s\S]*?inviteFriends:\s*'1'/s
        );
    });
});
