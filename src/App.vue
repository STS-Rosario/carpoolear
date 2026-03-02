<template>
    <div
        class="app-container"
        :class="[backgroundStyle, viewName, deviceClass]"
    >
        <ForceUpgradeModal v-if="showForceUpgrade" />
        <template v-if="!showForceUpgrade">
            <!-- Custom Splash Screen -->
            <div v-if="showCustomSplash" class="custom-splash-screen">
                <img src="https://carpoolear.com.ar/app/static/img/splash-android-1280x1920.png" alt="Carpoolear" class="splash-image" />
                <div class="splash-version">{{ splashVersionText }}</div>
            </div>

            <onBoarding key="1" v-if="onBoardingVisibility"></onBoarding>
            <headerApp></headerApp>
            <main id="main">
                <div class="view-container clearfix">
                    <router-view></router-view>
                </div>
            </main>
            <footerApp></footerApp>
        </template>
        <!--
    <pre>
            {{this.$store.state}}
    </pre>
    --></div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { compareAndroidVersion, compareSemver } from './utils/versionCompare';
import footerApp from './components/sections/FooterApp.vue';
import headerApp from './components/sections/HeaderApp.vue';
import onBoarding from './components/sections/OnBoarding.vue';
import ForceUpgradeModal from './components/ForceUpgradeModal.vue';

export default {
    name: 'app',
    methods: {
        async runVersionCheck(config) {
            if (!Capacitor.isNativePlatform() || this.versionCheckDone) return;
            if (!config || config.__isLocal) return;

            const platform = Capacitor.getPlatform();
            const minAndroid = config.min_version_android;
            const minIos = config.min_version_ios;

            try {
                let currentVersionCode = null;
                let currentVersionName = null;

                try {
                    const result = await AppUpdate.getAppUpdateInfo();
                    currentVersionCode = result.currentVersionCode;
                    currentVersionName = result.currentVersionName;
                    const version = platform === 'android' ? String(currentVersionCode) : (currentVersionName || String(currentVersionCode));
                    this.$store.commit('SET_APP_VERSION_INFO', { version, versionSource: 'real', platform });
                } catch (pluginError) {
                    console.warn('AppUpdate.getAppUpdateInfo failed, using window.appVersion fallback:', pluginError);
                    const fallback = window.appVersion || '0';
                    currentVersionCode = fallback;
                    currentVersionName = fallback;
                    this.$store.commit('SET_APP_VERSION_INFO', { version: fallback, versionSource: 'fallback', platform });
                }

                // Min-version / force-upgrade check (only when backend sends min for this platform)
                if (platform === 'android' && (minAndroid !== null && minAndroid !== undefined)) {
                    if (currentVersionCode != null && compareAndroidVersion(currentVersionCode, minAndroid) < 0) {
                        this.showForceUpgrade = true;
                    }
                } else if (platform === 'ios' && minIos != null && minIos !== '') {
                    if (currentVersionName != null && compareSemver(currentVersionName, minIos) < 0) {
                        this.showForceUpgrade = true;
                    }
                }
            } catch (error) {
                console.warn('Version check failed:', error);
            } finally {
                this.versionCheckDone = true;
            }
        },
        setRouteClass: function (route) {
            this.actualRouteName = 'route--' + route.name;
        },
        ...mapActions({
            fbLogin: 'cordova/facebookLogin',
            getConfig: 'auth/getConfig'
        })
    },
    created() {
        const stored = localStorage.getItem('app_locale');
        if (stored) {
            this.$i18n.locale = stored;
        }
    },
    beforeMount() {
        this.getConfig();
    },
    mounted() {
        if (this.isFacebookApp) {
            if (!this.logged) {
                this.fbLogin();
            }
        }

        // Custom splash screen handling
        if (window.SplashScreen && window.SplashScreen.hide) {
            window.SplashScreen.hide();
        }
        
        // Show custom splash for 3 seconds
        setTimeout(() => {
            this.showCustomSplash = false;
        }, 3000);
    },
    computed: {
        // Same version we send in X-App-Version header for all requests (network.js getHeader)
        splashVersionText() {
            const appVersionInfo = this.$store.state.appVersionInfo;
            const version = (appVersionInfo && appVersionInfo.version) || (typeof window !== 'undefined' && window.appVersion) || '0';
            const base = 'Version ' + version;
            return Capacitor.isNativePlatform() ? base : base + ' - build 97';
        },
        ...mapGetters({
            deviceReady: 'cordova/deviceReady',
            backgroundStyle: 'background/backgroundStyle',
            logged: 'auth/checkLogin',
            isFacebokApp: 'device/isFacebokApp',
            appConfig: 'auth/appConfig',
            isRemoteConfig: 'auth/isRemoteConfig',
            firsTimeMobileAppOpen: 'device/firsTimeMobileAppOpen',
            user: 'auth/user',
            isBrowser: 'device/isBrowser'
        }),
        onBoardingVisibility() {
            let moduleEnabled =
                this.appConfig &&
                this.isRemoteConfig &&
                this.appConfig.module_on_boarding_new_user &&
                this.appConfig.module_on_boarding_new_user.enabled;
            let mustShowMobile = !this.isBrowser && !this.firsTimeMobileAppOpen;
            let mustShowGeneral = this.user && this.user.on_boarding_view !== 1;
            return moduleEnabled && (mustShowMobile || mustShowGeneral);
        },
        viewName() {
            return this.$route.name;
        },
        deviceClass() {
            return window.device && window.device.platform
                ? window.device.platform.toLowerCase()
                : '';
        }
    },
    watch: {
        deviceReady: () => {
            console.log('Device ready from components');
        },
        appConfig(value) {
            if (value && value.locale && !localStorage.getItem('app_locale')) {
                this.$root.$i18n.locale = value.locale;
            }
            if (value && !value.__isLocal) {
                this.runVersionCheck(value);
            }
        }
    },
    data() {
        return {
            actualRouteName: '',
            showCustomSplash: true,
            showForceUpgrade: false,
            versionCheckDone: false
        };
    },
    components: {
        headerApp,
        footerApp,
        onBoarding,
        ForceUpgradeModal
    }
};
</script>

<style>
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
