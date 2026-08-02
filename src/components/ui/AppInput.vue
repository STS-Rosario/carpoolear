<template>
    <div class="app-input" :class="wrapperClasses">
        <label v-if="hasLabel" :for="controlId" class="app-input__label">
            <slot name="label">{{ label }}</slot>
        </label>
        <div
            class="app-input__control-wrap"
            :class="{
                'app-input__control-wrap--password': password,
                'app-input__control-wrap--icon-left': hasIconLeft,
                'app-input__control-wrap--action-right': hasActionRight
            }"
        >
            <span v-if="hasIconLeft" class="app-input__icon" aria-hidden="true">
                <slot name="iconLeft">
                    <i v-if="iconLeft" :class="iconLeft"></i>
                    <img v-else-if="iconImage" :src="iconImage" alt="" />
                </slot>
            </span>
            <input
                ref="inputEl"
                v-jump
                :id="controlId"
                class="app-input__control"
                :class="controlClass"
                :type="resolvedType"
                :disabled="disabled"
                :value="modelValue"
                v-bind="inputAttrs"
                @input="onInput"
            />
            <button
                v-if="password"
                type="button"
                class="app-input__toggle"
                :aria-label="showPassword ? hidePasswordLabel : showPasswordLabel"
                @click="togglePasswordVisibility"
            >
                <i
                    class="fa"
                    :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                    aria-hidden="true"
                ></i>
            </button>
            <div v-if="hasActionRight" class="app-input__action-right">
                <slot name="actionRight" />
            </div>
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
let appInputId = 0;

export default {
    name: 'AppInput',
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
        password: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        },
        showPasswordLabel: {
            type: String,
            default: 'Show password'
        },
        hidePasswordLabel: {
            type: String,
            default: 'Hide password'
        },
        iconLeft: {
            type: String,
            default: ''
        },
        iconImage: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            generatedId: `app-input-${++appInputId}`,
            showPassword: false
        };
    },
    computed: {
        controlId() {
            return this.id || this.generatedId;
        },
        hasLabel() {
            return Boolean(this.label || this.$slots.label);
        },
        hasIconLeft() {
            return Boolean(
                this.iconLeft || this.iconImage || this.$slots.iconLeft
            );
        },
        hasActionRight() {
            return Boolean(this.$slots.actionRight);
        },
        hasError() {
            return Boolean(this.error);
        },
        displayMessage() {
            return this.error || this.hint;
        },
        resolvedType() {
            if (!this.password) {
                return this.$attrs.type || 'text';
            }
            return this.showPassword ? 'text' : 'password';
        },
        inputAttrs() {
            const { class: _class, type: _type, ...attrs } = this.$attrs;
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
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        focus() {
            this.$refs.inputEl?.focus();
        }
    }
};
</script>
