import Vue from 'vue';
import {
    cssvar,
    scrollToElement,
    checkError,
    getErrors,
    redirectToIdentityValidationIfRequired
} from './../utils/helpers';

Vue.prototype.$cssvar = cssvar;
Vue.prototype.$scrollToElement = scrollToElement;
Vue.prototype.$checkError = checkError;
Vue.prototype.$getErrors = getErrors;
Vue.prototype.$redirectToIdentityValidationIfRequired = function () {
    return redirectToIdentityValidationIfRequired(this.$store, this.$router);
};
