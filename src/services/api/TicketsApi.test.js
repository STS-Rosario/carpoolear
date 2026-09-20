import { describe, it, expect } from 'vitest';
import TicketsApi from './TicketsApi';

describe('TicketsApi.toFormData', () => {
    it('limits attachments to three files', () => {
        const api = new TicketsApi();
        const files = [
            new File(['a'], 'a.png', { type: 'image/png' }),
            new File(['b'], 'b.png', { type: 'image/png' }),
            new File(['c'], 'c.png', { type: 'image/png' }),
            new File(['d'], 'd.png', { type: 'image/png' })
        ];

        const form = api.toFormData({
            subject: 'hello',
            attachments: files
        });

        expect(form.get('subject')).toBe('hello');
        expect(form.getAll('attachments[]')).toHaveLength(3);
    });
});
