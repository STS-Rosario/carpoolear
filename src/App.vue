<template>
  <div class="app-container" :class="[backgroundStyle]">
    <headerApp></headerApp>
    <main id="main">
      <div class="view-container">
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
            fbLogin: 'cordova/facebookLogin'
        })
    },
    mounted () {
        if (this.isFacebookApp) {
            if (!this.logged) {
                this.fbLogin();
            }
        }
    },
    computed: mapGetters({
        deviceReady: 'cordova/deviceReady',
        backgroundStyle: 'background/backgroundStyle',
        resolution: 'device/resolution',
        logged: 'auth/checkLogin',
        isFacebokApp: 'device/isFacebokApp'
    }),
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
