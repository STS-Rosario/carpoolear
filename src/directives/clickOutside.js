export default {
    bind: function (el, binding, vnode) {
        el.event = function (event) {
            if (!((el.id === event.target.id && el.id !== null) || el.contains(event.target))) {
                vnode.context[binding.expression](event, el);
            }
        };
        document.body.addEventListener('click', el.event);
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.event);
    }
};
