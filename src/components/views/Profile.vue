<template>
    <tabset>
        <tab header="Mis Viajes">
            Gato
        </tab>
        <tab header="Perfil">
            Perro
        </tab>
        <tab header="Valoraciones">
            Perro
        </tab>
    </tabset>
</template>
<script>
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import {mapActions, mapGetters} from 'vuex';

export default {
    components: {
        Tab,
        Tabset
    },

    props: {
        id: {
            type: String,
            required: false,
            default: 'me'
        }
    },

    data () {
        return {

        };
    },

    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'profile': 'profile/user'
        })
    },

    methods: {
        ...mapActions({
            setTitle: 'actionbars/setTitle',
            setProfile: 'profile/setUser',
            setProfileByID: 'profile/setUserByID'

        })
    },

    mounted () {
        if (this.id === 'me' || this.id === this.user.id) {
            this.setTitle('Mi Perfil');
            this.setProfile(this.user);
        } else {
            this.setProfileByID(this.id);
        }
    }
};
</script>