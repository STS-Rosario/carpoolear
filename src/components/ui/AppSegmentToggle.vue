<template>
    <div class="app-segment-toggle" role="tablist">
        <button
            v-for="option in options"
            :key="String(option.value)"
            type="button"
            role="tab"
            class="app-segment-toggle__option"
            :class="{
                'app-segment-toggle__option--active': modelValue === option.value
            }"
            :aria-selected="modelValue === option.value ? 'true' : 'false'"
            @click="$emit('update:modelValue', option.value)"
        >
            <i
                v-if="option.icon"
                :class="option.icon"
                class="app-segment-toggle__icon"
                aria-hidden="true"
            ></i>
            <img
                v-else-if="option.imageSrc"
                :src="option.imageSrc"
                alt=""
                class="app-segment-toggle__image"
            />
            <span class="app-segment-toggle__label">{{ option.label }}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'AppSegmentToggle',
    props: {
        modelValue: {
            type: [String, Number, Boolean],
            required: true
        },
        options: {
            type: Array,
            required: true
        }
    },
    emits: ['update:modelValue']
};
</script>
