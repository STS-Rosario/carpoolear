import { describe, expect, it } from 'vitest';
import {
    extractFirstName,
    formatSpanishNameList,
    getAcceptedCoPassengerFirstNames,
    isAcceptedPassengerOnTrip
} from './tripCoPassengers.js';

describe('tripCoPassengers', () => {
    describe('extractFirstName', () => {
        it('returns the first word of a full name', () => {
            expect(extractFirstName('Gonzalo González')).toBe('Gonzalo');
        });

        it('returns the trimmed name when there is only one word', () => {
            expect(extractFirstName('  María  ')).toBe('María');
        });
    });

    describe('formatSpanishNameList', () => {
        it('joins two names with "y"', () => {
            expect(formatSpanishNameList(['Ana', 'Pedro'])).toBe('Ana y Pedro');
        });

        it('joins three or more names with commas and a final "y"', () => {
            expect(formatSpanishNameList(['Ana', 'Pedro', 'Luis'])).toBe(
                'Ana, Pedro y Luis'
            );
        });
    });

    describe('getAcceptedCoPassengerFirstNames', () => {
        it('returns first names for accepted passengers excluding the current user', () => {
            const names = getAcceptedCoPassengerFirstNames(
                [
                    {
                        user_id: 10,
                        request_state: 1,
                        name: 'Gonzalo González'
                    },
                    {
                        user_id: 11,
                        request_state: 1,
                        user: { name: 'María López' }
                    },
                    {
                        user_id: 12,
                        request_state: 0,
                        name: 'Pending Rider'
                    }
                ],
                10
            );

            expect(names).toEqual(['María']);
        });
    });

    describe('isAcceptedPassengerOnTrip', () => {
        it('is true when the current user has an accepted request', () => {
            expect(
                isAcceptedPassengerOnTrip(
                    [{ user_id: 5, request_state: 1 }],
                    5
                )
            ).toBe(true);
        });

        it('is false for pending or payment-pending requests', () => {
            expect(
                isAcceptedPassengerOnTrip(
                    [{ user_id: 5, request_state: 4 }],
                    5
                )
            ).toBe(false);
        });
    });
});
