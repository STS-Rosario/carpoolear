import { describe, expect, it } from 'vitest';
import {
    FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE,
    applyFriendsSettingDeepLink
} from './friendsDeepLinks.js';

describe('friendsDeepLinks', () => {
    it('exposes the Solicitudes Recibidas route query for friends_setting', () => {
        expect(FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE).toEqual({
            name: 'friends_setting',
            query: { tab: 'solicitudes', filter: 'recibidas' }
        });
    });

    it('activates Solicitudes and sets Recibidas from query', () => {
        const activateTab = [];
        const state = { requestsFilter: 'enviadas' };
        applyFriendsSettingDeepLink(
            { tab: 'solicitudes', filter: 'recibidas' },
            {
                setRequestsFilter: (value) => {
                    state.requestsFilter = value;
                },
                activateTab: (index) => {
                    activateTab.push(index);
                }
            }
        );
        expect(state.requestsFilter).toBe('recibidas');
        expect(activateTab).toEqual([1]);
    });

    it('ignores unknown tab and filter values', () => {
        const activateTab = [];
        const state = { requestsFilter: 'recibidas' };
        applyFriendsSettingDeepLink(
            { tab: 'amigos', filter: 'other' },
            {
                setRequestsFilter: (value) => {
                    state.requestsFilter = value;
                },
                activateTab: (index) => {
                    activateTab.push(index);
                }
            }
        );
        expect(state.requestsFilter).toBe('recibidas');
        expect(activateTab).toEqual([]);
    });
});
