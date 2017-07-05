import { getRoute } from '../services/utility';

export default {
    inserted: function (el, binding, node) {
        let arg;
        if (binding.arg === 'profile') {
            arg = '/image/profile/';
        }
        if (binding.arg === 'conversation') {
            arg = null;
        }
        el.style.backgroundImage = 'url(' + getRoute(binding.value, arg) + ')';
    }
};
