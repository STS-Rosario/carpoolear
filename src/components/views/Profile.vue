<template>
    <tabset>
        <tab header="Mis Viajes">
            Gato
        </tab>
        <tab header="Perfil">
            <ProfileInfo></ProfileInfo>
        </tab>
        <tab header="Valoraciones">
            <ProfileRates></ProfileRates>
        </tab>
    </tabset>
</template>
<script>
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import {mapActions, mapGetters} from 'vuex';
import ProfileInfo from '../sections/ProfileInfo';
import ProfileRates from '../sections/ProfileRates';

export default {
    components: {
        Tab,
        Tabset,
        ProfileInfo,
        ProfileRates
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