import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const svgItemPath = path.resolve(__dirname, 'SvgItem.vue');
const source = fs.readFileSync(svgItemPath, 'utf8');

describe('SvgItem mobile footer icons', () => {
    it('renders the new home icon from the updated svg asset', () => {
        expect(source).toContain("icon === 'home'");
        expect(source).toContain('M19 20C19 19.4477 18.5523 19 18 19');
    });

    it('renders the new my-trips icon from the updated svg asset', () => {
        expect(source).toContain("icon === 'my-trips'");
        expect(source).toContain('M27 15C27 14.4477 26.5523 14 26 14H10');
    });

    it('renders the new create-trip icon from the updated svg asset', () => {
        expect(source).toContain("icon === 'create-trip'");
        expect(source).toContain('M17 22V19H14C13.4477 19 13 18.5523');
    });

    it('renders the new account icon from the updated svg asset', () => {
        expect(source).toContain("icon === 'account'");
        expect(source).toContain('M19 15.5C19 14.6969 18.8437 14.3552');
    });

    it('renders the new message icon from the updated svg asset', () => {
        expect(source).toContain("icon === 'message'");
        expect(source).toContain('M26.0001 19.2002V13.7998C26.0001 12.9434');
    });

    it('uses fill=currentColor so footer icons inherit the active tab color', () => {
        expect(source).toContain('fill="currentColor"');
    });

    it('removes the previous stroke-based footer icon paths to avoid duplicates', () => {
        expect(source).not.toContain('M16.4999 23.0992V14.2992');
        expect(source).not.toContain('M30.6668 38.3333V7.66665');
        expect(source).not.toContain('M3.46488 7.75838');
        expect(source).not.toContain('M16.1327 18.0512');
        expect(source).not.toContain('M20 2H4c-1.1 0-1.99.9-1.99 2');
    });
});
