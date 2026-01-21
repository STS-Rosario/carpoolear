/**
 * Mixin for National ID (NID) formatting
 * Provides computed property and methods for formatting national ID numbers
 * Format: A999999 999999A (1 letter + 6 numbers, space, 6 numbers + 1 letter)
 * First and last characters must be capital letters
 * The rest must be numbers
 * Supports up to 14 characters (stored as raw value)
 */
export default {
    computed: {
        // Computed property for NID with space in the middle
        dniFormatted: {
            get() {
                // Get the NID value from the component's data
                // Components using this mixin should have a property path like 'user.nro_doc' or 'newInfo.nro_doc'
                const dniValue = this.getDniValue();
                if (!dniValue) {
                    return '';
                }
                const rawValue = String(dniValue);
                // Format: A999999 999999A (1 letter + 6 numbers, space, 6 numbers + 1 letter)
                if (rawValue.length > 7) {
                    return rawValue.slice(0, 7) + ' ' + rawValue.slice(7, 14);
                }
                return rawValue;
            },
            set(value) {
                // Set the NID value in the component's data
                // Strip all non-alphanumeric characters and store raw value
                const rawValue = String(value || '').replace(/[^a-zA-Z0-9]/g, '');
                // Limit to 14 characters
                const limitedValue = rawValue.slice(0, 14);
                
                // Capitalize letters at first and last positions
                let formattedValue = '';
                for (let i = 0; i < limitedValue.length; i++) {
                    const char = limitedValue[i];
                    // First and last positions must be capital letters
                    if (i === 0 || i === 13) {
                        if (/[a-zA-Z]/.test(char)) {
                            formattedValue += char.toUpperCase();
                        }
                    } else {
                        // Other positions must be numbers
                        if (/[0-9]/.test(char)) {
                            formattedValue += char;
                        }
                    }
                }
                
                this.setDniValue(formattedValue);
            }
        }
    },
    methods: {
        /**
         * Get the NID value from component data
         * Components should override this method to specify the path to their NID field
         * @returns {string} The NID value
         */
        getDniValue() {
            // Default implementation - components should override
            if (this.user && this.user.nro_doc) {
                return this.user.nro_doc;
            }
            if (this.newInfo && this.newInfo.nro_doc) {
                return this.newInfo.nro_doc;
            }
            return '';
        },
        /**
         * Set the NID value in component data
         * Components should override this method to specify the path to their NID field
         * @param {string} value - The raw NID value to set
         */
        setDniValue(value) {
            // Default implementation - components should override
            if (this.user) {
                this.user.nro_doc = value;
            } else if (this.newInfo) {
                this.newInfo.nro_doc = value;
            }
        },
        /**
         * Format NID with space in the middle
         * @param {string} value - The raw NID value to format
         * @returns {string} The formatted NID value (AAAAAAA AAAAAAA)
         */
        formatDni(value) {
            if (!value) return '';
            const rawValue = String(value);
            // Format: AAAAAAA AAAAAAA (7 chars + space + 7 chars)
            if (rawValue.length > 7) {
                return rawValue.slice(0, 7) + ' ' + rawValue.slice(7, 14);
            }
            return rawValue;
        },
        /**
         * Handle NID input - format with space in the middle
         * @param {Event} event - The input event
         */
        handleDniInput(event) {
            const input = event.target;
            const cursorPos = input.selectionStart || 0;
            const oldValue = input.value;

            // Get the formatted NID value
            const formattedValue = this.dniFormatted;

            // Only update display if value changed
            if (oldValue !== formattedValue) {
                input.value = formattedValue;

                // Adjust cursor position for the space insertion
                // If cursor is after position 7, add 1 for the space
                this.$nextTick(() => {
                    let newCursorPos = cursorPos;
                    if (cursorPos > 7) {
                        newCursorPos = Math.min(cursorPos + 1, formattedValue.length);
                    } else {
                        newCursorPos = Math.min(cursorPos, formattedValue.length);
                    }
                    if (input.setSelectionRange) {
                        input.setSelectionRange(newCursorPos, newCursorPos);
                    }
                });
            }
        },
        /**
         * Handle NID keydown - allow letters at first and last positions, numbers elsewhere
         * @param {Event} event - The keydown event
         */
        handleDniKeydown(event) {
            // Allow: backspace, delete, tab, escape, enter, and arrow keys
            if (
                [8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(event.keyCode) !==
                    -1 ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (event.keyCode === 65 && event.ctrlKey === true) ||
                (event.keyCode === 67 && event.ctrlKey === true) ||
                (event.keyCode === 86 && event.ctrlKey === true) ||
                (event.keyCode === 88 && event.ctrlKey === true)
            ) {
                return;
            }
            // Get current NID value and cursor position
            const dniValue = this.getDniValue();
            const rawValue = dniValue ? String(dniValue) : '';
            const input = event.target;
            const cursorPos = input.selectionStart || 0;
            
            // Determine if current position should be a letter or number
            // Format: A999999 999999A (1 letter + 6 numbers, space, 6 numbers + 1 letter)
            // In raw value (without space): position 0 = letter, positions 1-6 = numbers, positions 7-12 = numbers, position 13 = letter
            // In displayed value (with space): position 0 = letter, positions 1-6 = numbers, position 7 = space, positions 8-13 = numbers, position 14 = letter
            const rawCursorPos = cursorPos > 7 ? cursorPos - 1 : cursorPos;
            const isFirstPosition = rawCursorPos === 0;
            const isLastPosition = rawCursorPos === 13;
            
            // Check if input is valid for current position
            const isNumber = (
                !event.shiftKey &&
                event.keyCode >= 48 &&
                event.keyCode <= 57
            ) || (event.keyCode >= 96 && event.keyCode <= 105);
            const isLetter = event.keyCode >= 65 && event.keyCode <= 90;

            // First and last positions must be letters, others must be numbers
            if (isFirstPosition || isLastPosition) {
                if (!isLetter) {
                    event.preventDefault();
                    return;
                }
            } else {
                if (!isNumber) {
                    event.preventDefault();
                    return;
                }
            }
            
            // Check max length
            if (
                rawValue &&
                String(rawValue).length >= 14 &&
                !([8, 46, 37, 39].indexOf(event.keyCode) !== -1)
            ) {
                event.preventDefault();
            }
        },
        /**
         * Handle NID paste - clean and format pasted content
         * Format: A999999 999999A (first and last characters are capital letters, rest are numbers)
         * @param {Event} event - The paste event
         */
        handleDniPaste(event) {
            event.preventDefault();
            const pastedText = (
                event.clipboardData || window.clipboardData
            ).getData('text');
            // Remove any non-alphanumeric characters
            const alphanumericOnly = pastedText.replace(/[^a-zA-Z0-9]/g, '');
            
            // Format: A999999 999999A (first and last characters are capital letters, rest are numbers)
            let formattedValue = '';
            for (let i = 0; i < Math.min(alphanumericOnly.length, 14); i++) {
                const char = alphanumericOnly[i];
                // First and last positions must be letters
                if (i === 0 || i === 13) {
                    if (/[a-zA-Z]/.test(char)) {
                        formattedValue += char.toUpperCase();
                    }
                } else {
                    // Other positions must be numbers
                    if (/[0-9]/.test(char)) {
                        formattedValue += char;
                    }
                }
            }
            
            // Set the computed property which will validate it automatically
            this.dniFormatted = formattedValue;
        },
        /**
         * Clean NID value (returns as-is since no formatting is applied)
         * @param {string} value - The NID value to clean
         * @returns {string} The cleaned NID value (unchanged)
         */
        cleanDniValue(value) {
            if (!value) return '';
            // Remove any non-alphanumeric characters that might have been added
            return String(value).replace(/[^a-zA-Z0-9]/g, '');
        }
    }
};
