import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'WeeklySchedule.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('WeeklySchedule.vue', () => {
    it('uses AppInput for the editable weekly schedule time', () => {
        expect(viewSource).toContain("import AppInput from '../ui/AppInput.vue'");
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?type="time"[\s\S]*?weeklyScheduleTime/
        );
        expect(viewSource).not.toContain('form-control');
        expect(viewSource).not.toContain('form-control-time');
    });
});
