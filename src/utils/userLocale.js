export const LOCALE_STORAGE_KEY = 'app_locale';

export function resolveInitialLocale({ storedLocale, userLocale, appLocale }) {
    if (storedLocale) {
        return storedLocale;
    }

    if (userLocale) {
        return userLocale;
    }

    return appLocale || 'arg';
}

export function buildLocaleUpdateFormData(locale) {
    const formData = new FormData();
    formData.append('locale', locale);
    formData.append('_method', 'PUT');

    return formData;
}

export function persistLocaleChoice(locale) {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export async function syncLocaleToBackend(userApi, locale, isLoggedIn) {
    if (!isLoggedIn || !locale) {
        return;
    }

    await userApi.update(buildLocaleUpdateFormData(locale));
}

export function applyResolvedLocale(i18n, locale) {
    if (!i18n || !locale) {
        return;
    }

    i18n.locale = locale;
}
