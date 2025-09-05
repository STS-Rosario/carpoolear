<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="conversation-component container">
            <div class="row">
                <div class="col-md-20 col-md-offset-2">
                    <div class="col-sm-8 col-md-8">
                        <div class="conversation_list">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="up">
                                        <input
                                            v-model="textSearch"
                                            v-on:keyup="onSearchUsers"
                                            type="text"
                                            class="form-control"
                                            placeholder="Escribe un nombre y presiona buscar"
                                        />
                                    </div>
                                </li>
                                <template v-if="textSearch.length != 0">
                                    <Loading
                                        class="conversation_chat--chats"
                                        :data="userList"
                                    >
                                        <li
                                            v-for="user in userList"
                                            class="list-group-item conversation_header"
                                            @click="selectUser(user)"
                                            v-bind:key="user.id"
                                        >
                                            <div class="media">
                                                <div
                                                    class="media-right pull-right"
                                                >
                                                    <button
                                                        class="btn btn-success btn-circle"
                                                        v-on:click.stop="
                                                            toUserMessages(user)
                                                        "
                                                    >
                                                        <i
                                                            class="fa fa-comments medium-icon"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </button>
                                                </div>
                                                <div class="media-left">
                                                    <div
                                                        class="conversation_image circle-box"
                                                        v-imgSrc:profile="
                                                            user.image
                                                        "
                                                    ></div>
                                                </div>
                                                <div class="media-body">
                                                    <h4 class="media-heading">
                                                        <span
                                                            class="conversation-title"
                                                        >
                                                            {{ user.name }}
                                                        </span>
                                                    </h4>
                                                    <span>
                                                        {{ user.email }}
                                                    </span>
                                                    <span
                                                        style="display: block"
                                                    >
                                                        {{ user.nro_doc }} -
                                                        {{ user.mobile_phone }}
                                                    </span>
                                                    <span
                                                        style="display: block"
                                                    >
                                                        {{
                                                            user.last_connection
                                                        }}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li
                                            slot="no-data"
                                            class="list-group-item alert alert-warning"
                                            role="alert"
                                        >
                                            No se encontro ningun usuario
                                        </li>
                                        <li
                                            slot="loading"
                                            class="list-group-item alert alert-info"
                                            role="alert"
                                        >
                                            <img
                                                src="https://carpoolear.com.ar/static/img/loader.gif"
                                                alt=""
                                                class="ajax-loader"
                                            />
                                            Cargando usuarios ...
                                        </li>
                                    </Loading>
                                </template>
                            </ul>
                        </div>
                    </div>
                    <div
                        v-if="currentUser"
                        class="user-settings col-xs-24 col-sm-16 col-md-16"
                    >
                        <div class="settings-container">
                            <div class="form-group">
                                <label for="input-name"
                                    >Nombre y apellido</label
                                >
                                <input
                                    maxlength="25"
                                    v-model="newInfo.name"
                                    type="text"
                                    class="form-control"
                                    id="input-name"
                                    placeholder="Nombre"
                                />
                                <span class="error" v-if="nombreError.state">
                                    {{ nombreError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-email">E-mail</label>
                                <input
                                    maxlength="40"
                                    v-model="newInfo.email"
                                    type="text"
                                    class="form-control"
                                    id="input-email"
                                    placeholder="E-mail"
                                />
                            </div>

                            <div class="form-group">
                                <label for="input-description"
                                    >Acerca de mi</label
                                >
                                <textarea
                                    maxlength="1000"
                                    v-model="newInfo.description"
                                    placeholder="Descripción"
                                ></textarea>
                                <span
                                    class="error textarea"
                                    v-if="descError.state"
                                >
                                    {{ descError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-private-note"
                                    >Nota privada</label
                                >
                                <textarea
                                    maxlength="1000"
                                    v-model="newInfo.private_note"
                                    placeholder="Nota sólo visible por admins"
                                ></textarea>
                            </div>

                            <div class="form-group">
                                <label for="input-dni"
                                    >Número de documento</label
                                >
                                <input
                                    v-numberMask="'dniRawValue'"
                                    type="text"
                                    data-max-length="8"
                                    v-model="newInfo.nro_doc"
                                    class="form-control"
                                    id="input-dni"
                                    placeholder="DNI"
                                />
                                <span class="error" v-if="dniError.state">
                                    {{ dniError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-telefono"
                                    >Número de teléfono</label
                                >
                                <input
                                    maxlength="20"
                                    @keydown="isNumber"
                                    v-on:paste="isNumber"
                                    v-model="newInfo.mobile_phone"
                                    type="tel"
                                    class="form-control"
                                    id="input-phone"
                                    placeholder="Número de teléfono (al menos 7 números)"
                                />
                                <span class="error" v-if="phoneError.state">
                                    {{ phoneError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-patente"
                                    >{{ $t('patente') }}</label
                                >
                                <input
                                    maxlength="20"
                                    v-model="newInfo.patente"
                                    type="text"
                                    class="form-control"
                                    id="input-patente"
                                    :class="{ 'has-error': patenteError.state }"
                                    :placeholder="$t('patente')"
                                />
                                <span class="error" v-if="patenteError.state">
                                    {{ patenteError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-pass"
                                    >Ingrese su nueva contraseña</label
                                >
                                <input
                                    maxlength="40"
                                    v-model="newInfo.pass.password"
                                    type="password"
                                    class="form-control"
                                    id="input-pass"
                                    placeholder="Contraseña"
                                />
                                <input
                                    maxlength="40"
                                    v-model="newInfo.pass.password_confirmation"
                                    type="password"
                                    class="form-control"
                                    id="input-pass-confirm"
                                    placeholder="Repetir contraseña"
                                />
                                <span class="error" v-if="passError.state">
                                    {{ phoneError.message }}
                                </span>
                            </div>
                            <hr />
                            <div
                                class="row"
                                v-if="
                                    newInfo.driver_data_docs &&
                                    newInfo.driver_data_docs.length &&
                                    settings.module_validated_drivers
                                "
                            >
                                <h4 class="col-xs-24">
                                    Documentación del chofer
                                </h4>
                                <div
                                    v-imgSrc:docs="img"
                                    v-for="img in newInfo.driver_data_docs"
                                    class="img-doc col-md-8 col-sm-12"
                                ></div>
                            </div>
                            <div
                                class="form-group"
                                v-if="settings.module_validated_drivers"
                            >
                                <label for="tipoDeCuenta">
                                    {{ $t('tipoDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        title="Campo requerido"
                                    >
                                        (*)
                                    </span>
                                </label>
                                <select
                                    v-model="newInfo.account_type"
                                    id="tipoDeCuenta"
                                    class="form-control"
                                >
                                    <option
                                        v-for="option in accountTypes"
                                        v-bind:value="option.id"
                                    >
                                        {{ option.name }}
                                    </option>
                                </select>
                                <span
                                    class="error"
                                    v-if="accountTypeError.state"
                                >
                                    {{ accountTypeError.message }}
                                </span>
                            </div>
                            <div
                                class="form-group"
                                v-if="settings.module_validated_drivers"
                            >
                                <label for="bancoDeCuenta">
                                    {{ $t('bancoDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        title="Campo requerido"
                                    >
                                        (*)
                                    </span>
                                </label>
                                <select
                                    v-model="newInfo.account_bank"
                                    id=""
                                    class="form-control"
                                >
                                    <option
                                        v-for="option in banks"
                                        v-bind:value="option.id"
                                    >
                                        {{ option.name }}
                                    </option>
                                </select>
                                <span
                                    class="error"
                                    v-if="accountBankError.state"
                                >
                                    {{ accountBankError.message }}
                                </span>
                            </div>
                            <div
                                class="form-group"
                                v-if="settings.module_validated_drivers"
                            >
                                <label for="accountNumber">
                                    {{ $t('numeroDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        title="Campo requerido"
                                    >
                                        (*)
                                    </span>
                                </label>
                                <input
                                    v-model="newInfo.account_number"
                                    type="text"
                                    class="form-control"
                                    id="accountNumber"
                                    :placeholder="$t('numeroDeCuenta')"
                                />
                                <span
                                    class="error"
                                    v-if="accountNumberError.state"
                                >
                                    {{ accountNumberError.message }}
                                </span>
                            </div>
                            <div
                                class="checkbox"
                                v-if="settings.module_validated_drivers"
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="newInfo.driver_is_verified"
                                    />
                                    Es chofer
                                </label>
                            </div>
                            <hr />
                            <div class="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="newInfo.active"
                                    />
                                    Usuario activo
                                </label>
                            </div>

                            <div class="row">
                                <div class="checkbox col-md-19">
                                    <label>
                                        <input
                                            type="checkbox"
                                            v-model="newInfo.banned"
                                        />
                                        Usuario suspendido
                                    </label>
                                </div>
                                <div class="col-md-5 text-right">
                                    <button
                                        class="btn btn-primary"
                                        v-on:click="save"
                                    >
                                        Grabar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-xs-24 col-sm-16 col-md-16">
                        <p
                            slot="no-data"
                            class="alert alert-warning"
                            role="alert"
                        >
                            Seleccione alguna persona
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { Thread } from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import { inputIsNumber } from '../../services/utility';
import dialogs from '../../services/dialogs.js';
import router from '../../router';
import adminNav from '../sections/adminNav';

export default {
    // TODO fix css names
    // TODO search by facebook
    name: 'admin-users',
    data() {
        return {
            textSearch: '',
            userList: [],
            currentUser: '',
            newInfo: {
                name: '',
                email: '',
                description: '',
                private_note: '',
                nro_doc: '',
                mobile_phone: '',
                pass: {},
                active: '',
                banned: '',
                driver_is_verified: 0,
                driver_data_docs: [],
                account_number: '',
                account_type: '',
                account_bank: '',
                cars: [],
                patente: ''
            },
            error: null,
            globalError: false,
            nombreError: new Error(),
            descError: new Error(),
            passError: new Error(),
            dniError: new Error(),
            phoneError: new Error(),
            emailError: new Error(),
            accountNumberError: new Error(),
            accountTypeError: new Error(),
            accountBankError: new Error(),
            patenteError: new Error(),
            keyUpTimerId: 0,
            banks: [],
            accountTypes: []
        };
    },

    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile',
            settings: 'auth/appConfig'
        })
    },

    methods: {
        ...mapActions({
            update: 'admin/adminUpdate',
            search: 'admin/searchUsers',
            lookConversation: 'conversations/createConversation',
            getBankData: 'profile/getBankData'
        }),

        onSearchUsers() {
            if (this.keyUpTimerId) {
                clearTimeout(this.keyUpTimerId);
            }
            this.keyUpTimerId = setTimeout(() => {
                this.search(this.textSearch).then((data) => {
                    this.userList = data.data;
                    // console.log('pas');
                    // FIXME seleccionar usuario a veces congela la lista
                });
            }, 750);
        },
        selectUser(user) {
            this.currentUser = user;
            console.log('selectUser', user);
            this.newInfo = {
                name: this.currentUser.name,
                email: this.currentUser.email,
                description: this.currentUser.description,
                private_note: this.currentUser.private_note,
                nro_doc: this.currentUser.nro_doc,
                mobile_phone: this.currentUser.mobile_phone,
                pass: {},
                user: {},
                driver_is_verified: this.currentUser.driver_is_verified,
                driver_data_docs: this.currentUser.driver_data_docs,
                account_number: this.currentUser.account_number,
                account_type: this.currentUser.account_type,
                account_bank: this.currentUser.account_bank,
                banned: this.currentUser.banned > 0,
                active: this.currentUser.active > 0,
                cars: this.currentUser.cars || [],
                patente: this.currentUser.cars && this.currentUser.cars.length > 0 ? this.currentUser.cars[0].patente : ''
            };
        },
        toUserMessages(user) {
            console.log('toUserMessages');
            this.lookConversation({ user: user, tripId: null }).then(
                (conversation) => {
                    console.log('toUserMessages then', conversation);
                    router.push({
                        name: 'conversation-chat',
                        params: { id: conversation.id }
                    });
                }
            );
        },

        isNumber(value) {
            inputIsNumber(value);
        },
        clear() {
            this.currentUser = '';
            this.newInfo = {
                name: '',
                email: '',
                description: '',
                private_note: '',
                nro_doc: '',
                mobile_phone: '',
                pass: {},
                active: '',
                banned: '',
                driver_is_verified: 0,
                driver_data_docs: [],
                account_number: '',
                account_type: '',
                account_bank: '',
                cars: [],
                patente: ''
            };
        },
        conversationsSearch() {
            // Placeholder method - may be implemented later
        },
        unreadMessage() {
            // Placeholder method - may be implemented later
        },
        select(user) {
            if (user) {
                this.selectUser(user);
            } else {
                this.clear();
            }
        },
        validate() {
            let globalError = false;
            this.nombreError = new Error();
            this.descError = new Error();
            this.passError = new Error();
            this.dniError = new Error();
            this.emailError = new Error();
            this.phoneError = new Error();
            this.accountNumberError = new Error();
            this.accountTypeError = new Error();
            this.accountBankError = new Error();
            this.patenteError = new Error();

            /* if (!this.newInfo.name || this.newInfo.name.length < 1) {
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
            } */

            // Validate patente if provided - allow all strings
            if (this.newInfo.patente && this.newInfo.patente.length > 0) {
                // Basic validation: just check it's not empty and has reasonable length
                if (this.newInfo.patente.length > 20) {
                    this.patenteError.state = true;
                    this.patenteError.message = 'La patente no puede tener más de 20 caracteres';
                    globalError = true;
                }
            }

            console.log('error', this);

            if (globalError) {
                this.$forceUpdate();
            }
            return globalError;
        },

        save() {
            if (!this.validate()) {
                this.newInfo.user = this.currentUser;
                if (this.newInfo.pass && this.newInfo.pass.password) {
                    this.newInfo.password = this.newInfo.pass.password;
                    this.newInfo.password_confirmation =
                        this.newInfo.pass.password_confirmation;
                }
                
                // Handle patente data - if user has cars, update the first car's patente
                // If no cars but patente is provided, the backend will create a new car
                if (this.newInfo.patente && this.newInfo.patente.length > 0) {
                    if (this.newInfo.cars && this.newInfo.cars.length > 0) {
                        // Update existing car's patente
                        this.newInfo.cars[0].patente = this.newInfo.patente;
                    } else {
                        // Create new car with patente - backend will handle this
                        this.newInfo.cars = [{ patente: this.newInfo.patente }];
                    }
                }
                
                this.update(this.newInfo)
                    .then(() => {
                        dialogs.message('Perfil actualizado correctamente.');
                    })
                    .catch((err) => {
                        console.log(err);
                        let mensajeErr = 'Error al actualizar: ';
                        for (const key in err.errors) {
                            if (Object.hasOwnProperty.call(err.errors, key)) {
                                mensajeErr += err.errors[key] + ' ';
                            }
                        }
                        dialogs.message(mensajeErr, {
                            duration: 10,
                            estado: 'error'
                        });
                    });
                this.onSearchUsers();
            } else {
                dialogs.message('Verifique los campos', { estado: 'error' });
            }
        }
    },

    beforeDestroy() {
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
        },
        'newInfo.patente': function () {
            this.patenteError.state = false;
        }
    },

    mounted() {
        this.getBankData().then((data) => {
            console.log('get bank data', data);
            this.banks = data.banks;
            this.accountTypes = data.cc;
        });
        this.conversationsSearch();
        this.thread = new Thread(() => {
            this.unreadMessage();
        });
        this.thread.run(20000);
    },
    updated() {},
    components: {
        Loading,
        adminNav
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
    background-color: #fff;
    border: 1px solid #dddddd;
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
    margin-top: 0.2em;
    margin-bottom: 0;
}
.chat_last_connection {
    margin: 0.4rem 0;
}

.btn-full-width {
    width: 100%;
    margin: 0 0 0.8em 0;
}

.message-wrapper {
    text-align: left;
    margin-bottom: 0.4em;
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
    background: rgba(254, 153, 0, 0.25);
}

.conversation_chat,
.conversation_chat > div,
.conversation-component.container .row,
.conversation-component > .row > div,
.conversation-component > .row > div > div,
.conversation_list .list-group {
    height: auto;
}

.form-control {
    margin-bottom: 0px;
}
.conversation-component.container {
    height: auto;
    overflow-y: auto;
}
.img-doc {
    height: 320px;
    background-size: cover;
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
