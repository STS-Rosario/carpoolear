import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';

/** Apple App Store ID (from https://apps.apple.com/app/carpoolear/id1045211385). */
export const IOS_APP_STORE_APP_ID = '1045211385';

export function getOpenAppStoreOptions() {
    if (Capacitor.getPlatform() === 'ios') {
        return { appId: IOS_APP_STORE_APP_ID };
    }

    return {};
}

export async function openNativeAppStore() {
    return AppUpdate.openAppStore(getOpenAppStoreOptions());
}
