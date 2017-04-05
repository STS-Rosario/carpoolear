<template>
    <header class="header-component">
        <h1>Carpoolear</h1>
        <router-link tag="button" :to=" {name: 'detail_trip', params: {trip: 10} }">Trip 10</router-link>
        <router-link tag="button" :to=" {name: 'login'}">Login</router-link>
        <router-link tag="button" :to=" {name: 'register'}">Register</router-link>
    </header>
</template>

<script> 
export default {
  name: 'header',
  data () {
    return {
    }
  }
}
</script>