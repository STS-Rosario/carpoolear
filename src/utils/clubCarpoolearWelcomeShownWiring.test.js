import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const apiSource = fs.readFileSync(
    path.resolve(__dirname, '../services/api/Donation.js'),
    'utf8'
);
const helperSource = fs.readFileSync(
    path.resolve(__dirname, 'clubCarpoolearWelcomeRedirect.js'),
    'utf8'
);
const authSource = fs.readFileSync(
    path.resolve(__dirname, '../stores/auth.js'),
    'utf8'
);

describe('Club Carpoolear welcome shown client wiring', () => {
    it('posts to the welcome-shown endpoint', () => {
        expect(apiSource).toContain("this.post('/api/club-carpoolear/welcome-shown'");
        expect(apiSource).toContain('markWelcomeShown');
    });

    it('uses a 3 second delay before marking welcome as shown', () => {
        expect(helperSource).toContain(
            'export const CLUB_CARPOOLEAR_WELCOME_MARK_DELAY_MS = 3000'
        );
    });

    it('redirects after fetchUser when the welcome screen is still pending', () => {
        expect(authSource).toContain('shouldRedirectToClubCarpoolearWelcome');
        expect(authSource).toContain("name: 'club-carpoolear-welcome'");
    });
});
