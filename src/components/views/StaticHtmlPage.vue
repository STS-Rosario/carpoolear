<template>
    <AccountSettingsLayout :page-title-key="pageTitleKey">
        <div
            ref="content"
            class="terms-page container"
            v-html="pageContent"
        ></div>
    </AccountSettingsLayout>
</template>

<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import router from '../../router';
import bus from '../../services/bus-event.js';
import StaticPageApi from '../../services/api/StaticPage';
import { bindInternalStaticPageLinks } from '../../utils/staticPageLinks';

const staticPageApi = new StaticPageApi();

export default {
    name: 'StaticHtmlPage',
    components: {
        AccountSettingsLayout
    },
    props: {
        pageSlug: {
            type: String,
            required: true
        },
        pageTitleKey: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            pageContent: ''
        };
    },
    watch: {
        pageSlug: {
            immediate: true,
            handler() {
                this.loadPageContent();
            }
        }
    },
    mounted() {
        bus.on('back-click', this.onBackClick);
    },
    updated() {
        this.bindInternalLinks();
    },
    methods: {
        loadPageContent() {
            staticPageApi
                .getPage(this.pageSlug)
                .then((data) => {
                    this.pageContent = data.content;
                    this.$nextTick(() => {
                        this.bindInternalLinks();
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        bindInternalLinks() {
            bindInternalStaticPageLinks(this.$refs.content, router);
        },
        onBackClick() {
            router.back();
        }
    },
    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    }
};
</script>
