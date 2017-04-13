<template>
    <header class="header-component">
        <h1>Carpoolear</h1>
        <router-link tag="button" :to=" {name: 'detail_trip', params: {trip: 10} }">Trip 10</router-link>
        <router-link tag="button" :to=" {name: 'login'}">Login</router-link>
        <router-link tag="button" :to=" {name: 'register'}">Register</router-link>
        <button @click="share" type="button">Invitar amigos</button>
    </header>
</template>

<script> 
import socialShare from '../services/socialShare.js';
import dialogs from '../services/dialogs.js';
export default {
  name: 'header',
  data () {
    return {
    }
  },
  methods: {
    share () {
      dialogs.message("Message example");
      socialShare.share();
    }
  }
}
</script>