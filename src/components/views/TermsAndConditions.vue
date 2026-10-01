<template>
    <AccountSettingsLayout page-title-key="legales">
        <div ref="content" class="terms-page container" v-html="termText"></div>
    </AccountSettingsLayout>
</template>

<style scoped></style>

<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import router from '../../router';
import bus from '../../services/bus-event.js';
import { bindStaticPageLinks } from '../../utils/staticPageLinks';
import { mapActions } from 'pinia';
import { useProfileStore } from '../../stores/profile';
export default {
    name: 'about',
    components: {
        AccountSettingsLayout
    },
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
                this.$nextTick(() => {
                    bindStaticPageLinks(this.$refs.content, router);
                });
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
