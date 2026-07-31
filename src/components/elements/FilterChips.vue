<template>
    <div
        class="filter-chips profile-filter-chips"
        role="tablist"
    >
        <button
            v-for="chip in options"
            :key="chip.id"
            type="button"
            class="filter-chip profile-filter-chip"
            :class="[
                `filter-chip--${chip.id}`,
                `profile-filter-chip--${chip.id}`,
                {
                    'filter-chip--active': modelValue === chip.id,
                    'profile-filter-chip--active': modelValue === chip.id
                }
            ]"
            @click="$emit('update:modelValue', chip.id)"
        >
            <i
                v-if="modelValue === chip.id"
                class="fa fa-check filter-chip__check profile-filter-chip__check"
                aria-hidden="true"
            ></i>
            {{ chip.label }}
        </button>
    </div>
</template>

<script>
export default {
    name: 'FilterChips',
    props: {
        options: {
            type: Array,
            default: () => []
        },
        modelValue: {
            type: [String, Number],
            default: null
        }
    },
    emits: ['update:modelValue']
};
</script>
