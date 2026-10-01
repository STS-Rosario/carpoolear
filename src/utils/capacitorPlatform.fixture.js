import { vi } from 'vitest';

/**
 * Test fixture: WebView origin per platform. capacitor.config.json sets
 * server.hostname = carpoolear.com.ar (https:// on Android, capacitor:// on iOS).
 */
export const WEBVIEW_ORIGINS = {
    web: 'https://carpoolear.com.ar',
    android: 'https://carpoolear.com.ar',
    ios: 'capacitor://carpoolear.com.ar'
};

/**
 * Point a happy-dom test at a platform: the hoisted `@capacitor/core` mock
 * (isNativePlatform / getPlatform), window.location and the build's VITE_API_URL
 * (native builds use VITE_API_URL_NATIVE = www). Undo with vi.unstubAllGlobals/Envs.
 */
export function stubCapacitorPlatform(capacitorMock, platform) {
    capacitorMock.isNativePlatform.mockReturnValue(platform !== 'web');
    capacitorMock.getPlatform.mockReturnValue(platform);
    vi.stubGlobal('location', {
        origin: WEBVIEW_ORIGINS[platform],
        host: 'carpoolear.com.ar'
    });
    vi.stubEnv(
        'VITE_API_URL',
        platform === 'web'
            ? 'https://carpoolear.com.ar'
            : 'https://www.carpoolear.com.ar'
    );
}
