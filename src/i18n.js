import { createI18n } from 'vue-i18n';
import messages from './language/i18n';

// Price format: controlled by config.price_show_cents (default: show cents).
// Set price_show_cents: false in config to hide cents in currency display.
// narrowSymbol → "$111" for ARS; plain "symbol" often becomes "ARS 111" for locale `arg`.
const defaultCurrencyOptions = (fractionDigits = 2) => ({
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
});

// App locale -> BCP 47 locale (for Intl number/currency formatting).
export const appLocaleToBCP47 = {
    arg: 'es-AR',
    chl: 'es-CL'
};
// App locale -> leaflet-routing-machine language (base codes only; e.g. 'es' not 'es-AR').
export const appLocaleToRoutingLanguage = {
    arg: 'es',
    chl: 'es'
};

const i18n = createI18n({
    legacy: true,
    locale: 'arg',
    fallbackLocale: 'arg',
    messages,
    silentFallbackWarn: true,
    numberFormats: {
        arg: {
            currency: {
                currency: 'ARS',
                ...defaultCurrencyOptions(2)
            }
        },
        chl: {
            currency: {
                currency: 'CLP',
                ...defaultCurrencyOptions(2)
            }
        },
        'es-AR': {
            currency: {
                currency: 'ARS',
                ...defaultCurrencyOptions(2)
            }
        },
        'es-CL': {
            currency: {
                currency: 'CLP',
                ...defaultCurrencyOptions(2)
            }
        }
    }
});

export function applyPriceFormat(showCents) {
    const fractionDigits = showCents !== false ? 2 : 0;
    const options = defaultCurrencyOptions(fractionDigits);
    const formats = [
        ['arg', 'ARS'],
        ['chl', 'CLP'],
        ['es-AR', 'ARS'],
        ['es-CL', 'CLP']
    ];
    formats.forEach(([locale, currency]) => {
        i18n.global.mergeNumberFormat(locale, {
            currency: { style: 'currency', currency, ...options }
        });
    });
}

/**
 * Vue I18n's injected `$n` ignores app.config.globalProperties overrides.
 * Patch i18n.global.n so currency uses a real BCP-47 locale (es-AR → "$").
 */
export function installCurrencyNumberFormat() {
    const originalN = i18n.global.n.bind(i18n.global);
    i18n.global.n = (value, keyOrOptions, localeOrValues, ...rest) => {
        const isCurrencyKey = keyOrOptions === 'currency';
        const isCurrencyObject =
            keyOrOptions &&
            typeof keyOrOptions === 'object' &&
            (keyOrOptions.key === 'currency' ||
                keyOrOptions.style === 'currency');

        if (!isCurrencyKey && !isCurrencyObject) {
            return originalN(value, keyOrOptions, localeOrValues, ...rest);
        }

        const appLocale = i18n.global.locale;
        const intlLocale = appLocaleToBCP47[appLocale] || appLocale;

        if (isCurrencyKey) {
            // n(value, 'currency') or n(value, 'currency', locale)
            return originalN(value, 'currency', intlLocale);
        }

        return originalN(value, {
            ...keyOrOptions,
            key: keyOrOptions.key || 'currency',
            locale: keyOrOptions.locale || intlLocale
        });
    };
}

installCurrencyNumberFormat();

export default i18n;
