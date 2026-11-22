import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import router from '../router';
import { useAuthStore } from '../stores/auth';
import { parseNativeAppLinkUrl } from '../utils/nativeAppLink';
import { syncAuthUserAfterIdentityVerificationSuccess } from '../utils/userIdentityVerification';

async function handleIncomingAppUrl(url) {
    const target = parseNativeAppLinkUrl(url);
    if (!target) {
        return;
    }

    await router.push({
        name: target.name,
        query: target.query
    });

    const authStore = useAuthStore();
    await syncAuthUserAfterIdentityVerificationSuccess({
        resultMessage: target.query.result,
        user: authStore.user,
        setUser: (user) => authStore.setUser(user),
        fetchUser: () => authStore.fetchUser()
    });
}

/**
 * Handle Mercado Pago OAuth return URLs opened as App Links / Universal Links.
 */
export function registerNativeDeepLinks() {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    App.addListener('appUrlOpen', ({ url }) => {
        handleIncomingAppUrl(url).catch(() => {});
    });

    App.getLaunchUrl()
        .then((launch) => {
            if (launch?.url) {
                return handleIncomingAppUrl(launch.url);
            }
            return undefined;
        })
        .catch(() => {});
}
