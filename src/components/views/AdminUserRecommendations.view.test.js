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

    it('uses secondary AppButton for back navigation', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?size="sm"[\s\S]*?hubRoute/
        );
        expect(viewSource).not.toContain('btn btn-default');
    });
});

describe('AdminReferenceCard', () => {
    it('shows reference id, author admin profile link, comment, and edit on one row', () => {
        expect(cardSource).toContain('admin-reference-card__row');
        expect(cardSource).toContain('admin-reference-card__id');
        expect(cardSource).toContain('getAdminUserProfileRoute');
        expect(cardSource).not.toContain("name: 'profile'");
        expect(cardSource).toContain('reference.comment');
        expect(cardSource).toContain('adminUsuariosEditarFila');
    });

    it('uses AppTextarea and AppButton for edit controls', () => {
        expect(cardSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(cardSource).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(cardSource).toMatch(
            /<AppTextarea[\s\S]*?:model-value="editComment"/
        );
        expect(cardSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?\$emit\('save'\)/
        );
        expect(cardSource).not.toContain('form-control');
        expect(cardSource).not.toContain('btn btn-primary');
        expect(cardSource).not.toContain('btn btn-default');
    });
});
