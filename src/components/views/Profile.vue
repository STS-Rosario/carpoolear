<template>
    <tabset ref="tabs">
        <tab header="Mis Viajes">
            <component :is="currentView"></component>
        </tab>
        <tab header="Perfil">
            <ProfileInfo></ProfileInfo>
        </tab>
        <tab header="Calificaciones">
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
import MyTrips from './MyTrips';
import ProfileTrip from '../sections//ProfileTrip';

export default {
    components: {
        Tab,
        Tabset,
        ProfileInfo,
        ProfileRates,
        MyTrips,
        ProfileTrip
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
            currentView: null
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
        this.$refs.tabs.activateTab(1);
        if (this.id === 'me' || this.id === this.user.id) {
            this.setTitle('Mi Perfil');
            this.setProfile(this.user);
            this.currentView = 'my-trips';
        } else {
            this.setProfileByID(this.id);
            this.currentView = 'profile-trip';
        }
    }
};
</script>
