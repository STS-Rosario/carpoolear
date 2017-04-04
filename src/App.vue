<template>
  <div class="container"> 
      <headerApp></headerApp>
      <main id="main">
        <router-view></router-view>
      </main>
      <footerApp></footerApp>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import footerApp from './Components/Footer.vue'
import headerApp from './Components/Header.vue'

export default {
  name: 'app',
  methods: {
  },
  computed: mapGetters({
      deviceReady: 'cordova/deviceReady'
    })
  ,
  watch: {
    deviceReady: () => {
      console.log("Device ready from components")
    }
  },
  data () {
    return {
      texto: 'hola'
    }
  },
  components: { 
    headerApp,
    footerApp 
  }
}
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
