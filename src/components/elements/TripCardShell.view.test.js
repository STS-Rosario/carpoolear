import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripCardShell.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripCardShell.vue', () => {
    it('renders ratings thumbs, plain name, city, province and trip point text, seats and detail CTA', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).not.toContain('UserNameWithBadge');
        expect(viewSource).toContain('trip-card-shell__name');
        expect(viewSource).not.toContain("$t('puntoDePartida')");
        expect(viewSource).not.toContain("$t('puntoDeLlegada')");
        expect(viewSource).toContain("$t('verDetalle')");
        expect(viewSource).toContain('trip-card-shell__region');
        expect(viewSource).toContain('trip-card-shell__point');
        expect(viewSource).toContain('fromRegion');
        expect(viewSource).toContain('fromPoint');
        expect(viewSource).toContain('toRegion');
        expect(viewSource).toContain('toPoint');
        expect(viewSource).toContain('getSeatsPillTone');
        expect(viewSource).toContain('getSeatsPillLabel');
    });

    it('shows verified shield after trips count only when driver is verified', () => {
        expect(viewSource).toMatch(
            /trip-card-shell__meta[\s\S]*trip-card-shell__trips[\s\S]*trip-card-shell__verified/
        );
        expect(viewSource).toMatch(
            /v-if="isDriverVerified"[\s\S]*trip-card-shell__verified|trip-card-shell__verified[\s\S]*v-if="isDriverVerified"/
        );
        expect(viewSource).toContain('fa-shield');
        expect(viewSource).toContain("$t('usuarioVerificado')");
        expect(viewSource).toMatch(
            /isDriverVerified\(\)\s*\{[\s\S]*identity_validated[\s\S]*identity_validated_at/
        );
    });

    it('centers avatar beside name/seats and ratings/viajes rows', () => {
        expect(viewSource).toContain('trip-card-shell__primary');
        expect(viewSource).toMatch(
            /trip-card-shell__driver[\s\S]*trip-card-shell__avatar[\s\S]*trip-card-shell__copy[\s\S]*trip-card-shell__primary/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__primary[\s\S]*trip-card-shell__name[\s\S]*trip-card-shell__seats/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__meta[\s\S]*UserRatingsCounts[\s\S]*trip-card-shell__trips/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__primary[\s\S]*trip-card-shell__meta/
        );
        expect(viewSource).not.toMatch(
            /trip-card-shell__primary[\s\S]*trip-card-shell__avatar/
        );
    });

    it('shows city, province, then punto text without i18n route labels', () => {
        expect(viewSource).toMatch(
            /trip-card-shell__city[\s\S]*\{\{\s*fromCity\s*\}\}[\s\S]*trip-card-shell__region[\s\S]*fromRegion[\s\S]*trip-card-shell__point[\s\S]*fromPoint/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__city[\s\S]*\{\{\s*toCity\s*\}\}[\s\S]*trip-card-shell__region[\s\S]*toRegion[\s\S]*trip-card-shell__point[\s\S]*toPoint/
        );
    });

    it('places schedule chips below the full-width route', () => {
        expect(viewSource).toMatch(
            /trip-card-shell__route[\s\S]*trip-card-shell__schedule/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__body[\s\S]*trip-card-shell__route[\s\S]*trip-card-shell__schedule[\s\S]*<\/div>\s*<slot name="body-extra"/
        );
    });

    it('renders dividers between header, body and footer', () => {
        expect(viewSource).toMatch(
            /trip-card-shell__header[\s\S]*trip-card-shell__divider[\s\S]*trip-card-shell__body[\s\S]*trip-card-shell__divider[\s\S]*trip-card-shell__footer/
        );
    });

    it('uses v-imgSrc:profile directive for the driver avatar', () => {
        expect(viewSource).toContain('v-imgSrc:profile="avatarImage"');
        expect(viewSource).toMatch(/avatarImage\(\)\s*\{[\s\S]*user\.image/);
    });

    it('routes profile vs detail clicks separately', () => {
        expect(viewSource).toMatch(
            /@click\.stop(?:\.prevent)?="onProfileClick"|v-on:click\.stop="onProfileClick"/
        );
        expect(viewSource).toContain("$emit('profile-click'");
        expect(viewSource).toContain("$emit('detail-click'");
        expect(viewSource).toContain('trip-card-shell__detail');
    });

    it('emits detail-click when the card root is clicked', () => {
    });

    it('exposes actions-extra, body-extra and footer-extra slots', () => {
        expect(viewSource).toContain('name="actions-extra"');
        expect(viewSource).toContain('name="body-extra"');
        expect(viewSource).toContain('name="footer-extra"');
    });

    it('declares the expected props with defaults', () => {
        expect(viewSource).toMatch(/user:\s*\{[\s\S]*?type:\s*Object/);
        expect(viewSource).toMatch(/ratings:\s*\{[\s\S]*?type:\s*Object/);
        expect(viewSource).toMatch(/tripsCountLabel:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/seatsAvailable:\s*\{[\s\S]*?type:\s*Number/);
        expect(viewSource).toMatch(/fromCity:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/fromRegion:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/fromPoint:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/toCity:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/toRegion:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/toPoint:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/dateLabel:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/timeLabel:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/showSeatsPill:\s*\{[\s\S]*?type:\s*Boolean[\s\S]*?default:\s*true/);
    });

    it('declares profile-click and detail-click emits', () => {
        expect(viewSource).toMatch(/emits:\s*\[[\s\S]*?'profile-click'[\s\S]*?'detail-click'[\s\S]*?\]/);
    });

    it('adds no-driver modifier class when user is missing', () => {
        expect(viewSource).toContain('trip-card-shell--no-driver');
        expect(viewSource).toMatch(
            /trip-card-shell--no-driver[\s\S]*!user|!user[\s\S]*trip-card-shell--no-driver/
        );
    });
});
