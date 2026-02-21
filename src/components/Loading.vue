<template>
    <div v-if="(data && data.length > 0) || !hideOnEmpty">
        <slot name="title"></slot>
        <template v-if="data != null">
            <slot v-if="data.length > 0"></slot>
            <slot name="no-data" v-else>
                <p class="alert alert-warning" role="alert">{{ $t('noHayViajes') }}</p>
            </slot>
        </template>
        <slot name="loading" v-else>
            <p class="alert alert-info" role="alert">
                <spinner></spinner>
                {{ $t('cargandoViajes') }}
            </p>
        </slot>
    </div>
</template>

<script setup>
import spinner from './Spinner.vue';

defineProps({
    data: {
        required: true
    },
    hideOnEmpty: {
        type: Boolean,
        default: false
    }
});
</script>
