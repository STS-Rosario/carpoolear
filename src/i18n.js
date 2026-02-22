import { createI18n } from 'vue-i18n';
import messages from './language/i18n';

export const i18n = createI18n({
    legacy: false,
    locale: 'arg',
    fallbackLocale: 'arg',
    messages,
    missingWarn: false,
    fallbackWarn: false,
    numberFormats: {
        arg: {
            currency: {
                style: 'currency',
                currency: 'ARS',
                currencyDisplay: 'symbol'
            }
        },
        chl: {
            currency: {
                style: 'currency',
                currency: 'CHL',
                currencyDisplay: 'symbol'
            }
        }
    }
});
