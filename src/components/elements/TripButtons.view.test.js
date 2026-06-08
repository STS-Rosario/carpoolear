import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripButtons.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripButtons.vue trip detail layout', () => {
    it('keeps action buttons in document flow on desktop to avoid overlapping seats', () => {
        const desktopButtonsRule = viewSource.match(
            /@media only screen and \(min-width: 768px\)\s*\{[\s\S]*?\.buttons-container\s*\{([\s\S]*?)\}/
        );

        expect(desktopButtonsRule).not.toBeNull();

        const desktopButtonsStyles = desktopButtonsRule[1];
        expect(desktopButtonsStyles).not.toMatch(/position:\s*absolute/);
        expect(desktopButtonsStyles).toMatch(/margin-top:\s*1\.5em/);
    });

    it('shows live location share button when trip is shareable', () => {
        expect(viewSource).toContain('compartirUbicacionTiempoReal');
        expect(viewSource).toContain("name: 'trip_live_share'");
        expect(viewSource).toContain('showLiveLocationShare');
    });
});
