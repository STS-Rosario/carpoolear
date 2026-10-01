import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';

export function resolveIosAppStoreAppId() {
    const appId = import.meta.env.VITE_IOS_APP_STORE_APP_ID;
    return appId ? String(appId).trim() : '';
}

export function getOpenAppStoreOptions() {
    if (Capacitor.getPlatform() === 'ios') {
        return { appId: resolveIosAppStoreAppId() };
    }

    return {};
}

export async function openNativeAppStore() {
    return AppUpdate.openAppStore(getOpenAppStoreOptions());
}
