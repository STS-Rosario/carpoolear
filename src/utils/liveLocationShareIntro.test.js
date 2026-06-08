import { describe, expect, it } from 'vitest';
import { getLiveLocationShareIntroKey } from './liveLocationShareIntro.js';

describe('liveLocationShareIntro', () => {
    it('returns driver intro key for trip owner', () => {
        expect(getLiveLocationShareIntroKey({ user: { id: 1 } }, 1)).toBe(
            'liveLocationShareIntroDriver'
        );
    });

    it('returns passenger intro key for non-owner participant', () => {
        expect(getLiveLocationShareIntroKey({ user: { id: 1 } }, 2)).toBe(
            'liveLocationShareIntroPassenger'
        );
    });

    it('returns null when trip or user is missing', () => {
        expect(getLiveLocationShareIntroKey(null, 1)).toBeNull();
        expect(getLiveLocationShareIntroKey({ user: { id: 1 } }, null)).toBeNull();
    });
});
