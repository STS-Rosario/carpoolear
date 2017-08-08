let jumpers = {};
let keyHandler = function (event) {
    if ((event.type.toUpperCase() === 'KEYUP' && event.key.toUpperCase() === 'ENTER') || event.type.toUpperCase() === 'CLICK') {
        let target = jumpers[this.id].target;
        if (jumpers[this.id].modifiers.blur) {
            jumpers[this.id].el.blur();
        }
        target[jumpers[this.id].arg]();
    }
};

let getJumperData = function (el, binding, node) {
    console.log('binding', el.id);
    jumpers[el.id] = {};
    jumpers[el.id].name = el.id;
    jumpers[el.id].value = binding.value;
    jumpers[el.id].arg = binding.arg;
    jumpers[el.id].el = el;
    jumpers[el.id].modifiers = binding.modifiers;
    el.addEventListener('keyup', keyHandler, false);
    if (el.tagName.toUpperCase() === 'BUTTON') {
        el.addEventListener('click', keyHandler, false);
    }
};

export default {
    bind: function (el, binding, node) {
        getJumperData(el, binding, node);
    },
    inserted: function (el, binding, node) {
        console.log('inserting', el.id);
        if (jumpers[el.id] === undefined) {
            getJumperData(el, binding, node);
        }
        jumpers[el.id].target = node.context.$refs[jumpers[el.id].value];
        if (!jumpers[el.id].target || jumpers[el.id].target === '') {
            jumpers[el.id].target = jumpers[el.id].el;
        }
    },
    unbind: function (el, binding, node) {
        console.log('unbinding', el.id);
        el.removeEventListener('keyup', keyHandler, false);
        if (el.tagName === 'button') {
            el.removeEventListener('click', keyHandler, false);
        }
        jumpers[el.id] = undefined;
    }
};
