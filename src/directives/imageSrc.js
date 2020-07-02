import { getRoute } from '../services/utility';

function changePhoto (el, binding, node) {
    let arg;
    if (binding.arg === 'profile') {
        arg = '/image/profile/';
    }
    if (binding.arg === 'conversation') {
        arg = null;
    } else {
        arg = '/image/' + binding.arg + '/';
    }
    el.style.backgroundImage = 'url(' + getRoute(binding.value, arg) + ')';
};

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
