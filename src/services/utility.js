export function today () {
    let _today = new Date();
    let dd = _today.getDate();
    let mm = _today.getMonth() + 1;
    let yyyy = _today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
}

export function getRoute (value, subRoute = '') {
    if (!subRoute) {
        subRoute = '';
    }

    if (value && value.length) {
        return process.env.API_URL + subRoute + value;
    } else {
        return process.env.ROUTE_BASE + 'static/img/default-profile.png';
    }
}

export function inputIsNumber (event) {
    console.log(event.type);
    if (event.type.toUpperCase() === 'KEYDOWN') {
        if (!eventNumberKeyInput(event)) {
            event.preventDefault();
            return event;
        }
    } else if (event.type.toUpperCase() === 'PASTE') {
        if (!eventNumberPaste(event)) {
            event.preventDefault();
            return false;
        };
    }
}

export function isDigit (code) {
    let stringCode = String.fromCharCode(code);
    return /^\d$/.test(stringCode);
}

export function isNumber (variable) {
    return /^\d+$/.test(variable);
}

export function eventNumberKeyInput (event) {
    if (event.ctrlKey || event.altKey ||
        (event.keyCode > 47 && event.keyCode < 58 && event.shiftKey === false) ||
        (event.keyCode > 95 && event.keyCode < 106) ||
        (event.keyCode === 8) || (event.keyCode === 9) ||
        (event.keyCode > 34 && event.keyCode < 40) ||
        (event.keyCode === 46)) {
        return true;
    } else {
        return false;
    }
}

export function eventNumberPaste (event) {
    if (clipboardIsNumeric(event)) {
        return true;
    } else {
        return false;
    }
}

export function clipboardIsNumeric (event) {
    var clipboardData = (event.clipboardData) ? event.clipboardData.getData('Text') : window.clipboardData.getData('Text');
    var isNumber = /^\d+$/.test(clipboardData);
    return (isNumber);
}

export function debounce (func, wait, immediate) {
    let timeout;
    return function () {
        let context = this;
        let args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
