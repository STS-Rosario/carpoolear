import { createI18n } from 'vue-i18n';
import messages from './language/i18n';

// Price format: controlled by config.price_show_cents (default: show cents).
// Set price_show_cents: false in config to hide cents in currency display.
const defaultCurrencyOptions = (fractionDigits = 2) => ({
    style: 'currency',
    currencyDisplay: 'symbol',
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
                currency: 'CHL',
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
        ['chl', 'CHL'],
        ['es-AR', 'ARS'],
        ['es-CL', 'CLP']
    ];
    formats.forEach(([locale, currency]) => {
        i18n.global.mergeNumberFormat(locale, {
            currency: { style: 'currency', currency, ...options }
        });
    });
}

export default i18n;
