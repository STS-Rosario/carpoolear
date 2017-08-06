import { eventNumberKeyInput, eventNumberPaste, isDigit } from '../services/utility';

let numberFormatter = {};
let keyDownHandler = function (event) {
    if (!eventNumberKeyInput(event) || (isDigit(event.keyCode) && numberFormatter[this.id].rawValue.length + 1 > numberFormatter[this.id].el.dataset.maxLength)) {
        event.preventDefault();
        return false;
    } else {
        formatNumber(this.id);
    }
};

let keyUpHandler = function (event) {
    if (eventNumberKeyInput(event)) {
        formatNumber(this.id);
    }
};

let pasteHandler = function (event) {
    if (!eventNumberPaste(event)) {
        event.preventDefault();
        return false;
    } else {
        formatNumber(this.id);
    }
};

let formatNumber = function (id) {
    numberFormatter[id].rawValue = numberFormatter[id].el.value.replace(/\./g, '');
    numberFormatter[id].value = numberFormatter[id].rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    numberFormatter[id].el.value = numberFormatter[id].value;
    numberFormatter[id].context[numberFormatter[id].expression] = numberFormatter[id].rawValue;
};

export default {
    bind: function (el, binding, node) { 
        numberFormatter[el.id] = {};
        numberFormatter[el.id].name = el.id;
        numberFormatter[el.id].value = el.value;
        numberFormatter[el.id].rawValue = '';
        numberFormatter[el.id].el = el;
        numberFormatter[el.id].context = node.context;
        numberFormatter[el.id].expression = binding.value;
        if (el.value.length > 0) {
            formatNumber(el.id);
        }
        el.addEventListener('keyup', keyUpHandler, false);
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('paste', pasteHandler, false);
    },
    update: function (el, binding, node) {
        if (el.value.length > 0) {
            formatNumber(el.id);
        }
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('keyup', keyUpHandler, false);
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('paste', pasteHandler, false);
        numberFormatter[el.id] = undefined;
    }
};
