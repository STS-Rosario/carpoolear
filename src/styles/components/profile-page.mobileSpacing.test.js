import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const cssSource = fs.readFileSync(
    path.resolve(__dirname, 'profile-page.css'),
    'utf8'
);

function cssMediaBlock(css, query) {
    const match = css.match(
        new RegExp(`@media only screen and \\(${query}\\)\\s*\\{`)
    );
    if (!match) {
        return '';
    }
    const open = css.indexOf('{', match.index);
    let depth = 0;
    for (let i = open; i < css.length; i += 1) {
        if (css[i] === '{') {
            depth += 1;
        } else if (css[i] === '}') {
            depth -= 1;
            if (depth === 0) {
                return css.slice(open + 1, i);
            }
        }
    }
    return '';
}

describe('profile page mobile spacing', () => {
    const mobileCss = cssMediaBlock(cssSource, 'max-width:\\s*767px');
    const desktopCss = cssMediaBlock(cssSource, 'min-width:\\s*768px');

    it('keeps the shared heading margin for desktop and other pages', () => {
        expect(cssSource).toMatch(
            /\.profile-page h3,\s*\.trips\.container h3\s*\{[\s\S]*?margin:\s*1rem 0 0\.5rem/
        );
    });

    it('drops profile heading bottom margin on mobile only', () => {
        expect(mobileCss).toMatch(
            /\.profile-page h3[\s\S]*?margin-bottom:\s*0/
        );
        expect(desktopCss).not.toMatch(
            /\.profile-page h3[\s\S]*?margin-bottom:\s*0/
        );
    });

    it('drops profile container top padding on mobile only', () => {
        expect(mobileCss).toMatch(
            /\.profile-page[\s\S]*?\.container[\s\S]*?padding-top:\s*0/
        );
        expect(desktopCss).not.toMatch(
            /\.profile-page[\s\S]*?\.container[\s\S]*?padding-top:\s*0/
        );
    });
});
