export const IDENTITY_VERIFICATION_CLIENT_EVENTS = {
    confirmModalShown: 'confirm_modal_shown',
    confirmModalCancelled: 'confirm_modal_cancelled'
};

export function getIdentityVerificationClientContext({
    getPlatform = () => 'web',
    getAppVersion = () => null
} = {}) {
    const platform = getPlatform() || 'web';
    const appVersion = getAppVersion();
    const context = { platform };
    if (appVersion !== null && appVersion !== undefined && String(appVersion) !== '') {
        context.app_version = String(appVersion);
    }
    return context;
}
