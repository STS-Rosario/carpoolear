import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripInviteFriends.vue');
const tripViewPath = path.resolve(__dirname, '../views/Trip.vue');
const newTripViewPath = path.resolve(__dirname, '../views/NewTrip.vue');
const tripsApiPath = path.resolve(__dirname, '../../services/api/Trips.js');

const componentSource = fs.readFileSync(componentPath, 'utf8');
const tripViewSource = fs.readFileSync(tripViewPath, 'utf8');
const newTripViewSource = fs.readFileSync(newTripViewPath, 'utf8');
const tripsApiSource = fs.readFileSync(tripsApiPath, 'utf8');

describe('TripApi invite friends', () => {
    it('targets invite-friends endpoint with friend_ids payload', () => {
        expect(tripsApiSource).toContain('inviteFriends');
        expect(tripsApiSource).toContain('/invite-friends');
        expect(tripsApiSource).toContain('friend_ids');
    });
});

describe('TripInviteFriends.vue', () => {
    it('lists friends with checkboxes and master invite-all toggle', () => {
        expect(componentSource).toContain("$t('invitarAmigosAlViaje')");
        expect(componentSource).toContain("$t('invitarATodosMisAmigos')");
        expect(componentSource).toContain("$t('noVolverAMostrarInvitarAmigos')");
        expect(componentSource).toContain('v-for="friend in friends"');
        expect(componentSource).toContain('selectedFriendIds');
        expect(componentSource).toContain('inviteAllFriends');
    });

    it('submits selected friends through TripApi inviteFriends', () => {
        expect(componentSource).toContain('inviteFriends');
        expect(componentSource).toContain('onSubmit');
    });

    it('persists dismiss preference in localStorage per trip', () => {
        expect(componentSource).toContain('dismiss_trip_invite_');
        expect(componentSource).toContain('dontShowAgain');
    });
});

describe('Trip.vue TripInviteFriends integration', () => {
    it('shows invite friends panel for trip owner when query or first visit', () => {
        expect(tripViewSource).toContain('TripInviteFriends');
        expect(tripViewSource).toContain('showTripInviteFriends');
        expect(tripViewSource).toContain('inviteFriends');
        expect(tripViewSource).toContain('dismiss_trip_invite_');
    });
});

describe('NewTrip.vue post-create invite friends redirect', () => {
    it('redirects to trip detail with inviteFriends query after create', () => {
        expect(newTripViewSource).toMatch(
            /name:\s*'detail_trip'[\s\S]*?inviteFriends:\s*'1'/s
        );
    });
});
