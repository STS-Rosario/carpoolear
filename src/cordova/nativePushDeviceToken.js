export function isIosNativePlatform(platform) {
    return platform === 'ios';
}

export async function persistPushDeviceToken(token, { setDeviceId, register }) {
    if (!token) {
        return;
    }
    setDeviceId(token);
    return register();
}
