<template>
    <div class="app-info-card">
        <span class="app-info-card__icon" aria-hidden="true">
            <slot name="icon">
                <span
                    class="app-info-card__icon-image"
                    :style="iconMaskStyle"
                ></span>
            </slot>
        </span>
        <div class="app-info-card__body">
            <p v-if="hasText" class="app-info-card__text">
                <slot name="text">{{ text }}</slot>
            </p>
            <button
                v-if="hasAction"
                type="button"
                class="app-info-card__action"
                @click="$emit('action')"
            >
                <slot name="action">{{ actionLabel }}</slot>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AppInfoCard',
    props: {
        text: {
            type: String,
            default: ''
        },
        actionLabel: {
            type: String,
            default: ''
        }
    },
    emits: ['action'],
    data() {
        return {
            infoIconSrc: process.env.ROUTE_BASE + 'img/info-circle.png'
        };
    },
    computed: {
        iconMaskStyle() {
            const mask = `url(${this.infoIconSrc})`;
            return {
                WebkitMaskImage: mask,
                maskImage: mask
            };
        },
        hasText() {
            return Boolean(this.text || this.$slots.text);
        },
        hasAction() {
            return Boolean(this.actionLabel || this.$slots.action);
        }
    }
};
</script>
