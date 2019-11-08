<template>
  <div class="app-container" :class="[backgroundStyle, viewName]">
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
import footerApp from './components/sections/Footer.vue';
import headerApp from './components/sections/Header.vue';

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
        this.getConfig().then(data => {
            if (this.appConfig && this.appConfig.country_name) {
                switch (this.appConfig.country_name) {
                case 'Argentina':
                    this.$root.$i18n.locale = 'arg';
                    break;
                case 'Chile':
                    this.$root.$i18n.locale = 'ch';
                    break;
                }
            }
        });
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
            resolution: 'device/resolution',
            logged: 'auth/checkLogin',
            isFacebokApp: 'device/isFacebokApp',
            appConfig: 'auth/appConfig'
        }),
        viewName () {
            console.log(this.$route.name, this.backgroundStyle);
            return this.$route.name;
        }
    },
    watch: {
        deviceReady: () => {
            console.log('Device ready from components');
        }
    },
    data () {
        return {
            actualRouteName: '',
            cordova_path: process.env.ROUTE_BASE + 'cordova.js'
        };
    },
    components: {
        headerApp,
        footerApp
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
