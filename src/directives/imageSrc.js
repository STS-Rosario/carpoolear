import { getRoute } from '../services/utility';

function changePhoto(el, binding) {
    let arg;
    if (binding.arg === 'profile') {
        arg = '/image/profile/';
    } else if (binding.arg === 'conversation') {
        arg = null;
    } else if (binding.arg) {
        arg = '/image/' + binding.arg + '/';
    } else {
        arg = null;
    }
    el.style.backgroundImage = 'url(' + getRoute(binding.value, arg) + ')';
}

export default {
    mounted: function (el, binding) {
        changePhoto(el, binding);
    },
    updated: function (el, binding) {
        changePhoto(el, binding);
    },
    unmounted: function (el) {
        el.style.backgroundImage = null;
    }
};
