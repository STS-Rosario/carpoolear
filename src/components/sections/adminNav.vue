<template>
    <div class="col-md-20 col-md-offset-2">
        <div class="nav nav-pills">
            <router-link :to="{name: 'admin-users'}">
                Usuarios
            </router-link>
            <router-link :to="{name: 'admin-page'}">
                Graficos
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'admin-nav',
    data () {
        return {
            selected: ''
        };
    },
    mounted () {

    }
};
</script>

<style scoped>
.nav-pills {
    font-size: 1.5em;
}
</style>
