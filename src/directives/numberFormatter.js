import { eventNumberKeyInput, isDigit } from '../services/utility';

let numberFormatter = {};
let inputHandler = function (event) {
    // On mobile, filter out non-numeric characters as a fallback
    // since keydown might not prevent them
    let currentValue = this.value;
    let numericOnly = currentValue.replace(/[^\d]/g, '');
    
    // Apply max length limit
    const maxLength = parseInt(numberFormatter[this.id].el.dataset.maxLength) || 999;
    if (numericOnly.length > maxLength) {
        numericOnly = numericOnly.slice(0, maxLength);
    }
    
    // Only update if value changed (to avoid infinite loops)
    if (currentValue !== numericOnly) {
        this.value = numericOnly;
    }
    
    // Store selection position before formatting (if available)
    let position = (typeof this.selectionStart === 'number') ? this.selectionStart : null;
    let dots = countDots(this.value);
    
    formatNumber(this.id);
    
    // Restore cursor position after formatting (if available)
    if (position !== null && typeof this.setSelectionRange === 'function') {
        let modifyer = countDots(this.value) - dots;
        let newPosition = Math.min(position + modifyer, this.value.length);
        // Use setTimeout to ensure the value is set before moving cursor
        setTimeout(() => {
            this.setSelectionRange(newPosition, newPosition);
        }, 0);
    }
};

let cleanDots = function (str) {
    if (!str) return '';
    return str.replace(/\./g, '');
};

let countDots = function (str) {
    if (!str) return 0;
    return str.split('.').length - 1;
};

let formatNumber = function (id) {
    if (!numberFormatter[id] || !numberFormatter[id].el) {
        return;
    }
    
    numberFormatter[id].rawValue = cleanDots(numberFormatter[id].el.value);

    // More reliable method: reverse the string, add dots every 3 chars, then reverse back
    // This ensures dots are always placed correctly from right to left
    let reversed = numberFormatter[id].rawValue.split('').reverse().join('');
    let withDots = reversed.replace(/(\d{3})(?=\d)/g, '$1.');
    numberFormatter[id].value = withDots.split('').reverse().join('');

    numberFormatter[id].el.value = numberFormatter[id].value;
    if (numberFormatter[id].context && numberFormatter[id].expression) {
        numberFormatter[id].context[numberFormatter[id].expression] =
            numberFormatter[id].rawValue;
    }
};

/* This prevent insert chars, that are not numbers */
let keyDownHandler = function (event) {
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
        let position = (typeof this.selectionStart === 'number') ? this.selectionStart : 0;
        if (event.key.toUpperCase() === 'BACKSPACE') {
            if (this.selectionStart !== 0) {
                position--;
            } else {
                return;
            }
        }
        if (this.value[position] === '.') {
            if (event.key.toUpperCase() === 'BACKSPACE') {
                if (typeof this.setSelectionRange === 'function') {
                    this.setSelectionRange(position, position);
                }
            } else if (event.key.toUpperCase() === 'DELETE') {
                if (typeof this.setSelectionRange === 'function') {
                    this.setSelectionRange(position + 2, position + 2);
                }
            }
        }
    }
};

/* Handle paste events - clean and format pasted content */
let pasteHandler = function (event) {
    event.preventDefault();
    let pastedText = '';
    
    if (event.clipboardData && event.clipboardData.getData) {
        pastedText = event.clipboardData.getData('text/plain');
    } else if (window.clipboardData && window.clipboardData.getData) {
        pastedText = window.clipboardData.getData('Text');
    }
    
    // Extract only numbers from pasted text
    let numericOnly = pastedText.replace(/[^\d]/g, '');
    
    // Apply max length limit
    const maxLength = parseInt(numberFormatter[this.id].el.dataset.maxLength) || 999;
    if (numericOnly.length > maxLength) {
        numericOnly = numericOnly.slice(0, maxLength);
    }
    
    // Get current selection
    let start = (typeof this.selectionStart === 'number') ? this.selectionStart : 0;
    let end = (typeof this.selectionEnd === 'number') ? this.selectionEnd : 0;
    let currentValue = this.value;
    
    // Replace selected text with pasted numeric value
    let newValue = currentValue.slice(0, start) + numericOnly + currentValue.slice(end);
    // Remove all dots and non-numeric characters
    newValue = newValue.replace(/[^\d]/g, '');
    
    // Apply max length again after combining
    if (newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
    }
    
    this.value = newValue;
    
    // Format the number
    formatNumber(this.id);
    
    // Set cursor position after paste
    if (typeof this.setSelectionRange === 'function') {
        let newPosition = Math.min(start + numericOnly.length, this.value.length);
        setTimeout(() => {
            this.setSelectionRange(newPosition, newPosition);
        }, 0);
    }
};

/* Handle beforeinput for better mobile support */
let beforeInputHandler = function (event) {
    // Prevent non-numeric input on mobile
    if (event.inputType === 'insertText' || event.inputType === 'insertCompositionText') {
        const text = event.data || '';
        if (text && !/^\d+$/.test(text)) {
            event.preventDefault();
            return false;
        }
        // Check max length
        const maxLength = parseInt(this.dataset.maxLength) || 999;
        const currentNumericLength = cleanDots(this.value).length;
        if (currentNumericLength >= maxLength) {
            event.preventDefault();
            return false;
        }
    }
};

export default {
    bind: function (el, binding, node) {
        // Ensure element has an ID (required for the directive to work)
        if (!el.id) {
            console.warn('numberMask directive requires element to have an id attribute');
            return;
        }
        
        numberFormatter[el.id] = {};
        numberFormatter[el.id].name = el.id;
        numberFormatter[el.id].value = el.value || '';
        numberFormatter[el.id].rawValue = '';
        numberFormatter[el.id].el = el;
        numberFormatter[el.id].context = node.context;
        numberFormatter[el.id].expression = binding.value;
        
        // Format initial value if present
        if (el.value && el.value.length > 0) {
            formatNumber(el.id);
        }
        
        // Add event listeners
        el.addEventListener('keydown', keyDownHandler, false);
        el.addEventListener('input', inputHandler, false);
        el.addEventListener('paste', pasteHandler, false);
        
        // Add beforeinput for better mobile support (if available)
        // Store reference for cleanup
        if (typeof InputEvent !== 'undefined' && 'inputType' in InputEvent.prototype) {
            numberFormatter[el.id].beforeInputHandler = beforeInputHandler;
            el.addEventListener('beforeinput', beforeInputHandler, false);
        }
    },
    update: function (el, binding, node) {
        // Update context and expression if they changed
        if (numberFormatter[el.id]) {
            numberFormatter[el.id].context = node.context;
            numberFormatter[el.id].expression = binding.value;
        }
        
        // Always format the number when the directive updates
        // This ensures proper formatting even after form submission errors
        if (el.value && el.value.length > 0) {
            formatNumber(el.id);
        }
    },
    unbind: function (el, binding, node) {
        if (!el.id || !numberFormatter[el.id]) {
            return;
        }
        
        el.removeEventListener('keydown', keyDownHandler, false);
        el.removeEventListener('input', inputHandler, false);
        el.removeEventListener('paste', pasteHandler, false);
        
        // Remove beforeinput handler if it was added
        if (numberFormatter[el.id].beforeInputHandler) {
            el.removeEventListener('beforeinput', numberFormatter[el.id].beforeInputHandler, false);
        }
        
        // Clean up
        numberFormatter[el.id] = undefined;
    }
};
