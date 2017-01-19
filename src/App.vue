<template>
  <div class="container"> 
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    gato () {
      console.log('hola')
      this.texto = 'Perro'
    }
  },
  data () {
    return {
      texto: 'hola'
    }
  }
}
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
</style>
