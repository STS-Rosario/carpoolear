<template>
  <div class="app-container" :class="[backgroundStyle, viewName]">
    <onBoarding key="1" v-if="onBoardingVisibility"></onBoarding>
    <headerApp></headerApp>
    <main id="main">
      <div class="view-container clearfix">
        <router-view></router-view>
      </div>
    </main>
    <footerApp></footerApp>
    <!--
    <pre>
            {{this.$store.state}}
    </pre>
    -->
  </div>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import footerApp from './components/sections/FooterApp.vue';
import headerApp from './components/sections/HeaderApp.vue';
import onBoarding from './components/sections/OnBoarding.vue';

export default {
    name: 'app',
    methods: {
        setRouteClass: function (route) {
            this.actualRouteName = 'route--' + route.name;
        },
        ...mapActions({
            fbLogin: 'cordova/facebookLogin',
            getConfig: 'auth/getConfig'
        })
    },
    beforeMount () {
        this.getConfig();
    },
    mounted () {
        if (this.isFacebookApp) {
            if (!this.logged) {
                this.fbLogin();
            }
        }
    },
    computed: {
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
        onBoardingVisibility () {
            let moduleEnabled = this.appConfig && this.isRemoteConfig && this.appConfig.module_on_boarding_new_user && this.appConfig.module_on_boarding_new_user.enabled;
            let mustShowMobile = !this.isBrowser && !this.firsTimeMobileAppOpen;
            let mustShowGeneral = this.user && this.user.on_boarding_view !== 1;
            return moduleEnabled && (mustShowMobile || mustShowGeneral);
        },
        viewName () {
            return this.$route.name;
        }
    },
    watch: {
        deviceReady: () => {
            console.log('Device ready from components');
        },
        appConfig (value) {
            if (value && value.locale) {
                this.$root.$i18n.locale = value.locale;
            }
        }
    },
    data () {
        return {
            actualRouteName: ''
        };
    },
    components: {
        headerApp,
        footerApp,
        onBoarding
    }
};
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
