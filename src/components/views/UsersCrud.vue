<template>
<div class="conversation-component container">
    <div class="row">
        <div class="col-sm-8 col-md-8">
            <div class="conversation_list">
                <ul class="list-group">
                    <li class="list-group-item">
                        <div class="    up">
                            <input v-model="textSearch" v-on:keyup="onSearchUsers" type="text" class="form-control" placeholder="Escribe un nombre y presiona buscar" />
                        </div>
                    </li>
                    <template v-if="textSearch.length != 0">
                        <Loading class="conversation_chat--chats" :data="userList">
                            <li v-for="user in userList" class="list-group-item conversation_header" @click="selectUser(user)"  v-bind:key="user.id">
                                <div class="media">
                                  <div class="media-right pull-right">
                                      <button class="btn btn-success btn-circle" v-on:click="toUserMessages(user)">
                                          <i class="fa fa-comments medium-icon" aria-hidden="true"></i>
                                      </button>
                                  </div>
                                  <div class="media-left">
                                    <div class="conversation_image circle-box" v-imgSrc:profile="user.image"></div>
                                  </div>
                                  <div class="media-body">
                                    <h4 class="media-heading"><span class="conversation-title">{{ user.name }}</span></h4>
                                    <span> {{ user.email }} </span>
                                  </div>
                                </div>
                            </li>
                            <li slot="no-data" class="list-group-item alert alert-warning"  role="alert">No se encontro ningun usuario</li>
                            <li slot="loading" class="list-group-item alert alert-info" role="alert">
                                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                                Cargando usuarios ...
                            </li>
                        </Loading>
                    </template>
                </ul>
            </div>
        </div>
        <div v-if="currentUser" class="user-settings col-xs-24 col-sm-16 col-md-16">
                <div class="settings-container">
                    <div class="form-group">
                        <label for="input-name">Nombre y apellido </label>
                        <input maxlength="25" v-model="newInfo.name" type="text" class="form-control" id="input-name" placeholder="Nombre" />
                        <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
                    </div>
                    
                    <div class="form-group">
                        <label for="input-email">E-mail </label>
                        <input maxlength="40" v-model="newInfo.email" type="text" class="form-control" id="input-email" placeholder="E-mail">
                    </div>

                    <div class="form-group">
                        <label for="input-description">Acerca de mi</label>
                        <textarea maxlength="1000" v-model="newInfo.description" placeholder="Descripción"></textarea>
                        <span class="error textarea" v-if="descError.state"> {{descError.message}} </span>
                    </div>

                    <div class="form-group">
                        <label for="input-dni">Número de documento</label>
                        <input v-numberMask="'dniRawValue'" type="text" data-max-length="8" v-model="newInfo.nro_doc" class="form-control" id="input-dni" placeholder="DNI">
                        <span class="error" v-if="dniError.state"> {{dniError.message}} </span>
                    </div>

                    <div class="form-group">
                        <label for="input-telefono">Número de teléfono </label>
                        <input maxlength="20" @keydown="isNumber" v-on:paste='isNumber' v-model="newInfo.mobile_phone" type="tel" class="form-control" id="input-phone" placeholder="Número de teléfono (al menos 7 números)">
                        <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
                    </div>

                    <div class="form-group">
                        <label for="input-pass">Ingrese su nueva contraseña</label>
                        <input maxlength="40" v-model="newInfo.pass.password" type="password" class="form-control" id="input-pass" placeholder="Contraseña">
                        <input maxlength="40" v-model="newInfo.pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repetir contraseña">
                        <span class="error" v-if="passError.state"> {{phoneError.message}} </span>
                    </div>

                    <div class="checkbox" >
                        <label >
                            <input type="checkbox"  v-model="newInfo.active"> Usuario activo
                        </label>
                    </div>
                    
                    <div class="row">
                        <div class="checkbox col-md-19" >
                            <label >
                                <input type="checkbox"  v-model="newInfo.banned"> Usuario suspendido
                            </label>
                        </div>
                        <div class="col-md-5 text-right">
                            <button class="btn btn-primary" v-on:click="save">Grabar</button>
                        </div>
                    </div>
                </div>
        </div>
        <div v-else class="col-xs-24 col-sm-16 col-md-16">
            <p slot="no-data" class="alert alert-warning"  role="alert">Seleccione alguna persona</p>
        </div>
    </div>
</div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import {Thread} from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import { inputIsNumber } from '../../services/utility';
import dialogs from '../../services/dialogs.js';
import router from '../../router';

