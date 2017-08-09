import { debounce } from '../services/utility';

let debounceFunction = null;
let inputHandler = debounce(
    function () {
        debounceFunction();
    },
800);

export default {
    bind: function (el, binding, node) {
        debounceFunction = binding.value;
        el.addEventListener('input', inputHandler, false);
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('input', inputHandler, false);
    }
};
