<template>
    <div class="catalog-combobox" :class="{ 'is-open': open }">
        <input
            type="text"
            class="form-control catalog-combobox__input"
            :value="displayValue"
            :placeholder="placeholder"
            :disabled="disabled"
            @input="onInput"
            @focus="onInputFocus"
            @blur="onInputBlur"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
            @keydown.enter.prevent="selectHighlighted"
            @keydown.esc.prevent="closeList"
        />
        <ul v-if="open && filteredOptions.length" class="catalog-combobox__list">
            <li
                v-for="(option, index) in filteredOptions"
                :key="option.id || option.value"
                class="catalog-combobox__option"
                :class="{ 'is-highlighted': index === highlightedIndex }"
                @mousedown.prevent="selectOption(option)"
            >
                {{ option.name || option.label }}
            </li>
        </ul>
    </div>
</template>

<script>
import { CATALOG_OTHER_VALUE } from '../../utils/carFields.js';
import { createCatalogComboboxOutsideDismiss } from '../../utils/catalogComboboxDismiss.js';

export default {
    name: 'catalog-combobox',
    props: {
        options: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: [Number, String, null],
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        allowOther: {
            type: Boolean,
            default: true
        },
        otherLabel: {
            type: String,
            default: 'Otro'
        }
    },
    emits: ['update:modelValue', 'other-selected'],
    data() {
        return {
            open: false,
            query: '',
            highlightedIndex: 0
        };
    },
    computed: {
        allOptions() {
            const base = Array.isArray(this.options) ? this.options : [];
            if (!this.allowOther) {
                return base;
            }

            return [
                ...base,
                { id: CATALOG_OTHER_VALUE, name: this.otherLabel }
            ];
        },
        selectedOption() {
            return this.allOptions.find(
                (option) => String(option.id) === String(this.modelValue)
            );
        },
        displayValue() {
            if (this.open) {
                return this.query;
            }

            return this.selectedOption
                ? this.selectedOption.name || this.selectedOption.label
                : '';
        },
        filteredOptions() {
            const q = (this.query || '').trim().toLowerCase();
            if (!q) {
                return this.allOptions;
            }

            return this.allOptions.filter((option) =>
                String(option.name || option.label || '')
                    .toLowerCase()
                    .includes(q)
            );
        }
    },
    watch: {
        modelValue() {
            this.query = '';
        }
    },
    mounted() {
        this.removeOutsideDismiss = createCatalogComboboxOutsideDismiss(
            this.$el,
            () => this.closeList()
        );
    },
    beforeUnmount() {
        if (this.removeOutsideDismiss) {
            this.removeOutsideDismiss();
        }
        this.clearBlurCloseTimer();
    },
    methods: {
        onInputFocus() {
            this.clearBlurCloseTimer();
            this.open = true;
        },
        onInputBlur() {
            this.clearBlurCloseTimer();
            this.blurCloseTimer = window.setTimeout(() => {
                this.closeList();
            }, 0);
        },
        clearBlurCloseTimer() {
            if (this.blurCloseTimer) {
                clearTimeout(this.blurCloseTimer);
                this.blurCloseTimer = null;
            }
        },
        onInput(event) {
            this.query = event.target.value;
            this.open = true;
            this.highlightedIndex = 0;
        },
        selectOption(option) {
            this.$emit('update:modelValue', option.id);
            if (option.id === CATALOG_OTHER_VALUE) {
                this.$emit('other-selected');
            }
            this.query = '';
            this.closeList();
        },
        selectHighlighted() {
            const option = this.filteredOptions[this.highlightedIndex];
            if (option) {
                this.selectOption(option);
            }
        },
        moveHighlight(delta) {
            if (!this.filteredOptions.length) {
                return;
            }

            const max = this.filteredOptions.length - 1;
            let next = this.highlightedIndex + delta;
            if (next < 0) {
                next = max;
            }
            if (next > max) {
                next = 0;
            }
            this.highlightedIndex = next;
        },
        closeList() {
            this.open = false;
            this.highlightedIndex = 0;
            this.query = '';
        }
    }
};
</script>

<style scoped>
.catalog-combobox {
    position: relative;
}

.catalog-combobox__input {
    color: #333;
}

.catalog-combobox__input::placeholder {
    color: var(--soft-font-color, #bbb);
}

.catalog-combobox__list {
    position: absolute;
    z-index: 20;
    left: 0;
    right: 0;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
    color: #333;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.catalog-combobox__option {
    padding: 8px 10px;
    cursor: pointer;
    color: #333;
    background: #fff;
}

.catalog-combobox__option.is-highlighted,
.catalog-combobox__option:hover {
    color: #333;
    background: #f2f6ff;
}
</style>
