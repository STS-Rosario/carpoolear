<template>
    <div class="profile-info-component" v-if="profile">  
        <div class="list-group">
            <div class="list-group-item">
                <img alt="" :src="profile.image | profile-image" class="trip_driver_img circle-box" />
                <div class="profile-info">
                    <div class="profile-info--name">{{profile.name}}</div>
                    <div class="profile-info--city">{{profile}}</div>
                    <div class="profile-info--ratings">{{profile.positive_ratings}} {{profile.negative_ratings}}</div>
                </div>
            </div>
            <div class="list-group-item" v-if="profile.descripcion">
                <i class="fa fa-quote-left" aria-hidden="true"></i>
                {{profile.descripcion}}
            </div>
            <div class="list-group-item" v-if="profile.nro_doc">
                <i class="fa fa-id-card" aria-hidden="true"></i>
                <span>{{profile.nro_doc}}</span>
            </div>
            <div class="list-group-item" v-if="profile.email">
                <i class="fa fa-envelope" aria-hidden="true"></i>
                <span>{{profile.email}}</span>
            </div>
            <div class="list-group-item" v-if="profile.mobile_phone">
                <i class="fa fa-mobile" aria-hidden="true"></i>
                <span>{{profile.mobile_phone}}</span>
            </div>
            <div class="edit-action" v-if="profile.id == user.id">
                <router-link class="btn btn-primary" tag="button" :to="{name:'profile_update'}"> Editar perfil</router-link>
                <router-link class="btn btn-primary" tag="button" :to="{name:'friends_setting'}"> Ver amigos</router-link>
            </div>
        </div>
    </div> 
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data () {
        return {

        };
    },
    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'profile': 'profile/user'
        })
    }
};
</script>
