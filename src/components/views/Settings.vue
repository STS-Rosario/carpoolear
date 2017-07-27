<template>
    <div class="container settings-component">
        <div class="row">
            <div class="col-xs-24 col-sm-5" v-show="!isMobile">
                <ul class="nav nav-pills nav-stacked">
                    <li :class="{active: tabActive === 'profile'}">
                        <router-link :to="{name:'profile_update'}">Perfil</router-link>
                    </li>
                    <li :class="{active: tabActive === 'friends'}">
                        <router-link :to="{name:'friends_setting'}">Amigos</router-link>
                    </li>
                    <!--
                    <li>
                        <a href="#">Dispositivos</a>
                    </li>
                    -->
                </ul>
            </div>
            <div class="col-xs-24 col-sm-19">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'settings',
    data () {
        return {
        };
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        }),
        tabActive () {
            return this.$route.meta.tab;
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
