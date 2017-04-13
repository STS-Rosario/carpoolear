<template>
    <header class="header-component">
        <h1>Carpoolear</h1>
        <router-link tag="button" :to=" {name: 'activate', params: {token: 3000} }">Trip 10</router-link>
        <router-link tag="button" :to=" {name: 'login'}">Login</router-link>
        <router-link tag="button" :to=" {name: 'register'}">Register</router-link>
        <button @click="share" type="button">Invitar amigos</button>
    </header>
</template>

<script> 
import socialShare from '../services/socialShare.js';
export default {
  name: 'header',
  data () {
    return {
    }
  },
  methods: {
    share () {
      socialShare.share();
    }
  }
}
</script>