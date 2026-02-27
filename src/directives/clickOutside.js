export default {
    beforeMount: function (el, binding) {
        el.event = function (event) {
            if (
                !(
                    (el.id === event.target.id && el.id !== null) ||
                    el.contains(event.target)
                )
            ) {
                binding.value(event, el);
            }
        };
        document.body.addEventListener('click', el.event);
    },
    unmounted: function (el) {
        document.body.removeEventListener('click', el.event);
    }
};
