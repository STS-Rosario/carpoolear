<template>
    <div class="app-field" :class="wrapperClasses">
        <label v-if="hasLabel" :for="labelFor" class="app-field__label">
            <slot name="label">{{ label }}</slot>
            <span v-if="optional" class="app-field__optional">
                ({{ $t('opcional') }})
            </span>
        </label>
        <div
            class="app-field__control-wrap"
            :class="{
                'app-field__control-wrap--icon-left': hasIconLeft,
                'app-field__control-wrap--action-right': $slots.actionRight
            }"
        >
            <span v-if="hasIconLeft" class="app-field__icon" aria-hidden="true">
                <slot name="iconLeft">
                    <i v-if="iconLeft" :class="iconLeft"></i>
                    <img v-else-if="iconImage" :src="iconImage" alt="" />
                </slot>
            </span>
            <div class="app-field__control">
                <slot />
            </div>
            <div v-if="$slots.actionRight" class="app-field__action-right">
                <slot name="actionRight" />
            </div>
        </div>
        <p
            v-if="displayMessage"
            class="app-field__hint"
            :class="{ 'app-field__hint--error': hasError }"
        >
            {{ displayMessage }}
        </p>
    </div>
</template>

<script>
export default {
    name: 'AppField',
    props: {
        label: {
            type: String,
            default: ''
        },
        optional: {
            type: Boolean,
            default: false
        },
        hint: {
            type: String,
            default: ''
        },
        error: {
            type: String,
            default: ''
        },
        iconLeft: {
            type: String,
            default: ''
        },
        iconImage: {
            type: String,
            default: ''
        },
        labelFor: {
            type: String,
            default: ''
        }
    },
    computed: {
        hasLabel() {
            return Boolean(this.label || this.$slots.label);
        },
        hasIconLeft() {
            return Boolean(
                this.iconLeft || this.iconImage || this.$slots.iconLeft
            );
        },
        hasError() {
            return Boolean(this.error);
        },
        displayMessage() {
            return this.error || this.hint;
        },
        wrapperClasses() {
            return {
                'app-field--error': this.hasError
            };
        }
    }
};
</script>
