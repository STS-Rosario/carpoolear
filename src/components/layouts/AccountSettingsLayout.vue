<template>
    <div v-if="effectiveShowNav" class="container settings-component">
        <div class="row">
            <div class="col-xs-24 col-sm-6 settings-component__nav">
                <MyAccountNav />
            </div>
            <div class="col-xs-24 col-sm-18">
                <h1
                    v-if="pageTitleKey"
                    class="settings-identity-page-title hidden-xs"
                >
                    {{ $t(pageTitleKey) }}
                </h1>
                <slot></slot>
            </div>
        </div>
    </div>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import MyAccountNav from '../sections/MyAccountNav.vue';

export default {
    name: 'accountSettingsLayout',
    props: {
        showNav: {
            type: Boolean,
            default: true
        },
        pageTitleKey: {
            type: String,
            default: null
        }
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        effectiveShowNav() {
            return this.showNav && !this.isMobile;
        }
    },
    components: {
        MyAccountNav
    }
};
</script>

<style scoped>
.settings-identity-page-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

@media only screen and (min-width: 768px) {
    .settings-component {
        margin: 2em;
        min-height: calc(100vh - 54px);
    }
    .settings-component__nav {
        padding-right: 1.5rem;
    }
    .container {
        margin: 0;
        padding: 2em;
        width: 100%;
        min-height: calc(100vh - 152px);
    }
}
</style>
