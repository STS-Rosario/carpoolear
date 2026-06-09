import { debounce } from '../services/utility';

export default {
    beforeMount(el, binding) {
        const handler = binding.value;
        const instance = binding.instance;
        const debouncedHandler = debounce(() => {
            if (typeof handler === 'function') {
                handler.call(instance);
            }
        }, 800);
        el.__debounceInputHandler = debouncedHandler;
        el.addEventListener('input', debouncedHandler, false);
    },
    unmounted(el) {
        if (el.__debounceInputHandler) {
            el.removeEventListener('input', el.__debounceInputHandler, false);
            delete el.__debounceInputHandler;
        }
    }
};
