<template>
    <div class="terms-page container" v-html="termText"></div>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import bus from '../../services/bus-event.js';

const router = useRouter();
const profileStore = useProfileStore();

const termText = ref('');

const onBackClick = () => {
    router.back();
};

onMounted(() => {
    bus.on('back-click', onBackClick);
    console.log('terms mounted');
    profileStore.getTermsText()
        .then((data) => {
            console.log('getTermsText component', data);
            termText.value = data.content;
        })
        .catch((err) => {
            console.log(err);
        });
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});
</script>
