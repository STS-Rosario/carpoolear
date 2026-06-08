import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileInfo.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('ProfileInfo member stats', () => {
    it('shows member since and participated trips below rating counters', () => {
        const ratingsIndex = viewSource.indexOf('profile-info--ratings');
        const memberSinceIndex = viewSource.indexOf("$t('miembroDesde'");
        const tripsIndex = viewSource.indexOf("$t('perfilViajesParticipados'");

        expect(ratingsIndex).toBeGreaterThan(-1);
        expect(memberSinceIndex).toBeGreaterThan(ratingsIndex);
        expect(tripsIndex).toBeGreaterThan(memberSinceIndex);
        expect(viewSource).toContain('formatMemberSinceMonthYear');
        expect(viewSource).toContain('normalizeTripsCount');
        expect(viewSource).toContain('profile-info--member-stats');
        expect(viewSource).toMatch(/\.profile-info\s*\{[\s\S]*align-items:\s*center/);
        expect(viewSource).toMatch(
            /\.profile-info--member-stats\s*\{[\s\S]*text-align:\s*center/
        );
    });

    it('keeps member stats copy in i18n', () => {
        expect(i18nSource).toContain('miembroDesde');
        expect(i18nSource).toContain('perfilViajesParticipados');
        expect(i18nSource).toContain('Miembro desde: {date}');
        expect(i18nSource).toContain('{count} viajes');
        expect(i18nSource).toContain('Member since: {date}');
        expect(i18nSource).toContain('{count} trips');
    });
});

describe('ProfileInfo cars display', () => {
    it('lists all active patentes when viewing a profile', () => {
        expect(viewSource).toContain('activeCarsWithPlate');
        expect(viewSource).toContain('visibleCars');
        expect(viewSource).toContain('v-for="car in visibleCars"');
        expect(viewSource).toContain('profile-car-patente');
        expect(viewSource).not.toContain('profile.cars[0].patente');
    });
});
