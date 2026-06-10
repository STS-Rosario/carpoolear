export function shouldInvokeClickOutside(el, target) {
    if (!el || !target) {
        return false;
    }

    if (el.id && el.id === target.id) {
        return false;
    }

    return !el.contains(target);
}

function invokeClickOutsideHandler(binding, event, el) {
    const handler =
        typeof binding.value === 'function' ? binding.value : null;

    if (handler) {
        handler(event, el);
    }
}

export default {
    mounted(el, binding) {
        const listener = (event) => {
            const currentBinding = el.__clickOutsideBinding || binding;

            if (shouldInvokeClickOutside(el, event.target)) {
                invokeClickOutsideHandler(currentBinding, event, el);
            }
        };

        el.__clickOutsideHandler = listener;
        el.__clickOutsideBinding = binding;
        document.addEventListener('mousedown', listener, true);
    },
    updated(el, binding) {
        el.__clickOutsideBinding = binding;
    },
    unmounted(el) {
        if (el.__clickOutsideHandler) {
            document.removeEventListener(
                'mousedown',
                el.__clickOutsideHandler,
                true
            );
            delete el.__clickOutsideHandler;
            delete el.__clickOutsideBinding;
        }
    }
};
