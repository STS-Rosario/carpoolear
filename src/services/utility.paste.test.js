import { describe, expect, it, vi } from 'vitest';
import {
    extractDigits,
    getClipboardPlainText,
    handleDigitsOnlyPaste
} from './utility.js';

function createInput(value = '', maxLength = 20) {
    const listeners = [];
    const input = {
        tagName: 'INPUT',
        value,
        maxLength,
        selectionStart: value.length,
        selectionEnd: value.length,
        setSelectionRange: vi.fn(),
        addEventListener: (event, fn) => {
            if (event === 'input') {
                listeners.push(fn);
            }
        },
        dispatchEvent: () => {
            listeners.forEach((fn) => fn());
            return true;
        }
    };
    return input;
}

function createPasteEvent(clipboard, input) {
    return {
        type: 'paste',
        preventDefault: vi.fn(),
        target: input,
        clipboardData: {
            getData: (type) => (type === 'text/plain' || type === 'Text' ? clipboard : '')
        }
    };
}

describe('extractDigits', () => {
    it('strips formatting from phone strings', () => {
        expect(extractDigits('+5493415551234')).toBe('5493415551234');
        expect(extractDigits('341 555 1234')).toBe('3415551234');
    });
});

describe('getClipboardPlainText', () => {
    it('reads text/plain from clipboardData', () => {
        const event = { clipboardData: { getData: () => '+54 341' } };
        expect(getClipboardPlainText(event)).toBe('+54 341');
    });
});

describe('handleDigitsOnlyPaste', () => {
    it('inserts digits from formatted clipboard text', () => {
        const input = createInput('');
        const dispatched = vi.fn();
        input.addEventListener('input', dispatched);

        const event = createPasteEvent('+5493415551234', input);
        expect(handleDigitsOnlyPaste(event)).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(input.value).toBe('5493415551234');
        expect(dispatched).toHaveBeenCalled();
    });

    it('respects maxlength', () => {
        const input = createInput('', 8);
        const event = createPasteEvent('+5493415551234', input);
        handleDigitsOnlyPaste(event);
        expect(input.value).toBe('54934155');
    });

    it('returns false when clipboard has no digits', () => {
        const input = createInput('123');
        const event = createPasteEvent('abc', input);
        expect(handleDigitsOnlyPaste(event)).toBe(false);
        expect(input.value).toBe('123');
    });
});
