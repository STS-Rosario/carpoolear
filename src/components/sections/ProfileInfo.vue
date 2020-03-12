<template>
    <div class="profile-info-component" v-if="profile">
        <div class="list-group">
            <div class="pic-info col-sm-6">
                <div v-if="profile.has_pin == 1" class="user_pin">
                    <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" :title="$t('aportanteMediaNaranja')" />
                </div>
                <div class="circle-box profile" v-imgSrc:profile="profile.image"></div>
                <div class="profile-info">
                    <div class="profile-info--name mobile">{{profile.name}}</div>
                    <div class="profile-info--ratings">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i> <span> {{profile.positive_ratings}} </span>
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i> <span> {{profile.negative_ratings}} </span>
                    </div>
                    <div v-if="profile.is_member == 1" class="member_pin">
                        <img src="https://carpoolear.com.ar/static/img/pin_member.png" alt="" :title="$t('miembroEquipo')" />
                    </div>
                </div>
                <div class="profile-social-accounts" >
                    <div v-for="account in profile.accounts" class="row">
                        <div class="col-xs-24">
                            <a :href="'https://www.facebook.com/search/top/?q=' + encodeURIComponent(profile.name)" target="_blank" class="btn-primary btn-search" style="border: 0" :title="$t('cambioFacebook')">
                                <span class=''>{{ $t('buscarFacebook') }}</span>
                            </a><!-- app_scoped_user_id -->
                        </div>
                    </div>
                    <div class="row" v-if="profile.accounts && profile.accounts.length">
                        <div class="col-xs-24">
                            <small>{{ $t('cambioFacebook') }}</small>
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

                    <div class="list-group-item" v-if="profile.email ">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.email}}</div>
                    </div>
                    <div class="list-group-item" v-if="profile.nro_doc">
                        <i class="fa fa-id-card" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.nro_doc}}</div>
                    </div>

                    <div class="list-group-item" v-if="profile.mobile_phone">
                        <i class="fa fa-mobile bigger" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.mobile_phone}}</div>
                    </div>

                    <div class="list-group-item" v-if="profile.cars && profile.cars.length">
                        <i class="fa fa-car" aria-hidden="true"></i>
                        <div class="list-group-item--content">{{profile.cars[0].patente}}</div>
                    </div>

                </div>
                <div class="edit-action" v-if="user.is_admin && profile.id !== user.id">
                    <button class="btn btn-primary btn-circle" v-on:click="messageUser()">
                        {{ $t('enviarMensaje') }}
                    </button>
                </div>
                <div class="edit-action" v-if="profile.id === user.id">
                    <router-link class="btn btn-primary" tag="button" :to="{name:'profile_update'}"> {{ $t('editarPerfil') }}</router-link>
                    <router-link class="btn btn-primary" tag="button" :to="{name:'friends_setting'}"> {{ $t('verAmigos') }}</router-link>
                    <router-link v-if="config && config.module_trip_seats_payment" class="btn btn-primary" tag="button" :to="{name:'transacciones'}"> transacciones </router-link>
                </div>
                <div class="edit-action edit-action-reference" v-else-if="config && config.module_references && !userReferenceWritten">
                    <button v-if="!sendReferenceFormVisibility" class="btn btn-primary" tag="button" @click="showReferenceForm">{{ $t('enviarReferencia') }}</button>
                    <div v-else class="reply-box">
                        <label for="reply" class="label label-reply">Escribe una referencia sobre el usuario</label>
                        <textarea ref="reference" maxlength="260" v-model="referenceComment" id="reference"></textarea>
                        <div class="reply-btns">
                            <button class="btn btn-primary" @click="sendReference" :disabled="sending">
                                <template v-if="sending">
                                    <spinner class="blue"></spinner>
                                </template>
                                <template v-else>
                                    Comentar
                                </template>
                            </button>
                            <button class="btn btn-primary" @click="sendReferenceFormVisibility = false"> Cancelar </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import router from '../../router';
import Spinner from '../Spinner.vue';
import dialogs from '../../services/dialogs.js';

export default {
    data () {
        return {
            sendReferenceFormVisibility: false,
            referenceComment: '',
            sending: false
        };
    },
    computed: {
        ...mapGetters({
            'user': 'auth/user',
            'profile': 'profile/user',
            'config': 'auth/appConfig'
        }),
        userReferenceWritten () {
            return this.profile.references && this.profile.references.length && this.profile.references.findIndex(item => item.user_id_from === this.user.id) >= 0;
        }
    },
    methods: {
        ...mapActions({
            lookConversation: 'conversations/createConversation',
            makeReference: 'profile/makeReference'
        }),
        messageUser () {
            this.lookConversation(this.profile).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            });
        },
        sendReference () {
            this.sending = true;
            this.makeReference({
                user_id_to: this.profile.id,
                comment: this.referenceComment
            }).then(() => {
                dialogs.message(this.$t('referenciaExitosa'));
                this.sendReferenceFormVisibility = false;
            }).catch((error) => {
                let errorMessage = this.$t('referenciaError');
                if (this.$checkError(error, 'reference_exist')) {
                    errorMessage = this.$t('referenciaExist');
                } else if (this.$checkError(error, 'reference_same_user')) {
                    errorMessage = this.$t('referenciaSameUser');
                } else if (this.$checkError(error, 'user_doesnt_exist')) {
                    errorMessage = this.$t('userDoesntExist');
                }
                dialogs.message(errorMessage, { estado: 'error' });
            }).finally(() => {
                this.sending = false;
            });
        },
        showReferenceForm () {
            this.sendReferenceFormVisibility = true;
            this.$nextTick(() => {
                this.$refs.reference.focus();
            });
        }
    },
    components: {
        Spinner
    }
};
</script>
<style scoped>
    .btn-primary {
        display: inline-block;
    }
    .label-reply {
        display: block;
        padding: 0;
        font-size: 0.9rem;
        font-weight: bold;
        line-height: 1.5em;
        color: #333;
        text-align: left;
        border-radius: 0;
    }
    .reply-btns button {
        min-width: 7rem;
    }
</style>
