import { describe, expect, it } from 'vitest';
import {
    hasUnusedQualifyingSeatRequestMessage,
    seatRequestRequiresNewMessage
} from './seatRequestMessage.js';

const tripCreatedAt = '2026-11-01 12:00:00';

function message(overrides = {}) {
    return {
        id: 1,
        user_id: 10,
        text: 'Hola, me sumo',
        created_at: '2026-11-01 12:05:00',
        is_system: false,
        used_for_seat_request: false,
        ...overrides
    };
}

describe('hasUnusedQualifyingSeatRequestMessage', () => {
    it('accepts a passenger message written after the trip was created', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message()],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(true);
    });

    it('rejects an empty thread', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('rejects messages from the driver', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message({ user_id: 99 })],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('rejects system messages', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message({ is_system: true })],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('rejects messages already used for a seat request', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message({ used_for_seat_request: true })],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('rejects messages written before the trip exists', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message({ created_at: '2026-10-31 09:00:00' })],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('rejects blank passenger messages', () => {
        expect(
            hasUnusedQualifyingSeatRequestMessage({
                messages: [message({ text: '   ' })],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });
});

describe('seatRequestRequiresNewMessage', () => {
    it('does not require a message when coordinate-by-message is off', () => {
        expect(
            seatRequestRequiresNewMessage({
                moduleCoordinateByMessage: false,
                alreadyRequested: false,
                messages: [],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('does not require a message after the seat was already requested', () => {
        expect(
            seatRequestRequiresNewMessage({
                moduleCoordinateByMessage: true,
                alreadyRequested: true,
                messages: [],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });

    it('requires a message when the module is on and none qualifies', () => {
        expect(
            seatRequestRequiresNewMessage({
                moduleCoordinateByMessage: true,
                alreadyRequested: false,
                messages: [],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(true);
    });

    it('does not require a message when a qualifying one exists', () => {
        expect(
            seatRequestRequiresNewMessage({
                moduleCoordinateByMessage: true,
                alreadyRequested: false,
                messages: [message()],
                userId: 10,
                tripCreatedAt
            })
        ).toBe(false);
    });
});
