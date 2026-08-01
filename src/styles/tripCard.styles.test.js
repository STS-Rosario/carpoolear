import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-card.css'),
    'utf8'
);
const mainCss = fs.readFileSync(path.resolve(__dirname, 'main.css'), 'utf8');

describe('trip card styles', () => {
    it('defines shell layout, seats tones, route point text, chips and detail CTA', () => {
        expect(css).toContain('.trip-card-shell');
        expect(css).toContain('.trip-card-shell__seats--high');
        expect(css).toContain('.trip-card-shell__seats--medium');
        expect(css).toContain('.trip-card-shell__seats--low');
        expect(css).toContain('.trip-card-shell__seats--full');
        expect(css).toContain('.trip-card-shell__region');
        expect(css).toContain('.trip-card-shell__point');
        expect(css).toContain('.trip-card-shell__chip');
        expect(css).toContain('.trip-card-shell__detail');
        expect(css).toContain('.trip-card-shell__divider');
        expect(css).toMatch(
            /\.trip-card-shell__header\s*\{[\s\S]*min-height:\s*2\.25rem/
        );
        expect(css).toMatch(
            /\.trip-card-shell\s*\{[\s\S]*border-radius:\s*var\(--ds-card-radius/
        );
        expect(css).toMatch(
            /\.trip-card-shell\s*\{[\s\S]*box-shadow:\s*var\(--ds-card-shadow/
        );
        expect(css).toMatch(
            /\.trip-card-shell\s*\{[\s\S]*background:\s*var\(--ds-card-bg/
        );
    });

    it('uses a compact driver header and tighter detail button padding', () => {
        expect(css).toMatch(
            /\.trip-card-shell__avatar[\s\S]*?\{[\s\S]*width:\s*2\.25rem/
        );
        expect(css).toMatch(
            /\.trip-card-shell__avatar[\s\S]*?\{[\s\S]*background-size:\s*cover/
        );
        expect(css).toMatch(
            /\.trip-card-shell__avatar[\s\S]*?\{[\s\S]*background-position:\s*center/
        );
        expect(css).not.toMatch(
            /\.trip-card-shell__avatar[^{]*\{[^}]*\bbackground:\s*var\(--ds-input-disabled-bg\)/
        );
        expect(css).toMatch(
            /\.trip-card-shell__detail\s*\{[\s\S]*padding:\s*0\.375rem/
        );
    });

    it('stretches cards to equal height within a row', () => {
        expect(css).toMatch(
            /\.trip\s*\{[\s\S]*height:\s*100%/
        );
        expect(css).toMatch(
            /\.trip-card-shell\s*\{[\s\S]*height:\s*100%/
        );
        expect(css).toMatch(
            /\.trips-section__list\.row[\s\S]*display:\s*flex/
        );
    });

    it('puts leftover card height between origin and destination', () => {
        expect(css).toMatch(
            /\.trip-card-shell__body\s*\{[^}]*flex:\s*1/
        );
        expect(css).toMatch(
            /\.trip-card-shell__route-content\s*\{[^}]*justify-content:\s*space-between/
        );
    });

    it('stacks schedule under the full-width route', () => {
        expect(css).toMatch(
            /\.trip-card-shell__body\s*\{[^}]*flex-direction:\s*column/
        );
        expect(css).toMatch(
            /\.trip-card-shell__route\s*\{[^}]*width:\s*100%/
        );
        expect(css).toMatch(
            /\.trip-card-shell__schedule\s*\{[^}]*flex-direction:\s*row/
        );
        expect(css).toMatch(
            /\.trip-card-shell__schedule\s*\{[^}]*justify-content:\s*space-between/
        );
    });

    it('space-betweens trip cards across the full trips row width', () => {
        expect(css).toMatch(
            /\.trips-section__list\.row[\s\S]*?\{[^}]*justify-content:\s*space-between/
        );
        expect(css).toMatch(
            /\.trips-section__list\.row::(?:before|after)[\s\S]*?\{[^}]*display:\s*none/
        );
        expect(css).toMatch(
            /\.trips-section__list\.row\s*\{[^}]*padding-left:\s*0/
        );
        expect(css).toMatch(
            /\.trips-section__list\.row\s*\{[^}]*padding-right:\s*0/
        );
    });

    it('equal-heights My Trips cards in the same row without requiring .row', () => {
        expect(css).toMatch(
            /\.trips-list\s*\{[^}]*display:\s*flex[^}]*justify-content:\s*flex-start[^}]*align-items:\s*stretch/
        );
        expect(css).toMatch(
            /\.trips-list\s*>\s*\[class\*='col-'\][\s,][\s\S]*?\{[^}]*display:\s*flex/
        );
        expect(css).toMatch(
            /\.trips-list\s*>\s*\[class\*='col-'\]\s*>\s*\.trip[\s,][\s\S]*?\{[^}]*height:\s*100%/
        );
        expect(css).toMatch(
            /\.trip-card-shell__footer\s*\{[^}]*margin-top:\s*auto/
        );
    });

    it('lets trip cards wrap instead of clipping when the row is too narrow', () => {
        expect(css).toMatch(
            /\.trips-list\s*>\s*\[class\*='col-'\][\s,][\s\S]*?\{[^}]*min-width:\s*0/
        );
        expect(css).toMatch(
            /@media\s*\(min-width:\s*1200px\)\s*\{[\s\S]*\.trips-list\s*>\s*\.col-lg-6[\s,][\s\S]*?\{[^}]*min-width:\s*min\(100%,\s*17rem\)/
        );
        expect(css).toMatch(
            /@media\s*\(min-width:\s*1200px\)\s*\{[\s\S]*\.trips-list\s*>\s*\.col-lg-6[\s,][\s\S]*?\{[^}]*flex:\s*1\s+1\s+calc\(25%/
        );
    });

    it('left-aligns friend trip rows with a fixed gap', () => {
        // Must beat .app-container .trips-section__list.row (space-between)
        expect(css).toMatch(
            /\.app-container\s+\.trips-section__list--start\.row\s*\{[^}]*justify-content:\s*flex-start/
        );
        expect(css).toMatch(
            /\.app-container\s+\.trips-section__list--start\.row\s*\{[^}]*column-gap:\s*1rem/
        );
    });

    it('lays out primary row and meta row without absolute seats', () => {
        expect(css).toContain('.trip-card-shell__primary');
        expect(css).toMatch(
            /\.trip-card-shell__primary\s*\{[\s\S]*display:\s*flex/
        );
        expect(css).toMatch(
            /\.trip-card-shell__meta\s*\{[\s\S]*flex-wrap:\s*nowrap/
        );
        expect(css).toMatch(
            /\.trip-card-shell__seats\s*\{[\s\S]*position:\s*static/
        );
    });

    it('vertically centers the avatar beside the driver copy rows', () => {
        expect(css).toMatch(
            /\.trip-card-shell__driver\s*\{[^}]*flex-direction:\s*row/
        );
        expect(css).toMatch(
            /\.trip-card-shell__driver\s*\{[^}]*align-items:\s*center/
        );
        expect(css).toContain('.trip-card-shell__copy');
        expect(css).not.toMatch(
            /\.trip-card-shell__meta\s*\{[^}]*padding-left:/
        );
    });

    it('is imported from main.css', () => {
        expect(mainCss).toContain('./components/trip-card.css');
    });
});
