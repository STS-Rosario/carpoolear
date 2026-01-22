import { getRoute } from '../services/utility';

function changePhoto(el, binding, node) {
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
    inserted: function (el, binding, node) {
        changePhoto(el, binding, node);
    },
    update: function (el, binding, node) {
        changePhoto(el, binding, node);
    },
    unbind: function (el, binding, node) {
        el.style.backgroundImage = null;
    }
};
