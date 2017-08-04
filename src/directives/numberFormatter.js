import { eventNumberKeyInput, eventNumberPaste, isDigit } from '../services/utility';

let numberFormatter = {};
let keyDownHandler = function (event) {
    console.log(numberFormatter[this.id].rawValue.length, numberFormatter[this.id].el.dataset.maxLength, numberFormatter[this.id].value.length, numberFormatter[this.id].el.value.length, isDigit(event.keyCode));
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
    console.log(numberFormatter[id].rawValue);
    numberFormatter[id].value = numberFormatter[id].rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    console.log(numberFormatter[id].value);
    numberFormatter[id].el.value = numberFormatter[id].value;
    numberFormatter[id].context[numberFormatter[id].expression] = numberFormatter[id].rawValue;
};

export default {
    bind: function (el, binding, node) {
        console.log(binding);
        numberFormatter[el.id] = {};
        numberFormatter[el.id].name = el.id;
        numberFormatter[el.id].value = '';
        numberFormatter[el.id].rawValue = '';
        numberFormatter[el.id].el = el;
        numberFormatter[el.id].context = node.context;
        numberFormatter[el.id].expression = binding.value;
        el.addEventListener('keyup', keyUpHandler, false);
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('paste', pasteHandler, false);
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('keyup', keyUpHandler, false);
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('paste', pasteHandler, false);
        numberFormatter[el.id] = undefined;
    }
};
