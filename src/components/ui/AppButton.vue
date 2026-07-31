<template>
    <component
        :is="rootTag"
        :type="rootTag === 'button' ? type : undefined"
        :class="buttonClasses"
        :disabled="isNativeDisabled"
        :aria-disabled="isAriaDisabled ? 'true' : undefined"
        :to="rootTag === 'router-link' ? to : undefined"
        :href="rootTag === 'a' ? href : undefined"
        v-bind="extraAttrs"
        @click="onClick"
    >
        <span v-if="loading" class="app-button__spinner" aria-hidden="true">
            <slot name="loading" />
        </span>
        <span
            v-if="showIconLeft"
            class="app-button__icon app-button__icon--left"
            aria-hidden="true"
        >
            <slot name="iconLeft">
                <i v-if="iconLeft" :class="iconLeft"></i>
            </slot>
        </span>
        <span v-if="showLabel" class="app-button__label">
            <slot>{{ label }}</slot>
        </span>
        <span v-if="unread" class="app-button__unread" aria-hidden="true"></span>
        <span
            v-if="showIconRight"
            class="app-button__icon app-button__icon--right"
            aria-hidden="true"
        >
            <slot name="iconRight">
                <i v-if="iconRight" :class="iconRight"></i>
            </slot>
        </span>
    </component>
</template>

<script>
export default {
    name: 'AppButton',
    inheritAttrs: false,
    props: {
        variant: {
            type: String,
            default: 'primary',
            validator: (value) =>
                [
                    'primary',
                    'secondary',
                    'tertiary',
                    'danger',
                    'success',
                    'warning',
                    'header-create',
                    'header-donate'
                ].includes(value)
        },
        tone: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'destructive'].includes(value)
        },
        size: {
            type: String,
            default: 'md',
            validator: (value) => ['sm', 'md', 'lg'].includes(value)
        },
        type: {
            type: String,
            default: 'button'
        },
        label: {
            type: String,
            default: ''
        },
        iconLeft: {
            type: String,
            default: ''
        },
        iconRight: {
            type: String,
            default: ''
        },
        iconOnly: {
            type: Boolean,
            default: false
        },
        unread: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        block: {
            type: Boolean,
            default: false
        },
        to: {
            type: [String, Object],
            default: null
        },
        href: {
            type: String,
            default: ''
        }
    },
    emits: ['click'],
    computed: {
        rootTag() {
            if (this.to) {
                return 'router-link';
            }
            if (this.href) {
                return 'a';
            }
            return 'button';
        },
        isDisabled() {
            return this.disabled || this.loading;
        },
        isNativeDisabled() {
            return this.rootTag === 'button' ? this.isDisabled : undefined;
        },
        isAriaDisabled() {
            return this.rootTag !== 'button' && this.isDisabled;
        },
        extraAttrs() {
            const { class: _class, ...attrs } = this.$attrs;
            return attrs;
        },
        buttonClasses() {
            const classes = [
                'app-button',
                `app-button--${this.variant}`,
                `app-button--${this.size}`
            ];

            if (this.variant === 'tertiary' && this.tone === 'destructive') {
                classes.push('app-button--tertiary-destructive');
            }
            if (this.iconOnly) {
                classes.push('app-button--icon-only');
            }
            if (this.block) {
                classes.push('app-button--block');
            }
            if (this.loading) {
                classes.push('app-button--loading');
            }
            if (this.$attrs.class) {
                classes.push(this.$attrs.class);
            }

            return classes;
        },
        showIconLeft() {
            return Boolean(this.iconLeft || this.$slots.iconLeft);
        },
        showIconRight() {
            return Boolean(this.iconRight || this.$slots.iconRight);
        },
        showLabel() {
            return !this.iconOnly && Boolean(this.label || this.$slots.default);
        }
    },
    methods: {
        onClick(event) {
            if (this.isDisabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            this.$emit('click', event);
        }
    }
};
</script>
