<template>
    <router-link
        v-if="to"
        :to="to"
        :class="linkClasses"
        v-bind="extraAttrs"
    >
        <slot />
    </router-link>
    <a
        v-else
        :href="href"
        :class="linkClasses"
        v-bind="extraAttrs"
    >
        <slot />
    </a>
</template>

<script>
export default {
    name: 'AppPrimaryLink',
    inheritAttrs: false,
    props: {
        to: {
            type: [String, Object],
            default: null
        },
        href: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'sm',
            validator: (value) => ['sm', 'md', 'lg'].includes(value)
        }
    },
    computed: {
        extraAttrs() {
            const { class: _class, ...attrs } = this.$attrs;
            return attrs;
        },
        linkClasses() {
            const classes = [
                'app-button',
                'app-button--primary',
                `app-button--${this.size}`
            ];

            if (this.$attrs.class) {
                classes.push(this.$attrs.class);
            }

            return classes;
        }
    }
};
</script>
