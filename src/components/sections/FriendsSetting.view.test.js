import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FriendsSetting.vue');
const friendApiPath = path.resolve(__dirname, '../../services/api/FriendApi.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const friendApiSource = fs.readFileSync(friendApiPath, 'utf8');

describe('FriendsSetting.vue outgoing pending requests', () => {
    it('shows sent pending requests section with remove action', () => {
        expect(viewSource).toContain("$t('solicitudesDeAmigoPendientes')");
        expect(viewSource).toContain('sentPendings');
        expect(viewSource).toContain('sentPending');
        expect(viewSource).toContain('cancelRequest');
        expect(viewSource).toContain("$t('quitarSolicitudAmigo')");
        expect(viewSource).toContain('onCancelRequestClick');
    });
});

describe('FriendApi outgoing pending requests', () => {
    it('targets sent-pendings and cancel-request endpoints', () => {
        expect(friendApiSource).toContain('/api/friends/sent-pendings');
        expect(friendApiSource).toContain("'cancel-request'");
        expect(friendApiSource).toContain('sentPending');
        expect(friendApiSource).toContain('cancelRequest');
    });
});
