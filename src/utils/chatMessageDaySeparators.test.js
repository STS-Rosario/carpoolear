import { describe, expect, it } from 'vitest';
import { buildMessagesWithDaySeparators } from './chatMessageDaySeparators';
import dayjs from '../dayjs';

describe('buildMessagesWithDaySeparators', () => {
    const t = (key) =>
        ({
            mensajeDiaHoy: 'Hoy',
            mensajeDiaAyer: 'Ayer'
        })[key] || key;

    it('inserts Hoy before messages from today', () => {
        const now = dayjs('2026-07-31T15:00:00');
        const messages = [
            { id: 1, created_at: '2026-07-31T10:00:00' },
            { id: 2, created_at: '2026-07-31T11:00:00' }
        ];
        const items = buildMessagesWithDaySeparators(messages, t, now);
        expect(items[0]).toEqual({
            type: 'day',
            key: 'day-2026-07-31',
            label: 'Hoy'
        });
        expect(items.filter((i) => i.type === 'message')).toHaveLength(2);
    });

    it('inserts a new separator when the calendar day changes', () => {
        const now = dayjs('2026-07-31T15:00:00');
        const messages = [
            { id: 1, created_at: '2026-07-30T10:00:00' },
            { id: 2, created_at: '2026-07-31T11:00:00' }
        ];
        const items = buildMessagesWithDaySeparators(messages, t, now);
        expect(items.filter((i) => i.type === 'day').map((i) => i.label)).toEqual([
            'Ayer',
            'Hoy'
        ]);
    });
});
