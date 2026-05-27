import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserRecommendations.vue');
const cardPath = path.resolve(__dirname, '../elements/AdminReferenceCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const cardSource = fs.readFileSync(cardPath, 'utf8');

describe('AdminUserRecommendations view', () => {
    it('lists references_data and saves via AdminApi.updateReference', () => {
        expect(viewSource).toContain('AdminLayout');
        expect(viewSource).toContain('references_data');
        expect(viewSource).toContain('updateReference');
        expect(viewSource).toContain('AdminReferenceCard');
    });
});

describe('AdminReferenceCard', () => {
    it('shows reference id, author link, comment, and edit on one row', () => {
        expect(cardSource).toContain('admin-reference-card__row');
        expect(cardSource).toContain('admin-reference-card__id');
        expect(cardSource).toContain("name: 'profile'");
        expect(cardSource).toContain('reference.comment');
        expect(cardSource).toContain('adminUsuariosEditarFila');
    });
});
