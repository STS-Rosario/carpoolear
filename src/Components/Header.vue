<template>
    <header class="header-component">
        <h1>Carpoolear</h1>
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