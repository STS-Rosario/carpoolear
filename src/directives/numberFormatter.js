import { eventNumberKeyInput, isDigit } from '../services/utility';

let numberFormatter = {};
let first = 0;
let inputHandler = function (event) {
    let position = this.selectionStart;
    let dots = countDots(this.value);
    if (cleanDots(this.value).length + 1 > numberFormatter[this.id].el.dataset.maxLength) {
        this.value = cleanDots(this.value).slice(0, numberFormatter[this.id].el.dataset.maxLength);
    }
    formatNumber(this.id);
    let modifyer = countDots(this.value) - dots;
    this.selectionEnd = position + modifyer;
};

let cleanDots = function (str) {
    return str.replace(/\./g, '');
};

let countDots = function (str) {
    return (str.split('.').length - 1);
};

let formatNumber = function (id) {
    numberFormatter[id].rawValue = cleanDots(numberFormatter[id].el.value);
    // cambiar esta regex para que matche 2 6 1 en vez de 3 3 3
    numberFormatter[id].value = numberFormatter[id].rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    numberFormatter[id].el.value = numberFormatter[id].value;
    numberFormatter[id].context[numberFormatter[id].expression] = numberFormatter[id].rawValue;
};

/* This prevent insert chars, that are not numbers */
let keyDownHandler = function (event) {
    if (!eventNumberKeyInput(event) || (isDigit(event.keyCode) && numberFormatter[this.id].rawValue.length + 1 > numberFormatter[this.id].el.dataset.maxLength)) {
        event.preventDefault();
        return false;
    }
    if (event.key.toUpperCase() === 'DELETE' || event.key.toUpperCase() === 'BACKSPACE') {
        let position = this.selectionStart;
        if (event.key.toUpperCase() === 'BACKSPACE') {
            if (this.selectionStart !== 0) {
                position--;
            } else {
                return;
            }
        }
        if (this.value[position] === '.') {
            if (event.key.toUpperCase() === 'BACKSPACE') {
                this.selectionEnd = position;
            } else if (event.key.toUpperCase() === 'DELETE') {
                this.selectionEnd = position + 2;
            }
        }
    }
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
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('input', inputHandler, false);
    },
    update: function (el, binding, node) {
        if (el.value.length > 0 && first < 3) {
            first++;
            formatNumber(el.id);
        }
    },
    unbind: function (el, binding, node) {
        el.removeEventListener('keydown', keyDownHandler, false);
        el.removeEventListener('input', inputHandler, false);
        numberFormatter[el.id] = undefined;
    }
};
