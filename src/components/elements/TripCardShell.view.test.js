import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripCardShell.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripCardShell.vue', () => {
    it('renders ratings thumbs, name badge, city and trip point text, seats and detail CTA', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('UserNameWithBadge');
        expect(viewSource).not.toContain("$t('puntoDePartida')");
        expect(viewSource).not.toContain("$t('puntoDeLlegada')");
        expect(viewSource).toContain("$t('verDetalle')");
        expect(viewSource).toContain('trip-card-shell__point');
        expect(viewSource).toContain('fromPoint');
        expect(viewSource).toContain('toPoint');
        expect(viewSource).toContain('getSeatsPillTone');
        expect(viewSource).toContain('getSeatsPillLabel');
    });

    it('matches trip-card-shell CSS structure classes', () => {
        expect(viewSource).toContain('class="trip-card-shell"');
        expect(viewSource).toContain('trip-card-shell__header');
        expect(viewSource).toContain('trip-card-shell__driver');
        expect(viewSource).toContain('trip-card-shell__avatar');
        expect(viewSource).toContain('trip-card-shell__name');
        expect(viewSource).toContain('trip-card-shell__meta');
        expect(viewSource).toContain('trip-card-shell__trips');
        expect(viewSource).toContain('trip-card-shell__seats');
        expect(viewSource).toContain('trip-card-shell__divider');
        expect(viewSource).toContain('trip-card-shell__body');
        expect(viewSource).toContain('trip-card-shell__route');
        expect(viewSource).toContain('trip-card-shell__route-graphic');
        expect(viewSource).toContain('trip-card-shell__endpoint');
        expect(viewSource).toContain('trip-card-shell__city');
        expect(viewSource).toContain('trip-card-shell__point');
        expect(viewSource).toContain('trip-card-shell__schedule');
        expect(viewSource).toContain('trip-card-shell__chip');
        expect(viewSource).toContain('trip-card-shell__footer');
        expect(viewSource).toContain('trip-card-shell__detail');
    });

    it('shows city first then punto text below without i18n route labels', () => {
        expect(viewSource).toMatch(
            /trip-card-shell__city[\s\S]*\{\{\s*fromCity\s*\}\}[\s\S]*trip-card-shell__point[\s\S]*fromPoint/
        );
        expect(viewSource).toMatch(
            /trip-card-shell__city[\s\S]*\{\{\s*toCity\s*\}\}[\s\S]*trip-card-shell__point[\s\S]*toPoint/
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
        expect(viewSource).toMatch(/class="trip-card-shell"[\s\S]*?@click="onRootClick"/);
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
        expect(viewSource).toMatch(/fromPoint:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/toCity:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/toPoint:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/dateLabel:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/timeLabel:\s*\{[\s\S]*?type:\s*String/);
        expect(viewSource).toMatch(/showSeatsPill:\s*\{[\s\S]*?type:\s*Boolean[\s\S]*?default:\s*true/);
    });

    it('declares profile-click and detail-click emits', () => {
        expect(viewSource).toMatch(/emits:\s*\[[\s\S]*?'profile-click'[\s\S]*?'detail-click'[\s\S]*?\]/);
    });
});
