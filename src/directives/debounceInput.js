import { debounce } from '../services/utility';

let debounceFunction = null;
const inputHandler = debounce(function () {
    if (debounceFunction) debounceFunction();
}, 800);

export default {
    beforeMount: function (el, binding) {
        debounceFunction = binding.value;
        el.addEventListener('input', inputHandler, false);
    },
    unmounted: function (el) {
        el.removeEventListener('input', inputHandler, false);
    }
};
