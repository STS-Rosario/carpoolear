<template>
    <div
        class="app-container"
        :class="[backgroundStyle, viewName, deviceClass]"
    >
        <!-- Custom Splash Screen -->
        <div v-if="showCustomSplash" class="custom-splash-screen">
            <img src="https://carpoolear.com.ar/app/static/img/splash-android-1280x1920.png" alt="Carpoolear" class="splash-image" />
            <div class="splash-version">Version 92</div>
        </div>

        <onBoarding v-if="onBoardingVisibility"></onBoarding>
        <headerApp></headerApp>
        <main id="main">
            <div class="view-container clearfix">
                <router-view></router-view>
            </div>
        </main>
        <footerApp></footerApp>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from './stores/auth';
import { useCordovaStore } from './stores/cordova';
import { useBackgroundStore } from './stores/background';
import { useDeviceStore } from './stores/device';
import footerApp from './components/sections/FooterApp.vue';
import headerApp from './components/sections/HeaderApp.vue';
import onBoarding from './components/sections/OnBoarding.vue';

const route = useRoute();
const { locale } = useI18n();
const authStore = useAuthStore();
const cordovaStore = useCordovaStore();
const backgroundStore = useBackgroundStore();
const deviceStore = useDeviceStore();

const showCustomSplash = ref(true);

const backgroundStyle = computed(() => backgroundStore.backgroundStyle);
const logged = computed(() => authStore.checkLogin);
const appConfig = computed(() => authStore.appConfig);
const isRemoteConfig = computed(() => authStore.isRemoteConfig);
const user = computed(() => authStore.user);
const isBrowser = computed(() => deviceStore.isBrowser);
const firsTimeMobileAppOpen = computed(() => deviceStore.firsTimeMobileAppOpen);
const isFacebokApp = computed(() => deviceStore.isFacebokApp);

const onBoardingVisibility = computed(() => {
    let moduleEnabled =
        appConfig.value &&
        isRemoteConfig.value &&
        appConfig.value.module_on_boarding_new_user &&
        appConfig.value.module_on_boarding_new_user.enabled;
    let mustShowMobile = !isBrowser.value && !firsTimeMobileAppOpen.value;
    let mustShowGeneral = user.value && user.value.on_boarding_view !== 1;
    return moduleEnabled && (mustShowMobile || mustShowGeneral);
});

const viewName = computed(() => route.name);

const deviceClass = computed(() => {
    return window.device && window.device.platform
        ? window.device.platform.toLowerCase()
        : '';
});

// Load saved locale
const stored = localStorage.getItem('app_locale');
if (stored) {
    locale.value = stored;
}

onBeforeMount(() => {
    authStore.getConfig();
});

onMounted(() => {
    if (isFacebokApp.value) {
        if (!logged.value) {
            cordovaStore.facebookLogin(authStore);
        }
    }

    if (window.SplashScreen && window.SplashScreen.hide) {
        window.SplashScreen.hide();
    }

    setTimeout(() => {
        showCustomSplash.value = false;
    }, 3000);
});

watch(() => cordovaStore.deviceReady, () => {
    console.log('Device ready from components');
});

watch(appConfig, (value) => {
    if (value && value.locale && !localStorage.getItem('app_locale')) {
        locale.value = value.locale;
    }
});
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.custom-splash-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.splash-version {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: #999;
    font-size: 12px;
    font-family: Arial, sans-serif;
}

.splash-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    max-width: 100%;
    max-height: 100%;
}
</style>
