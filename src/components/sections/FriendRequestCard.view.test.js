import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FriendRequestCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('FriendRequestCard', () => {
    it('matches incoming friend request card styling without accept actions', () => {
        expect(viewSource).toContain("name: 'friend_list_card'");
        expect(viewSource).toContain('friend-list-card');
        expect(viewSource).toContain('font-size: 1.25rem');
        expect(viewSource).toContain('max-width: 50px');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain("$t('quitarAmigo')");
        expect(viewSource).toContain("$emit('delete', user)");
        expect(viewSource).not.toContain('btn-accept-request');
        expect(viewSource).not.toContain('deseaSerTuAmigo');
    });
});
