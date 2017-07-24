let jumpers = {};
let keyHandler = function (key) {
    if (key.key === 'Enter') {
        let target = jumpers[this.id].target;
        if (jumpers[this.id].modifiers.blur) {
            jumpers[this.id].el.blur();
        }
        target[jumpers[this.id].arg]();
    }
};

export default {
    bind: function (el, binding, node) {
        jumpers[el.id] = {};
        jumpers[el.id].name = el.id;
        jumpers[el.id].value = binding.value;
        jumpers[el.id].arg = binding.arg;
        jumpers[el.id].el = el;
        jumpers[el.id].modifiers = binding.modifiers;
        el.addEventListener('keyup', keyHandler, false);
    },
    inserted: function (el, binding, node) {
        jumpers[el.id].target = node.context.$refs[jumpers[el.id].value];
        if (!jumpers[el.id].target || jumpers[el.id].target === '') {
            jumpers[el.id].target = jumpers[el.id].el;
        }
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('keyup', keyHandler, false);
        jumpers[el.id] = undefined;
    }
};
