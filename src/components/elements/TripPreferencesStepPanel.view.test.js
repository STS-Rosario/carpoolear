import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripPreferencesStepPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripPreferencesStepPanel.vue', () => {
    it('renders preferences toggles, friends section, and required comments', () => {
        expect(componentSource).toContain("$t('tripCreationStepDescriptionQuestion')");
        expect(componentSource).toContain("$t('preferenciasViaje')");
        expect(componentSource).toContain("$t('tripPrefToggleKids')");
        expect(componentSource).toContain("$t('tripPrefToggleSmoking')");
        expect(componentSource).toContain("$t('tripPrefTogglePets')");
        expect(componentSource).toContain('allowKids');
        expect(componentSource).toContain('allowSmoking');
        expect(componentSource).toContain('allowAnimals');
        expect(componentSource).toContain("$t('tripPrefFriendsSection')");
        expect(componentSource).toContain('showFriends');
        expect(componentSource).toContain('autoacceptFriends');
        expect(componentSource).toContain("$t('tripPrefCommentsSection')");
        expect(componentSource).toContain('placeholderComentarioPasajeros');
        expect(componentSource).not.toMatch(/Opcional/i);
    });
});
