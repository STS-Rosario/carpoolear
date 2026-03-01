<template>
    <div :is="isLi ? 'li' : 'div'" :class="dropdownClasses">
        <slot name="before"></slot>

        <a
            v-if="isLi"
            role="button"
            :class="['dropdown-toggle', buttonSize, { disabled }]"
            @keyup.esc="show = false"
            @click.prevent="toggle"
        >
            <slot name="button">{{ text }}</slot>
            <span class="caret"></span>
        </a>

        <button
            v-else
            type="button"
            :class="['btn', 'btn-' + type, buttonSize, 'dropdown-toggle']"
            :disabled="disabled"
            @keyup.esc="show = false"
            @click.prevent="toggle"
        >
            <slot name="button">{{ text }}</slot>
            <span class="caret"></span>
        </button>

        <slot name="dropdown-menu">
            <ul class="dropdown-menu" @click="handleMenuClick">
                <slot></slot>
            </ul>
        </slot>
    </div>
</template>

<script>
export default {
    props: {
        disabled: { type: Boolean, default: false },
        size: { type: String, default: null },
        text: { type: String, default: null },
        type: { type: String, default: 'default' },
        value: { type: Boolean, default: false }
    },

    data() {
        return {
            show: this.value
        };
    },

    watch: {
        show(val) {
            this.$emit('input', val);
        },
        value(val) {
            this.show = val;
        }
    },

    computed: {
        dropdownClasses() {
            return {
                open: this.show,
                disabled: this.disabled,
                dropdown: this.isLi,
                'btn-group': !this.isLi,
                ['dropdown-' + this.type]: !!this.type
            };
        },

        buttonSize() {
            return ['lg', 'sm', 'xs'].includes(this.size)
                ? 'btn-' + this.size
                : '';
        },

        isLi() {
            return (
                this.$parent &&
                (this.$parent._isTabs ||
                    this.$parent._navbar ||
                    this.$parent.menu)
            );
        }
    },

    methods: {
        toggle() {
            if (!this.disabled) {
                this.show = !this.show;
            }
        },

        handleMenuClick(e) {
            if (e.target.closest('a')) {
                this.show = false;
            }
        },

        handleOutsideClick(e) {
            if (!this.$el.contains(e.target)) {
                this.show = false;
            }
        }
    },

    mounted() {
        document.addEventListener('click', this.handleOutsideClick);
    },

    beforeDestroy() {
        document.removeEventListener('click', this.handleOutsideClick);
    }
};
</script>

<style>
.btn.dropdown-toggle .caret {
    margin-left: 4px;
}
.dropdown-menu > li > a {
  cursor: pointer;
}
</style>
