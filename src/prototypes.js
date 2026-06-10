import {
    cssvar,
    scrollToElement,
    checkError,
    getErrors,
    redirectToIdentityValidationIfRequired
} from './../utils/helpers';

export function installPrototypes(app) {
    app.config.globalProperties.$cssvar = cssvar;
    app.config.globalProperties.$scrollToElement = scrollToElement;
    app.config.globalProperties.$checkError = checkError;
    app.config.globalProperties.$getErrors = getErrors;
    app.config.globalProperties.$redirectToIdentityValidationIfRequired = function () {
        return redirectToIdentityValidationIfRequired(this.$router);
    };
}