export default {
    // TODO fix css names
    // TODO search by facebook
    name: 'admin-users',
    data () {
        return {
            textSearch: '',
            userList: [],
            currentUser: '',
            newInfo: {
                name: '',
                email: '',
                description: '',
                nro_doc: '',
                mobile_phone: '',
                pass: {},
                active: '',
                banned: ''
            },
            error: null,
            globalError: false,
            nombreError: new Error(),
            descError: new Error(),
            passError: new Error(),
            dniError: new Error(),
            phoneError: new Error(),
            emailError: new Error()
        };
    },

    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        })
    },

    methods: {
        ...mapActions({
            update: 'auth/adminUpdate',
            search: 'auth/searchUsers',
            lookConversation: 'conversations/createConversation'

        }),

        onSearchUsers () {
            this.search(this.textSearch)
            .then((data) => {
                this.userList = data.data;
                // console.log('pas');
                // FIXME seleccionar usuario a veces congela la lista
            });
        },
        selectUser (user) {
            this.currentUser = user;
            this.newInfo = {
                name: this.currentUser.name,
                email: this.currentUser.email,
                description: this.currentUser.description,
                nro_doc: this.currentUser.nro_doc,
                mobile_phone: this.currentUser.mobile_phone,
                pass: {},
                active: this.currentUser.active,
                user: {}
            };
        },
        toUserMessages (user) {
            this.lookConversation(user).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
                // });
            });
        },

        isNumber (value) {
            inputIsNumber(value);
        },
        validate () {
            let globalError = false;
            this.nombreError = new Error();
            this.descError = new Error();
            this.passError = new Error();
            this.dniError = new Error();
            this.emailError = new Error();
            this.phoneError = new Error();

            if (!this.newInfo.name || this.newInfo.name.length < 1) {
                this.nombreError.state = true;
                this.nombreError.message = 'Olvidaste ingresar tu nombre y apellido.';
                globalError = true;
            }

            if (!this.newInfo.description || this.newInfo.description.length < 1) {
                this.descError.state = true;
                this.descError.message = 'Olvidaste completar tu descripción.';
                globalError = true;
            } else if (this.newInfo.description.replace(' ', '').length < 10) {
                this.descError.state = true;
                this.descError.message = 'Ups! Tu descripción es muy acotada. No seas tímido, contanos un poco más.';
                globalError = true;
            }

            if (this.newInfo.nro_doc && this.newInfo.nro_doc.length > 0 && this.newInfo.nro_doc.length < 7) {
                // this.dniError.state = true;
                // this.dniError.message = 'El DNI que ingresaste no es válido.';
                this.$set(this.dniError, 'state', true);
                this.$set(this.dniError, 'message', 'asdasdasdasd');

                globalError = true;
            }

            if (this.newInfo.mobile_phone && this.newInfo.mobile_phone.length > 0 && this.newInfo.mobile_phone.length < 6) {
                this.phoneError.state = true;
                this.phoneError.message = 'El teléfono que ingresaste no es válido.';
                globalError = true;
            }

            if (this.newInfo.pass.password && this.newInfo.pass.password !== this.newInfo.pass.password_confirmation) {
                this.passError = 'Password no coincide';
                globalError = true;
            }
            if (globalError) {
                this.$forceUpdate();
            }
            return globalError;
        },

        save () {
            if (!this.validate()) {
                this.newInfo.user = this.currentUser;
                this.update(this.newInfo);
                this.onSearchUsers();
                dialogs.message('Perfil actualizado correctamente.');
            } else {
                dialogs.message('Verifique los campos', { estado: 'error' });
            }
        }
    },

    beforeDestroy () {
        this.thread.stop();
        this.select(null);
    },

    watch: {
        isMobile: function () {
            if (!this.isMobile) {
                // router.push({ name: 'conversation-chat' });
            }
        },
        textSearch: function (newValue, oldValue) {
            if (oldValue.length === 0 && newValue.length > 0) {
                this.clear();
            }
        }
    },

    mounted () {
        this.conversationsSearch();
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        this.thread.run(20000);
    },
    updated () {
    },
    components: {
        Loading
    }
};
</script>

<style scoped>

    .medium-icon {
        font-size: 1.5em;
    }

    .bottom-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .settings-container {
        padding: 10px;
    }

    .user-settings {
        background-color: #FFF;
        border: 1px solid #DDDDDD;
    }

    .app-container.white {
        background-color: #fff;
    }
    .conversation-component.container {
        width: auto;
    }
    .conversation_chat p,
    .message_text {
        font-size: 13px;
    }
    .conversation_chat h2 {
        font-size: 25px;
        margin-top: .2em;
        margin-bottom: 0;
    }
    .chat_last_connection {
        margin: .4rem 0;
    }

    .btn-full-width {
        width: 100%;
        margin: 0 0 .8em 0;
    }

    .message-wrapper {
        text-align: left;
        margin-bottom: .4em;
    }
    .conversation-component.container {
        margin-bottom: 3rem;
    }
    .conversation_chat--search > li {
        color: #009ce1;
        cursor: pointer;
    }
    .conversation_chat--search > li:hover {
        background-color: #eee;
    }
    .conversation_chat--search li.list-group-item:last-child {
        border-bottom-width: 1px;
    }
    .conversation-title {
        font-size: 14px;
    }
    .list-group-item {
        font-size: 14px;
    }
    .list-group-item.unread,
    .list-group-item.unread:hover,
    .list-group-item.unread:focus {
        background: rgba(254, 153, 0, .25);
    }

    .conversation_chat,
    .conversation_chat > div,
    .conversation-component.container .row,
    .conversation-component > .row > div,
    .conversation-component > .row > div > div,
    .conversation_list .list-group
    {
        height: auto;
    }

    .form-control {
        margin-bottom: 0px;
    }
    .conversation-component.container {
        height: auto;
        overflow-y: auto;
    }


    @media only screen and (min-width: 768px) {
        .conversation-title {
            font-size: 18px;
        }
        .conversation_chat p,
        .message_text {
            font-size: 14px;
        }
        .conversation_chat h2 {
            font-size: 22px;
        }
        .conversation_chat p.chat_last_connection {
            font-size: 13px;
            margin: 0;
        }
        .app-container {
            background-color: transparent;
        }

        .conversation-component > .row {
            padding-left: 20px;
            padding-right: 20px;
        }

    }
</style>
