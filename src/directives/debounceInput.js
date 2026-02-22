import { debounce } from '../services/utility';

export default {
    beforeMount: function (el, binding) {
        el._debounceHandler = debounce(function () {
            binding.value();
        }, 800);
        el.addEventListener('input', el._debounceHandler, false);
    },
    unmounted: function (el) {
        el.removeEventListener('input', el._debounceHandler, false);
    }
};
