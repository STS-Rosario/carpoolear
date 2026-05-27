import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import TicketsApi from './TicketsApi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiSource = fs.readFileSync(path.resolve(__dirname, 'TicketsApi.js'), 'utf8');

describe('TicketsApi admin ticket actions', () => {
    it('targets needs-review endpoint', () => {
        expect(apiSource).toContain('/needs-review');
        expect(apiSource).toContain('adminMarkNeedsReview');
    });
});

describe('TicketsApi admin reply templates', () => {
    it('targets reply-templates endpoints', () => {
        expect(apiSource).toContain('/api/admin/support/reply-templates');
        expect(apiSource).toContain('/duplicate');
    });
});

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
