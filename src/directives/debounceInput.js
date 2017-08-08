import { debounce } from '../services/utility';

let debounceFunction = null;
let inputHandler = debounce(
    function () {
        console.log(debounceFunction);
        debounceFunction();
    },
800);

export default {
    bind: function (el, binding, node) {
        debounceFunction = binding.value;
        console.log(el);
        el.addEventListener('input', inputHandler, false);
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('input', inputHandler, false);
    }
};
