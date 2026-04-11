import { debounce } from '../services/utility';

let debounceFunction = null;
const inputHandler = debounce(function () {
    debounceFunction();
}, 800);

export default {
    beforeMount: function (el, binding, node) {
        debounceFunction = binding.value;
        el.addEventListener('input', inputHandler, false);
    },
    unmounted: function (el, binding, node) {
        el.removeEventListener('input', inputHandler, false);
    }
};
