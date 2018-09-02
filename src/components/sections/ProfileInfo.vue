<template>
    <div class="profile-info-component" v-if="profile">
        <div class="list-group">
            <div class="pic-info col-sm-6">
                <div v-if="profile.has_pin == 1" class="user_pin">
                    <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" title="Aportante en la campaña mi media naranja carpoolera" />
                </div>
                <div class="circle-box profile" v-imgSrc:profile="profile.image"></div>
                <div class="profile-info">
                    <div class="profile-info--name mobile">{{profile.name}}</div>
                    <div class="profile-info--ratings">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i> <span> {{profile.positive_ratings}} </span>
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i> <span> {{profile.negative_ratings}} </span>
                    </div>
                    <div v-if="profile.is_member == 1" class="">
                        <img src="https://carpoolear.com.ar/static/img/pin_member.png" alt="" title="Aportante en la campaña mi media naranja carpoolera" />
                    </div>
                </div>
                <div class="profile-social-accounts" >
                    <div v-for="account in profile.accounts" class="row">
                        <div class="col-xs-24">
                            <a :href="'https://www.facebook.com/search/top/?q=' + encodeURIComponent(profile.name)" target="_blank" class="btn-primary btn-search" style="border: 0" title="Facebook cambio sus políticas y no podemos llevarte al perfil de esta persona, pero te ayudamos a buscarlo.">
                                <span class=''>Buscar en Facebook</span>
                            </a><!-- app_scoped_user_id -->
                        </div>
                    </div>
                    <div class="row" v-if="profile.accounts && profile.accounts.length">
                        <div class="col-xs-24">
                            <small>Facebook cambió sus políticas y no podemos llevarte al perfil de esta persona, pero te ayudamos a buscarlo.</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-info col-sm-offset-2 col-sm-16 col-md-offset-1">
                <div class="profile-info--name desktop">{{profile.name}}</div>
                <div class='list-container'>
                    <div class="list-group-item" v-if="profile.description">
                        <i class="fa fa-quote-left" aria-hidden="true"></i>
                        <div class="list-group-item--content italic"> {{profile.description}} </div>
                    </div>
                    <!--<div class="list-group-item" v-if="profile.nro_doc">
                        <i class="fa fa-id-card" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.nro_doc}}</div>
                    </div>-->
                    <div class="list-group-item" v-if="profile.email && profile.id == user.id">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.email}}</div>
                    </div>
                    <!--<div class="list-group-item" v-if="profile.mobile_phone">
                        <i class="fa fa-mobile bigger" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.mobile_phone}}</div>
                    </div>-->
                </div>
                <div class="edit-action" v-if="profile.id == user.id">
                    <router-link class="btn btn-primary" tag="button" :to="{name:'profile_update'}"> Editar perfil</router-link>
                    <router-link class="btn btn-primary" tag="button" :to="{name:'friends_setting'}"> Ver amigos</router-link>
                </div>
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
<style scoped>
    .btn-primary {
        display: inline-block;
    }
</style>
