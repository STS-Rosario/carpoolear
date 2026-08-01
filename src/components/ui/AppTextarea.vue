<template>
    <div class="app-input" :class="wrapperClasses">
        <label v-if="hasLabel" :for="controlId" class="app-input__label">
            <slot name="label">{{ label }}</slot>
        </label>
        <div class="app-input__control-wrap">
            <textarea
                ref="textareaEl"
                v-jump
                :id="controlId"
                class="app-input__control"
                :class="controlClass"
                :disabled="disabled"
                :rows="rows"
                :value="modelValue"
                v-bind="textareaAttrs"
                @input="onInput"
            ></textarea>
        </div>
        <p
            v-if="displayMessage"
            class="app-input__hint"
            :class="{ 'app-input__hint--error': hasError }"
        >
            {{ displayMessage }}
        </p>
    </div>
</template>

<script>
let appTextareaId = 0;

export default {
    name: 'AppTextarea',
    inheritAttrs: false,
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        hint: {
            type: String,
            default: ''
        },
        error: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        },
        rows: {
            type: [String, Number],
            default: 4
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            generatedId: `app-textarea-${++appTextareaId}`
        };
    },
    computed: {
        controlId() {
            return this.id || this.generatedId;
        },
        hasLabel() {
            return Boolean(this.label || this.$slots.label);
        },
        hasError() {
            return Boolean(this.error);
        },
        displayMessage() {
            return this.error || this.hint;
        },
        textareaAttrs() {
            const { class: _class, ...attrs } = this.$attrs;
            return attrs;
        },
        controlClass() {
            const classes = [];
            if (this.$attrs.class) {
                classes.push(this.$attrs.class);
            }
            if (this.hasError) {
                classes.push('has-error');
            }
            return classes;
        },
        wrapperClasses() {
            return {
                'app-input--error': this.hasError,
                'app-input--disabled': this.disabled
            };
        }
    },
    methods: {
        onInput(event) {
            this.$emit('update:modelValue', event.target.value);
        },
        focus() {
            this.$refs.textareaEl?.focus();
        }
    }
};
</script>
