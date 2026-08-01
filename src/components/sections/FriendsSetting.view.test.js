import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'FriendsSetting.vue');
const friendApiPath = path.resolve(__dirname, '../../services/api/FriendApi.js');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const friendApiSource = fs.readFileSync(friendApiPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('FriendsSetting.vue Amigos / Solicitudes tabs', () => {
    it('uses Amigos/Solicitudes tabset without a blue page heading', () => {
        expect(viewSource).toContain('friends-page');
        expect(viewSource).not.toContain('friends-page-heading');
        expect(viewSource).not.toMatch(
            /<h1[^>]*>\{\{\s*\$t\('misAmigos'\)/
        );
        expect(viewSource).toContain('tabset');
        expect(viewSource).toContain("$t('amigos')");
        expect(viewSource).toContain("$t('solicitudes')");
        expect(viewSource).toContain("keytabset=\"friends\"");
    });

    it('shows Recibidas/Enviadas FilterChips under Solicitudes with counts', () => {
        expect(viewSource).toContain('FilterChips');
        expect(viewSource).toContain('requestsFilter');
        expect(viewSource).toContain('requestFilterOptions');
        expect(viewSource).toContain("$t('filtroSolicitudesRecibidas')");
        expect(viewSource).toContain("$t('filtroSolicitudesEnviadas')");
        expect(i18nSource).toContain("filtroSolicitudesRecibidas: 'Recibidas'");
        expect(i18nSource).toContain("filtroSolicitudesEnviadas: 'Enviadas'");
        expect(i18nSource).toContain("filtroSolicitudesRecibidas: 'Received'");
        expect(i18nSource).toContain("filtroSolicitudesEnviadas: 'Sent'");
    });
});

describe('FriendsSetting.vue incoming friend requests', () => {
    it('renders incoming friend request cards with labeled accept and reject actions', () => {
        expect(viewSource).toContain('IncomingFriendRequestCard');
        expect(viewSource).toContain('incoming-friend-requests-list');
        expect(viewSource).toContain('align-items: flex-start');
        expect(viewSource).toMatch(
            /\.incoming-friend-requests-list[\s\S]*?width: 100%/
        );
        expect(viewSource).toContain('refreshFriendsData');
        expect(viewSource).toContain('activated()');
        expect(viewSource).toContain('onAcceptClick');
        expect(viewSource).toContain('onRejectClick');
        const incomingSection = viewSource.match(
            /id="incoming-friend-requests-list"[\s\S]*?<\/div>\s*<template #no-data/
        )?.[0];
        expect(incomingSection).toBeTruthy();
        expect(incomingSection).not.toContain('FriendCard');
    });
});

describe('FriendsSetting.vue friends list', () => {
    it('renders friend list cards with delete action and left-aligned layout', () => {
        expect(viewSource).toContain('FriendRequestCard');
        expect(viewSource).toContain('friends-list');
        expect(viewSource).toContain('onDeleteClick');
        expect(viewSource).toMatch(/\.friends-list[\s\S]*?align-items: flex-start/);
        const friendsListSection = viewSource.match(
            /id="friends-list"[\s\S]*?<\/div>\s*<template #no-data/
        )?.[0];
        expect(friendsListSection).toBeTruthy();
        expect(friendsListSection).not.toContain('<template slot>');
    });
});

describe('FriendsSetting.vue outgoing pending requests', () => {
    it('shows sent pending requests as inline-flex name chips with remove action', () => {
        expect(viewSource).toContain('sentPendings');
        expect(viewSource).toContain('sentPending');
        expect(viewSource).toContain('cancelRequest');
        expect(viewSource).toContain('sent-pending-list');
        expect(viewSource).toContain('display: inline-flex');
        expect(viewSource).toContain('sent-pending-chip');
        expect(viewSource).toContain('sent-pending-chip__name');
        expect(viewSource).toContain('sent-pending-chip__remove');
        expect(viewSource).not.toContain('friends-page-heading');
        expect(viewSource).not.toContain('sent-pending-heading');
        expect(viewSource).toContain("$t('quitarSolicitudAmigo')");
        expect(viewSource).toContain('onCancelRequestClick');
        expect(viewSource).toContain('fa fa-times');
        const sentPendingSection = viewSource.match(
            /id="sent-pending-list"[\s\S]*?<\/div>\s*<template #(?:no-data|loading)/
        )?.[0];
        expect(sentPendingSection).toBeTruthy();
        expect(sentPendingSection).not.toContain('FriendCard');
    });

    it('places search friends button on the same row as the name filter', () => {
        expect(viewSource).toContain('friends-toolbar');
        expect(viewSource).toContain('justify-content: space-between');
        const toolbarSection = viewSource.match(
            /class="friends-toolbar[\s\S]*?<\/div>\s*<Loading :data="friends">/
        )?.[0];
        expect(toolbarSection).toBeTruthy();
        expect(toolbarSection).toContain("$t('filtrarPorNombre')");
        expect(toolbarSection).toContain("$t('buscarNuevosAmigos')");
    });

    it('uses AppButton primary for Buscar nuevos amigos', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?buscarNuevosAmigos[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-primary search-more"/
        );
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
