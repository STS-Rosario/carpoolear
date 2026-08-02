import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminMaintenance.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminMaintenance view', () => {
    it('uses AppField, AppInput, AppTextarea and AppButton for admin form controls', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toContain("import AppField from '../ui/AppField.vue'");
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toContain("import AppTextarea from '../ui/AppTextarea.vue'");
        expect(viewSource).toMatch(
            /<AppField[\s\S]*?manualForm\.mode[\s\S]*?admin-maintenance__select/
        );
        expect(viewSource).toMatch(
            /<AppTextarea[\s\S]*?v-model="manualForm\.message"/
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?v-model="manualForm\.endsAtLocal"[\s\S]*?type="datetime-local"/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?saveManual/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?cancelSchedule/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('btn btn-primary');
        expect(viewSource).not.toContain('btn btn-default');
        expect(viewSource).not.toContain('btn btn-danger');
    });
});
