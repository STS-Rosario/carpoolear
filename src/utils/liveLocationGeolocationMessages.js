import i18n from '../i18n.js';

const FALLBACK_MESSAGES = {
    backgroundTitle: 'Carpoolear',
    backgroundMessage: 'Compartiendo tu ubicación en tiempo real.'
};

export function getLiveLocationGeolocationMessages() {
    try {
        return {
            backgroundTitle: i18n.global.t('liveLocationBackgroundTitle'),
            backgroundMessage: i18n.global.t('liveLocationBackgroundMessage')
        };
    } catch {
        return FALLBACK_MESSAGES;
    }
}
