<template>
    <div class="row settings-component">
        <div class="col-xs-4">
            <ul>
                <li :class="{active: tabActive === 'profile'}">
                    <router-link :to="{name:'profile_update'}">Profile</router-link>
                </li>
                <li :class="{active: tabActive === 'friends'}">
                    <router-link :to="{name:'friends_setting'}">Amigos</router-link>
                </li>
                <li>
                    Dispositivos
                </li>
            </ul>
        </div>
        <div class="col-xs-20">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    name: 'settings',
    data () {
        return {
        };
    },
    computed: {
        tabActive () {
            return this.$route.meta;
        }
    },
    methods: {
    },
    watch: {
    },

    mounted () {
    },
    components: {
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
