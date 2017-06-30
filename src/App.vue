<template>
  <div class="app-container">
    <headerApp></headerApp>
    <main id="main">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>
    <footerApp></footerApp>
    
    <pre>
            {{this.$store.state}}
    </pre>
    
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import footerApp from './components/sections/Footer.vue';
import headerApp from './components/sections/Header.vue';

export default {
    name: 'app',
    methods: {

    },
    computed: mapGetters({
        deviceReady: 'cordova/deviceReady'
    }),
    watch: {
        deviceReady: () => {
            console.log('Device ready from components');
        }
    },
    data () {
        return {

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
