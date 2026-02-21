<template></template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    token: {
        type: String,
        required: false
    }
});

const authStore = useAuthStore();

onMounted(() => {
    authStore.activate(props.token);
});
</script>
