import { eventNumberKeyInput, isDigit } from '../services/utility';

const numberFormatter = {};
const inputHandler = function (event) {
    const position = this.selectionStart;
    const dots = countDots(this.value);
    if (
        cleanDots(this.value).length + 1 >
        numberFormatter[this.id].el.dataset.maxLength
    ) {
        this.value = cleanDots(this.value).slice(
            0,
            numberFormatter[this.id].el.dataset.maxLength
        );
    }
    formatNumber(this.id);
    const modifyer = countDots(this.value) - dots;
    this.selectionEnd = position + modifyer;
};

const cleanDots = function (str) {
    return str.replace(/\/$/, '');
};

const countDots = function (str) {
    return str.split('/').length - 1;
};

const formatNumber = function (id) {
    numberFormatter[id].rawValue = cleanDots(numberFormatter[id].el.value);
    numberFormatter[id].value = numberFormatter[id].rawValue.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        '$1/$2/$3'
    );
    numberFormatter[id].el.value = numberFormatter[id].value;
    // Trigger input event so Vue's v-model picks up the formatted value
    numberFormatter[id].el.dispatchEvent(new Event('input', { bubbles: true }));
};

/* This prevent insert chars, that are not numbers */
const keyDownHandler = function (event) {
    if (
        !eventNumberKeyInput(event) ||
        (isDigit(event.keyCode) &&
            numberFormatter[this.id].rawValue.length + 1 >
                numberFormatter[this.id].el.dataset.maxLength)
    ) {
        event.preventDefault();
        return false;
    }
    if (
        event.key.toUpperCase() === 'DELETE' ||
        event.key.toUpperCase() === 'BACKSPACE'
    ) {
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
    beforeMount: function (el, binding) {
        numberFormatter[el.id] = {};
        numberFormatter[el.id].name = el.id;
        numberFormatter[el.id].value = el.value;
        numberFormatter[el.id].rawValue = '';
        numberFormatter[el.id].el = el;
        if (el.value.length > 0) {
            formatNumber(el.id);
        }
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('input', inputHandler, false);
    },
    unmounted: function (el) {
        el.removeEventListener('keydown', keyDownHandler, false);
        el.removeEventListener('input', inputHandler, false);
        numberFormatter[el.id] = undefined;
    }
};
