import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UpdateProfile.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('UpdateProfile missing field routing', () => {
    it('exposes the patente input as a scroll target', () => {
        expect(viewSource).toContain("for=\"'input-patente-' + index\"");
        expect(viewSource).toContain("id=\"'input-patente-' + index\"");
        expect(viewSource).toContain("'patenteInput'");
    });

    it('scrolls to patente when route query requests the missing patente field', () => {
        expect(viewSource).toContain("this.$route.query.missing !== 'patente'");
        expect(viewSource).toContain('this.$refs.patenteInput');
        expect(viewSource).toContain(
            'this.$scrollToElement(this.$refs.patenteInput, -270)'
        );
    });

    it('highlights the patente field when route query requests it', () => {
        expect(viewSource).toContain('missing-field-highlight');
        expect(viewSource).toContain('shouldHighlightPatente');
        expect(viewSource).toContain("this.$route.query.missing === 'patente'");
    });
});

describe('UpdateProfile multiple patentes', () => {
    it('supports adding another car from the profile form', () => {
        expect(viewSource).toContain('agregarOtroAuto');
        expect(viewSource).toContain('addUserCar');
        expect(viewSource).toContain('removeUserCar');
        expect(viewSource).toContain('v-for="(entry, index) in userCars"');
        expect(viewSource).toContain('saveUserCars');
    });
});

describe('UpdateProfile save error feedback', () => {
    it('shows backend validation errors in an alert and snackbar', () => {
        expect(viewSource).toContain('getApiErrorMessage');
        expect(viewSource).toContain('profile-save-error');
        expect(viewSource).toContain('fa-exclamation-triangle');
        expect(viewSource).toContain("dialogs.message(message, {\n                        duration: 10,\n                        estado: 'error'\n                    })");
    });
});
