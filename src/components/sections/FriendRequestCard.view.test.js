import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FriendRequestCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('FriendRequestCard component name', () => {
    it('uses friend_request_card as component name', () => {
        expect(viewSource).toContain("name: 'friend_request_card'");
        expect(viewSource).not.toContain("name: 'friend_card'");
    });
});
