import { describe, expect, it } from 'vitest';
import {
    getMyAccountMenuItems,
    identityValidationAvailable,
    isMyAccountMenuItemActive
} from './myAccountMenuItems';

describe('myAccountMenuItems', () => {
    it('includes core account sections', () => {
        const items = getMyAccountMenuItems({});
        expect(items.map((item) => item.id)).toEqual([
            'edit-profile',
            'cars',
            'friends',
            'delete-account'
        ]);
    });

    it('includes identity validation when enabled in config', () => {
        const config = {
            identity_validation_enabled: true,
            identity_validation_mercado_pago_enabled: true
        };
        expect(identityValidationAvailable(config)).toBe(true);
        expect(getMyAccountMenuItems(config).map((item) => item.id)).toContain(
            'identity-validation'
        );
    });

    it('marks friends search under the friends menu item', () => {
        const friendsItem = getMyAccountMenuItems({}).find(
            (item) => item.id === 'friends'
        );
        expect(
            isMyAccountMenuItemActive(friendsItem, 'friends_search')
        ).toBe(true);
    });

    it('highlights only edit profile when on profile_update', () => {
        const items = getMyAccountMenuItems({});
        const activeIds = items
            .filter((item) =>
                isMyAccountMenuItemActive(item, 'profile_update')
            )
            .map((item) => item.id);
        expect(activeIds).toEqual(['edit-profile']);
    });

    it('routes delete account through profile update with a query flag', () => {
        const deleteItem = getMyAccountMenuItems({}).find(
            (item) => item.id === 'delete-account'
        );
        expect(deleteItem.route).toEqual({
            name: 'profile_update',
            query: { action: 'delete-account' }
        });
    });
});
