export function today() {
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

export function getRoute(value, subRoute = '') {
    if (!subRoute) {
        subRoute = '';
    }

    if (value && value.length) {
        return process.env.API_URL + subRoute + value;
    } else {
        return process.env.ROUTE_BASE + 'static/img/default-profile.png';
    }
}

export function inputIsNumber(event) {
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
        }
    }
}

export function isDigit(code) {
    let stringCode = String.fromCharCode(code);
    return /^\d$/.test(stringCode);
}

export function isNumber(variable) {
    return /^\d+$/.test(variable);
}

export function eventNumberKeyInput(event) {
    if (
        event.ctrlKey ||
        event.altKey ||
        (event.keyCode > 47 &&
            event.keyCode < 58 &&
            event.shiftKey === false) ||
        (event.keyCode > 95 && event.keyCode < 106) ||
        event.keyCode === 8 ||
        event.keyCode === 9 ||
        (event.keyCode > 34 && event.keyCode < 40) ||
        event.keyCode === 46
    ) {
        return true;
    } else {
        return false;
    }
}

export function eventNumberPaste(event) {
    if (clipboardIsNumeric(event)) {
        return true;
    } else {
        return false;
    }
}

export function clipboardIsNumeric(event) {
    var clipboardData = event.clipboardData
        ? event.clipboardData.getData('Text')
        : window.clipboardData.getData('Text');
    var isNumber = /^\d+$/.test(clipboardData);
    return isNumber;
}

export function debounce(func, wait, immediate) {
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

export function getCityName(data) {
    let city;
    let province;
    let name;
    if (data.address_components) {
        for (let ind = 0; ind < data.address_components.length; ind++) {
            if (data.address_components[ind].types[0] === 'locality') {
                city = data.address_components[ind].long_name.replace(
                    'Ciudad de ',
                    ''
                );
            } else if (
                data.address_components[ind].types[0] ===
                'administrative_area_level_1'
            ) {
                province = data.address_components[ind].short_name.replace(
                    'Provincia de ',
                    ''
                );
            }
        }
    }
    if (city && province) {
        name = city + ', ' + province;
    } else {
        if (data.formatted_address) {
            name = data.formatted_address;
        } else {
            name = data.name;
        }
        name = name.replace(', Argentina', '');
    }
    return name;
}

/**
 * Format ID based on pattern
 * Pattern: # for numbers, A for letters, other characters are literal separators
 * @param {string} value - The raw ID value to format
 * @param {string} pattern - The pattern to use for formatting (e.g., '##.###.###' or 'AA###AAA')
 * @returns {string} The formatted ID value
 */
export function formatId(value, pattern) {
    const cleaned = String(value || '').replace(/[^a-zA-Z0-9]/g, '');
    
    let formatted = '';
    let cleanedIndex = 0;
    
    for (let i = 0; i < pattern.length && cleanedIndex < cleaned.length; i++) {
        if (pattern[i] === '#') {
            if (/[0-9]/.test(cleaned[cleanedIndex])) {
                formatted += cleaned[cleanedIndex];
                cleanedIndex++;
            } else {
                break;
            }
        } else if (pattern[i] === 'A') {
            if (/[a-zA-Z]/.test(cleaned[cleanedIndex])) {
                formatted += cleaned[cleanedIndex].toUpperCase();
                cleanedIndex++;
            } else {
                break;
            }
        } else {
            formatted += pattern[i];
        }
    }
    
    return formatted;
}

/**
 * Clean ID by removing separators based on pattern
 * @param {string} value - The ID value to clean
 * @param {string} pattern - The pattern used for formatting
 * @returns {string} The cleaned ID value (raw, no separators)
 */
export function cleanId(value, pattern) {
    if (!value) return '';
    // Remove any characters that are separators in the pattern
    const separators = pattern.replace(/[#A]/g, '');
    const separatorRegex = new RegExp('[' + separators.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ']', 'g');
    return String(value).replace(separatorRegex, '');
}
