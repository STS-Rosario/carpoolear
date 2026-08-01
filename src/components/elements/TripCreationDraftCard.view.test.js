import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationDraftCard.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationDraftCard.vue', () => {
    it('re-reads draft state when the card is refreshed', () => {
        expect(componentSource).toContain('draftVisible');
        expect(componentSource).toContain('refresh()');
        expect(componentSource).toContain('hasTripCreationDraft(this.user.id)');
        expect(componentSource).toContain('activated()');
        expect(componentSource).toContain('trip-creation-draft-changed');
    });

    it('uses an info-style card with primary Continuar and danger Eliminar', () => {
        expect(componentSource).toContain('trip-creation-draft-card--info');
        expect(componentSource).toMatch(
            /trip-creation-draft-card--info[\s\S]*?--ds-info-bg|background:\s*var\(--ds-info-bg/
        );
        expect(componentSource).toMatch(
            /fa-info-circle|info-circle\.png|app-info-card__icon/
        );
        expect(componentSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(componentSource).toMatch(
            /variant="primary"[\s\S]*?\$t\('continuar'\)|variant="primary"[\s\S]*?continuar/
        );
        expect(componentSource).toMatch(
            /variant="danger"[\s\S]*?\$t\('eliminar'\)/
        );
        expect(componentSource).not.toContain('btn btn-primary');
        expect(componentSource).not.toContain('btn btn-default');
    });
});
