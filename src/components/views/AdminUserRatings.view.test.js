import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserRatings.vue');
const cardPath = path.resolve(__dirname, '../elements/AdminRatingCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const cardSource = fs.readFileSync(cardPath, 'utf8');

describe('AdminUserRatings view', () => {
    it('loads received and given ratings via AdminApi.getUserRatings', () => {
        expect(viewSource).toContain('AdminLayout');
        expect(viewSource).toContain('getUserRatings');
        expect(viewSource).toContain('receivedRatings');
        expect(viewSource).toContain('givenRatings');
        expect(viewSource).toContain("$t('adminUsuariosCalificacionesRecibidas')");
        expect(viewSource).toContain("$t('adminUsuariosCalificacionesOtorgadas')");
        expect(viewSource).toContain('AdminRatingCard');
        expect(viewSource).toContain('updateRating');
    });
});

describe('AdminRatingCard', () => {
    it('shows rating id, trip link, admin profile link, pill, and comment', () => {
        expect(cardSource).toContain('admin-rating-card__row');
        expect(cardSource).toContain('admin-rating-card__id');
        expect(cardSource).toContain("name: 'detail_trip'");
        expect(cardSource).toContain('getAdminUserProfileRoute');
        expect(cardSource).not.toContain("name: 'profile'");
        expect(cardSource).toContain('admin-rating-pill--positive');
        expect(cardSource).toContain('admin-rating-pill--neutral');
        expect(cardSource).toContain('admin-rating-pill--negative');
        expect(cardSource).toContain('rateItemNeutral');
        expect(cardSource).toContain('rate.comment');
    });

    it('uses AppField, AppTextarea and AppButton for edit controls', () => {
        expect(cardSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(cardSource).toContain("import AppField from '../ui/AppField.vue'");
        expect(cardSource).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(cardSource).toMatch(
            /<AppField[\s\S]*?adminUsuariosCalificacion[\s\S]*?admin-rating-card__select/
        );
        expect(cardSource).toMatch(
            /<AppTextarea[\s\S]*?editForm\.comment/
        );
        expect(cardSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?\$emit\('save'\)/
        );
        expect(cardSource).not.toContain('form-control');
        expect(cardSource).not.toContain('btn btn-primary');
        expect(cardSource).not.toContain('btn btn-default');
    });
});
