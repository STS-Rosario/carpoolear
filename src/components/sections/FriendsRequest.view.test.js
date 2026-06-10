import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FriendsRequest.vue');
const debouncePath = path.resolve(__dirname, '../../directives/debounceInput.js');
const friendsStorePath = path.resolve(__dirname, '../../stores/friends.js');

const viewSource = fs.readFileSync(viewPath, 'utf8');
const debounceSource = fs.readFileSync(debouncePath, 'utf8');
const friendsStoreSource = fs.readFileSync(friendsStorePath, 'utf8');

describe('FriendsRequest.vue friend search UI', () => {
    it('searches on debounced input and explicit search button click', () => {
        expect(viewSource).toContain('v-debounceInput="onTextChange"');
        expect(viewSource).toContain('@click="onTextChange"');
    });

    it('only renders results while a search term is present', () => {
        expect(viewSource).toContain('v-if="text.length > 0"');
        expect(viewSource).toContain(':key="user.id"');
    });

    it('clears stale search results when opening the view', () => {
        expect(viewSource).toContain('clearUserSearch');
    });

    it('shows a short orange sent label after requesting friendship', () => {
        expect(viewSource).toContain("$t('solicitudAmistadEnviada')");
        expect(viewSource).not.toContain("$t('solicitudEnviada')");
        expect(viewSource).toContain('btn-friend-request-sent');
        expect(viewSource).toContain('#e67e22');
    });
});

describe('debounceInput directive', () => {
    it('binds handlers to the component instance', () => {
        expect(debounceSource).toContain('handler.call(instance)');
        expect(debounceSource).toContain('binding.instance');
    });
});

describe('friends store searchUsers', () => {
    it('normalizes list responses through extractPaginatedList', () => {
        expect(friendsStoreSource).toContain('extractPaginatedList(response)');
    });
});
