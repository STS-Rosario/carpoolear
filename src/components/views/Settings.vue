<template>
    <div class="container settings-component">
        <div class="row">
            <div class="col-xs-24 col-sm-5" v-show="!isMobile">
                <ul class="nav nav-pills nav-stacked">
                    <li :class="{ active: tabActive === 'profile' }">
                        <router-link :to="{ name: 'profile_update' }"
                            >{{ t('perfil') }}</router-link
                        >
                    </li>
                    <li :class="{ active: tabActive === 'friends' }">
                        <router-link :to="{ name: 'friends_setting' }"
                            >{{ t('amigos') }}</router-link
                        >
                    </li>
                    <li v-if="identityValidationAvailable" :class="{ active: tabActive === 'identity_validation' }">
                        <router-link :to="{ name: 'identity_validation' }"
                            >{{ t('validarIdentidad') }}</router-link
                        >
                    </li>
                </ul>
            </div>
            <div class="col-xs-24 col-sm-19">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDeviceStore } from '@/stores/device';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const route = useRoute();
const deviceStore = useDeviceStore();
const authStore = useAuthStore();

const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

const tabActive = computed(() => {
    return route.meta.tab;
});

const identityValidationAvailable = computed(() => {
    const c = config.value;
    return c && (c.identity_validation_mercado_pago_enabled === true || c.identity_validation_manual_enabled === true);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
