<template>
    <div
        class="app-container"
        :class="[backgroundStyle, viewName, deviceClass]"
    >
        <ForceUpgradeModal v-if="showForceUpgrade" />
        <IdentityValidationPromptModal
            v-if="!showForceUpgrade"
            :suppress="identityPromptSuppress"
        />
        <template v-if="!showForceUpgrade">
            <!-- Custom Splash Screen -->
            <div v-if="showCustomSplash" class="custom-splash-screen">
                <img
                    :src="$publicImg('splash-android-1280x1920.png')"
                    alt="Carpoolear"
                    class="splash-image"
                />
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
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from './stores/auth';
import { useCordovaStore } from './stores/cordova';
import { useDeviceStore } from './stores/device';
import { useBackgroundStore } from './stores/background';
import { useRootStore } from './stores/root';
import { Capacitor } from '@capacitor/core';
import { AppUpdate } from '@capawesome/capacitor-app-update';
import { compareAndroidVersion, compareSemver } from './utils/versionCompare';
import footerApp from './components/sections/FooterApp.vue';
import headerApp from './components/sections/HeaderApp.vue';
import onBoarding from './components/sections/OnBoarding.vue';
import ForceUpgradeModal from './components/ForceUpgradeModal.vue';
import IdentityValidationPromptModal from './components/IdentityValidationPromptModal.vue';

export default {
    name: 'app',
    methods: {
        async runVersionCheck(config) {
            if (!Capacitor.isNativePlatform() || this.versionCheckDone) return;
            if (!config || config.__isLocal) return;

            const platform = Capacitor.getPlatform();
            const minAndroid = config.min_version_android;
            const minAndroidSemver = config.min_version_android_semver;
            const minIos = config.min_version_ios;

            try {
                let currentVersionCode = null;
                let currentVersionName = null;
                let isFallback = false;

                try {
                    const result = await AppUpdate.getAppUpdateInfo();
                    currentVersionCode = result.currentVersionCode;
                    currentVersionName = result.currentVersionName;
                    const version = platform === 'android' ? String(currentVersionCode) : (currentVersionName || String(currentVersionCode));
                    useRootStore().setAppVersionInfo({ version, versionSource: 'real', platform });
                } catch (pluginError) {
                    console.warn('AppUpdate.getAppUpdateInfo failed, using window.appVersion fallback:', pluginError);
                    const fallback = window.appVersion || '0';
                    currentVersionCode = fallback;
                    currentVersionName = fallback;
                    isFallback = true;
                    useRootStore().setAppVersionInfo({ version: fallback, versionSource: 'fallback', platform });
                }

                // Min-version / force-upgrade check (only when backend sends min for this platform)
                if (platform === 'android') {
                    if (!isFallback && currentVersionCode != null && minAndroid != null && minAndroid !== undefined) {
                        if (compareAndroidVersion(currentVersionCode, minAndroid) < 0) {
                            this.showForceUpgrade = true;
                        }
                    } else if (isFallback && currentVersionName != null && minAndroidSemver) {
                        if (compareSemver(currentVersionName, minAndroidSemver) < 0) {
                            this.showForceUpgrade = true;
                        }
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
        ...mapActions(useCordovaStore, {
            fbLogin: 'facebookLogin'
        }),
        ...mapActions(useAuthStore, {
            getConfig: 'getConfig'
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

        setTimeout(() => {
            this.showCustomSplash = false;
        }, 3000);
    },
    computed: {
        // Same version we send in X-App-Version header for all requests (network.js getHeader)
        splashVersionText() {
            const appVersionInfo = useRootStore().appVersionInfo;
            const version = (appVersionInfo && appVersionInfo.version) || (typeof window !== 'undefined' && window.appVersion) || '0';
            const base = 'Version ' + version;
            return Capacitor.isNativePlatform() ? base : base + ' - build 103';
        },
        ...mapState(useCordovaStore, {
            deviceReady: 'deviceReady'
        }),
        ...mapState(useBackgroundStore, {
            backgroundStyle: 'backgroundStyle'
        }),
        ...mapState(useAuthStore, {
            logged: 'checkLogin',
            appConfig: 'appConfig',
            isRemoteConfig: 'isRemoteConfig',
            user: 'user'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp',
            firsTimeMobileAppOpen: 'firsTimeMobileAppOpen',
            isBrowser: 'isBrowser'
        }),
        onBoardingVisibility() {
            let moduleEnabled =
                this.appConfig &&
                this.isRemoteConfig &&
                this.appConfig.module_on_boarding_new_user &&
                this.appConfig.module_on_boarding_new_user.enabled;
            let mustShowMobile = !this.isBrowser && !this.firsTimeMobileAppOpen;
            // Full-screen onboarding (z-index 9999) sat on top of /trips in the browser while
            // trips loaded underneath (debug: Trip mounted x4, customSplash 0, cardTrip DOM count 0 under #main snapshot).
            // Keep the blocking overlay for native / in-app only; web uses the app without it.
            let mustShowGeneral =
                this.user &&
                this.user.on_boarding_view !== 1 &&
                !this.isBrowser;
            return moduleEnabled && (mustShowMobile || mustShowGeneral);
        },
        identityPromptSuppress() {
            return this.showCustomSplash || this.onBoardingVisibility;
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
        ForceUpgradeModal,
        IdentityValidationPromptModal
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
