/**
 * Mixin for DNI (Argentine National ID) formatting
 * Provides computed property and methods for formatting DNI numbers with dots as thousand separators
 * Stores raw values (no dots) in the data model, displays formatted values to users
 */
export default {
    computed: {
        // Computed property for DNI with formatting for display
        dniFormatted: {
            get() {
                // Get the DNI value from the component's data
                // Components using this mixin should have a property path like 'user.nro_doc' or 'newInfo.nro_doc'
                const dniValue = this.getDniValue();
                if (!dniValue) {
                    return '';
                }
                // Ensure we're working with raw value (strip any existing dots)
                const rawValue = String(dniValue).replace(/\./g, '');
                // Format with dots as thousand separators
                return this.formatDni(rawValue);
            },
            set(value) {
                // Set the DNI value in the component's data
                // Strip all non-numeric characters and store raw value
                const rawValue = String(value || '').replace(/[^\d]/g, '');
                // Limit to 8 digits
                const limitedValue = rawValue.slice(0, 8);
                this.setDniValue(limitedValue);
            }
        }
    },
    methods: {
        /**
         * Get the DNI value from component data
         * Components should override this method to specify the path to their DNI field
         * @returns {string} The DNI value
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
         * Set the DNI value in component data
         * Components should override this method to specify the path to their DNI field
         * @param {string} value - The raw DNI value to set
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
         * Format DNI with dots as thousand separators (e.g., 1234567 -> 1.234.567)
         * @param {string} value - The raw DNI value to format
         * @returns {string} The formatted DNI value
         */
        formatDni(value) {
            if (!value) return '';
            const numericOnly = String(value).replace(/\./g, '');
            if (!numericOnly) return '';
            // Reverse, add dots every 3 chars, reverse back
            const reversed = numericOnly.split('').reverse().join('');
            const withDots = reversed.replace(/(\d{3})(?=\d)/g, '$1.');
            return withDots.split('').reverse().join('');
        },
        /**
         * Handle DNI input to preserve cursor position when formatting changes
         * @param {Event} event - The input event
         */
        handleDniInput(event) {
            const input = event.target;
            const cursorPos = input.selectionStart || 0;
            const oldValue = input.value;

            // Extract raw value from what user typed (v-model setter already stored it)
            const dniValue = this.getDniValue();
            const rawValue = dniValue
                ? String(dniValue).replace(/\./g, '')
                : '';
            const formatted = this.formatDni(rawValue);

            // Only update display if formatting changed (to avoid infinite loops)
            if (oldValue !== formatted) {
                // Calculate new cursor position based on numeric characters before cursor
                const numericCharsBeforeCursor = oldValue
                    .substring(0, cursorPos)
                    .replace(/\./g, '').length;
                const newFormattedBeforeCursor = this.formatDni(
                    rawValue.substring(0, numericCharsBeforeCursor)
                );
                const newCursorPos = newFormattedBeforeCursor.length;

                // Update input value
                input.value = formatted;

                // Restore cursor position
                this.$nextTick(() => {
                    if (input.setSelectionRange) {
                        input.setSelectionRange(newCursorPos, newCursorPos);
                    }
                });
            }
        },
        /**
         * Handle DNI keydown - prevent non-numeric input
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
            // Ensure that it is a number and stop the keypress
            if (
                (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
                (event.keyCode < 96 || event.keyCode > 105)
            ) {
                event.preventDefault();
            }
            // Check max length
            const dniValue = this.getDniValue();
            if (
                dniValue &&
                String(dniValue).replace(/\./g, '').length >= 8 &&
                !([8, 46, 37, 39].indexOf(event.keyCode) !== -1)
            ) {
                event.preventDefault();
            }
        },
        /**
         * Handle DNI paste - clean and format pasted content
         * @param {Event} event - The paste event
         */
        handleDniPaste(event) {
            event.preventDefault();
            const pastedText = (
                event.clipboardData || window.clipboardData
            ).getData('text');
            const numericOnly = pastedText.replace(/[^\d]/g, '').slice(0, 8);
            // Set the computed property which will format it automatically
            this.dniFormatted = numericOnly;
        },
        /**
         * Clean DNI value by removing dots (useful before sending to backend)
         * @param {string} value - The DNI value to clean
         * @returns {string} The cleaned DNI value (raw, no dots)
         */
        cleanDniValue(value) {
            if (!value) return '';
            return String(value).replace(/\./g, '');
        }
    }
};
