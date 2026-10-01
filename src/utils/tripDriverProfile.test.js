import { describe, expect, it } from 'vitest';
import {
    getTripDriverImage,
    getTripDriverProfileId
} from './tripDriverProfile.js';

const driver = { id: 10, image: 'driver.jpg' };
const trip = { user: driver };
const authUser = { id: 10, image: 'me.jpg' };
const otherUser = { id: 99, image: 'other.jpg' };

describe('getTripDriverProfileId', () => {
    it('returns null when the trip has no driver', () => {
        expect(getTripDriverProfileId(null, authUser)).toBe(null);
        expect(getTripDriverProfileId({}, authUser)).toBe(null);
    });

    it('returns the driver id when the auth user is missing', () => {
        expect(getTripDriverProfileId(trip, null)).toBe(10);
        expect(getTripDriverProfileId(trip, {})).toBe(10);
    });

    it('returns me when the auth user is the driver', () => {
        expect(getTripDriverProfileId(trip, authUser)).toBe('me');
    });

    it('returns the driver id when the auth user is someone else', () => {
        expect(getTripDriverProfileId(trip, otherUser)).toBe(10);
    });
});

describe('getTripDriverImage', () => {
    it('returns an empty string when the trip has no driver', () => {
        expect(getTripDriverImage(null, authUser)).toBe('');
        expect(getTripDriverImage({}, authUser)).toBe('');
    });

    it('returns the driver image when the auth user is missing', () => {
        expect(getTripDriverImage(trip, null)).toBe('driver.jpg');
        expect(getTripDriverImage(trip, {})).toBe('driver.jpg');
    });

    it('returns the auth user image when they are the driver', () => {
        expect(getTripDriverImage(trip, authUser)).toBe('me.jpg');
    });

    it('returns the driver image when the auth user is someone else', () => {
        expect(getTripDriverImage(trip, otherUser)).toBe('driver.jpg');
    });
});
