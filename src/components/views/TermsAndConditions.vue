<template>
    <div class="terms-page container" v-html="termText"></div>
</template>

<style scoped></style>

<script>
import router from '../../router';
import bus from '../../services/bus-event.js';
import { mapActions } from 'pinia';
import { useProfileStore } from '../../stores/profile';
export default {
    name: 'about',
    data() {
        return {
            termText: ''
        };
    },
    mounted() {
        bus.on('back-click', this.onBackClick);
        console.log('terms mounted');
        this.getTermsText()
            .then((data) => {
                console.log('getTermsText component', data);
                this.termText = data.content;
            })
            .catch((err) => {
                console.log(err);
            });
    },
    methods: {
        ...mapActions(useProfileStore, {
            getTermsText: 'getTermsText'
        }),
        onBackClick() {
            router.back();
        }
    },
    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    }
};
</script>
