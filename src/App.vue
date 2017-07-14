<template>
  <div class="app-container" :class="actualRouteName">
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
import { mapGetters } from 'vuex';
import footerApp from './components/sections/Footer.vue';
import headerApp from './components/sections/Header.vue';

export default {
    name: 'app',
    methods: {
        setRouteClass: function (route) {
            this.actualRouteName = 'route--' + route.name;
        }
    },
    computed: mapGetters({
        deviceReady: 'cordova/deviceReady'
    }),
    created () {
        this.setRouteClass(this.$route);
    },
    watch: {
        deviceReady: () => {
            console.log('Device ready from components');
        },
        '$route': function (to, from) {
            this.setRouteClass(to);
        }
    },
    data () {
        return {
            actualRouteName: ''
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
