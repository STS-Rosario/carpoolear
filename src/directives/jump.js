let jumpers = {};
let keyHandler = function (key) {
    if (key.key === 'Enter') {
        let next = jumpers[this.id].next;
        jumpers[this.id].el.blur();
        next[jumpers[this.id].arg]();
    }
};

export default {
    bind: function (el, binding, node) {
        jumpers[el.id] = {};
        jumpers[el.id].name = el.id;
        jumpers[el.id].value = binding.value;
        jumpers[el.id].arg = binding.arg;
        jumpers[el.id].el = el;
        el.addEventListener('keyup', keyHandler, false);
    },
    inserted: function (el, binding, node) {
        jumpers[el.id].next = node.context.$refs[jumpers[el.id].value];
        console.log(binding);
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('keyup', keyHandler, false);
        jumpers = {};
    }
};
