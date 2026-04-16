<template>
    <div class="container settings-component">
        <div class="row">
            <div class="col-xs-24 col-sm-5" v-show="!isMobile">
                <ul class="nav nav-pills nav-stacked">
                    <li :class="{ active: tabActive === 'profile' }">
                        <router-link :to="{ name: 'profile_update' }"
                            >{{ $t('perfil') }}</router-link
                        >
                    </li>
                    <li :class="{ active: tabActive === 'friends' }">
                        <router-link :to="{ name: 'friends_setting' }"
                            >{{ $t('amigos') }}</router-link
                        >
                    </li>
                    <li v-if="identityValidationAvailable" :class="{ active: tabActive === 'identity_validation' }">
                        <router-link :to="{ name: 'identity_validation' }"
                            >{{ $t('validarIdentidad') }}</router-link
                        >
                    </li>
                    <li :class="{ active: tabActive === 'debug' }">
                        <router-link :to="{ name: 'debug_setting' }"
                            >{{ $t('debug') }}</router-link
                        >
                    </li>
                    <!--
                    <li>
                        <a href="#">Dispositivos</a>
                    </li>
                    -->
                </ul>
            </div>
            <div class="col-xs-24 col-sm-19">
                <h1
                    v-if="settingsIdentityPageTitleKey"
                    class="settings-identity-page-title hidden-xs"
                >
                    {{ $t(settingsIdentityPageTitleKey) }}
                </h1>
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
export default {
    name: 'settings',
    data() {
        return {};
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        tabActive() {
            return this.$route.meta.tab;
        },
        identityValidationAvailable() {
            const c = this.config;
            return c && (c.identity_validation_mercado_pago_enabled === true || c.identity_validation_manual_enabled === true);
        },
        settingsIdentityPageTitleKey() {
            const n = this.$route.name;
            if (n === 'identity_validation') return 'validarIdentidad';
            if (n === 'identity_validation_manual') return 'validacionManual';
            return null;
        }
    },
    methods: {},
    watch: {},

    mounted() {},
    components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
    .container {
        margin: 0;
        padding: 2em;
        width: 100%;
        min-height: calc(100vh - 152px);
    }
}
</style>
