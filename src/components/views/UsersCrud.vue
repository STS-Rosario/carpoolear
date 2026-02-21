<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="conversation-component container">
            <div class="row">
                <router-link
                        :to="{ name: 'admin-users-delete-list' }"
                        class="btn btn-link"
                        style="display: block; text-align: center; margin-top: -10px;margin-bottom: 10px;font-size: 16px;"
                    >
                        {{ t('pedidosDeEliminacionDeCuenta') }}
                    </router-link>
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
                                            :placeholder="t('escribeUnNombreYPresionaBuscar')"
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
                                        <template #no-data>
                                            <li
                                                class="list-group-item alert alert-warning"
                                                role="alert"
                                            >
                                                {{ t('noSeEncontroNingunUsuario') }}
                                            </li>
                                        </template>
                                        <template #loading>
                                            <li
                                                class="list-group-item alert alert-info"
                                                role="alert"
                                            >
                                                <img
                                                    src="https://carpoolear.com.ar/static/img/loader.gif"
                                                    alt=""
                                                    class="ajax-loader"
                                                />
                                                {{ t('cargandoUsuarios') }}
                                            </li>
                                        </template>
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
                                    >{{ t('nombreYApellido') }}</label
                                >
                                <input
                                    maxlength="25"
                                    v-model="newInfo.name"
                                    type="text"
                                    class="form-control"
                                    id="input-name"
                                    :placeholder="t('nombre')"
                                />
                                <span class="error" v-if="nombreError.state">
                                    {{ nombreError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-email">{{ t('eMail') }}</label>
                                <input
                                    maxlength="40"
                                    v-model="newInfo.email"
                                    type="text"
                                    class="form-control"
                                    id="input-email"
                                    :placeholder="t('eMail')"
                                />
                            </div>

                            <div class="form-group">
                                <label for="input-description"
                                    >{{ t('acercaDeMi') }}</label
                                >
                                <textarea
                                    maxlength="1000"
                                    v-model="newInfo.description"
                                    :placeholder="t('descripcion')"
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
                                    >{{ t('notaPrivada') }}</label
                                >
                                <textarea
                                    maxlength="1000"
                                    v-model="newInfo.private_note"
                                    :placeholder="t('notaSoloVisiblePorAdmins')"
                                ></textarea>
                            </div>

                            <div class="form-group">
                                <label for="input-dni"
                                    >{{ t('numeroDeDocumento') }}</label
                                >
                                <input
                                    type="tel"
                                    v-model="newInfo.nro_doc"
                                    @input="handleDniInput"
                                    class="form-control"
                                    id="input-dni"
                                    :placeholder="t('doc')"
                                    :maxlength="(settings.profile_id_format).length"
                                />
                                <span class="error" v-if="dniError.state">
                                    {{ dniError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-telefono"
                                    >{{ t('numeroDeTelefono') }}</label
                                >
                                <input
                                    maxlength="20"
                                    @keydown="isNumber"
                                    v-on:paste="isNumber"
                                    v-model="newInfo.mobile_phone"
                                    type="tel"
                                    class="form-control"
                                    id="input-phone"
                                    :placeholder="t('numeroDeTelefonoAlMenos7Numeros')"
                                />
                                <span class="error" v-if="phoneError.state">
                                    {{ phoneError.message }}
                                </span>
                            </div>

                            <div class="form-group">
                                <label for="input-patente"
                                    >{{ t('patente') }}</label
                                >
                                <input
                                    maxlength="20"
                                    v-model="newInfo.patente"
                                    type="text"
                                    class="form-control"
                                    id="input-patente"
                                    :class="{ 'has-error': patenteError.state }"
                                    :placeholder="t('patente')"
                                />
                                <span class="error" v-if="patenteError.state">
                                    {{ patenteError.message }}
                                </span>
                            </div>

                            <div
                                v-if="newInfo.identity_validated_at"
                                class="form-group"
                            >
                                <label>{{ $t('identidadValidada') }}</label>
                                <p class="text-muted">
                                    {{ $t('identidadValidadaTooltip') }}
                                </p>
                                <button
                                    type="button"
                                    class="btn btn-warning"
                                    :disabled="clearingIdentity"
                                    @click="confirmClearIdentityValidation"
                                >
                                    {{ $t('removerValidacionIdentidad') }}
                                </button>
                            </div>

                            <div class="form-group">
                                <label for="input-pass"
                                    >{{ t('ingreseSuNuevaContrasena') }}</label
                                >
                                <input
                                    maxlength="40"
                                    v-model="newInfo.pass.password"
                                    type="password"
                                    class="form-control"
                                    id="input-pass"
                                    :placeholder="t('contrasena')"
                                    autocomplete="new-password"
                                />
                                <input
                                    maxlength="40"
                                    v-model="newInfo.pass.password_confirmation"
                                    type="password"
                                    class="form-control"
                                    id="input-pass-confirm"
                                    :placeholder="t('repetirContrasena')"
                                    autocomplete="new-password"
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
                                    {{ t('documentacionDelChofer') }}
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
                                    {{ t('tipoDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        :title="t('tituloCampoRequerido')"
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
                                    {{ t('bancoDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        :title="t('tituloCampoRequerido')"
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
                                    {{ t('numeroDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        :title="t('tituloCampoRequerido')"
                                    >
                                        (*)
                                    </span>
                                </label>
                                <input
                                    v-model="newInfo.account_number"
                                    type="text"
                                    class="form-control"
                                    id="accountNumber"
                                    :placeholder="t('numeroDeCuenta')"
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
                                    {{ t('esChofer') }}
                                </label>
                            </div>
                            <hr />
                            <div class="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="newInfo.active"
                                    />
                                    {{ t('usuarioActivo') }}
                                </label>
                            </div>

                            <div class="row">
                                <div class="checkbox col-md-19">
                                    <label>
                                        <input
                                                type="checkbox"
                                                v-model="newInfo.banned"
                                            />
                                        {{ t('usuarioSuspendido') }}
                                    </label>
                                </div>
                                <div class="col-md-5 text-right">
                                    <button
                                        class="btn btn-primary"
                                        v-on:click="save"
                                    >
                                        {{ t('grabar') }}
                                    </button>
                                </div>
                            </div>
                            <hr />
                            <div class="row" style="margin-top: 1em;">
                                <div class="col-md-24">
                                    <button
                                        class="btn btn-danger btn-sm"
                                        v-on:click="openConfirmModal('delete')"
                                        style="margin-right: 8px;"
                                    >
                                        {{ t('eliminarUsuario') }}
                                    </button>
                                    <button
                                        class="btn btn-warning btn-sm"
                                        v-on:click="openConfirmModal('anonymize')"
                                        style="margin-right: 8px;"
                                    >
                                        {{ t('anonimizarUsuario') }}
                                    </button>
                                    <button
                                        class="btn btn-warning btn-sm"
                                        v-on:click="openConfirmModal('banAndAnonymize')"
                                    >
                                        {{ t('anonimizarYBloquearUsuario') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="col-xs-24 col-sm-16 col-md-16">
                        <p
                            class="alert alert-warning"
                            role="alert"
                        >
                            {{ t('seleccioneAlgunaPersona') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <modal
            v-if="showConfirmModal"
            :name="'modal-confirm-admin-action'"
            @close="closeConfirmModal"
        >
            <template #header>
                <h3>
                    <span>{{ confirmModalTitle }}</span>
                    <i v-on:click="closeConfirmModal" class="fa fa-times float-right-close"></i>
                </h3>
            </template>
            <template #body>
                <div class="text-left color-black">
                    <p>{{ confirmModalMessage }}</p>
                    <div v-if="pendingAction === 'banAndAnonymize'" class="form-group">
                        <label>{{ t('nota') }} ({{ t('opcional') }})</label>
                        <input v-model="banNote" type="text" class="form-control" />
                    </div>
                    <div class="text-center" style="margin-top: 1.5em;">
                        <button
                            class="btn btn-danger"
                            @click="executePendingAction"
                            :disabled="loadingAction"
                        >
                            <span v-if="!loadingAction">{{ t('confirmar') }}</span>
                            <spinner v-if="loadingAction" class="blue"></spinner>
                        </button>
                        <button class="btn btn-default" @click="closeConfirmModal" style="margin-left: 8px;">
                            {{ t('cancelar') }}
                        </button>
                    </div>
                </div>
            </template>
        </modal>
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import { useAdminStore } from '@/stores/admin';
import { useConversationsStore } from '@/stores/conversations';
import { useProfileStore } from '@/stores/profile';
import { Thread } from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import { inputIsNumber, formatId, cleanId } from '../../services/utility';
import dialogs from '../../services/dialogs.js';
import adminNav from '../sections/adminNav';
import modal from '../Modal';
import Spinner from '../Spinner.vue';
import { AdminApi, UserApi } from '../../services/api';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();
const adminStore = useAdminStore();
const conversationsStore = useConversationsStore();
const profileStore = useProfileStore();

const textSearch = ref('');
const userList = ref([]);
const currentUser = ref('');
const newInfo = reactive({
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
});
const error = ref(null);
const globalError = ref(false);
const nombreError = reactive({ state: false, message: '' });
const descError = reactive({ state: false, message: '' });
const passError = reactive({ state: false, message: '' });
const dniError = reactive({ state: false, message: '' });
const phoneError = reactive({ state: false, message: '' });
const emailError = reactive({ state: false, message: '' });
const accountNumberError = reactive({ state: false, message: '' });
const accountTypeError = reactive({ state: false, message: '' });
const accountBankError = reactive({ state: false, message: '' });
const patenteError = reactive({ state: false, message: '' });
let keyUpTimerId = 0;
const banks = ref([]);
const accountTypes = ref([]);
let thread = null;
const showConfirmModal = ref(false);
const pendingAction = ref(null);
const loadingAction = ref(false);
const banNote = ref('');
const adminApi = ref(null);
const userApi = ref(null);

const isMobile = computed(() => deviceStore.isMobile);
const settings = computed(() => authStore.appConfig);

const clearingIdentity = ref(false);

const confirmModalTitle = computed(() => {
    if (pendingAction.value === 'delete') return t('confirmarEliminarUsuario');
    if (pendingAction.value === 'anonymize') return t('confirmarAnonimizarUsuario');
    if (pendingAction.value === 'banAndAnonymize') return t('confirmarAnonimizarYBloquearUsuario');
    return '';
});

const confirmModalMessage = computed(() => {
    if (pendingAction.value === 'delete') return t('confirmarEliminarUsuarioMensaje');
    if (pendingAction.value === 'anonymize') return t('confirmarAnonimizarUsuarioMensaje');
    if (pendingAction.value === 'banAndAnonymize') return t('confirmarAnonimizarYBloquearUsuarioMensaje');
    return '';
});

const onSearchUsers = () => {
    if (keyUpTimerId) {
        clearTimeout(keyUpTimerId);
    }
    keyUpTimerId = setTimeout(() => {
        adminStore.searchUsers(textSearch.value).then((data) => {
            userList.value = data.data;
        });
    }, 750);
};

const confirmClearIdentityValidation = () => {
    if (!currentUser.value || !currentUser.value.id) return;
    if (!confirm(t('confirmarRemoverValidacionIdentidad'))) return;
    doClearIdentityValidation();
};

const doClearIdentityValidation = () => {
    if (!currentUser.value || !currentUser.value.id) return;
    clearingIdentity.value = true;
    const api = new AdminApi();
    api.clearIdentityValidation(currentUser.value.id)
        .then(() => {
            newInfo.identity_validated = false;
            newInfo.identity_validated_at = null;
            currentUser.value.identity_validated = false;
            currentUser.value.identity_validated_at = null;
            dialogs.message(t('validacionIdentidadRemovida'));
        })
        .catch(() => {
            dialogs.message(t('resultError'), { estado: 'error' });
        })
        .finally(() => {
            clearingIdentity.value = false;
        });
};

const selectUser = (user) => {
    currentUser.value = user;
    const nroDocRaw = currentUser.value.nro_doc
        ? cleanId(currentUser.value.nro_doc, settings.value.profile_id_format)
        : '';
    Object.assign(newInfo, {
        name: currentUser.value.name,
        email: currentUser.value.email,
        description: currentUser.value.description,
        private_note: currentUser.value.private_note,
        nro_doc: nroDocRaw,
        mobile_phone: currentUser.value.mobile_phone,
        pass: {},
        user: {},
        driver_is_verified: currentUser.value.driver_is_verified,
        driver_data_docs: currentUser.value.driver_data_docs,
        account_number: currentUser.value.account_number,
        account_type: currentUser.value.account_type,
        account_bank: currentUser.value.account_bank,
        banned: currentUser.value.banned > 0,
        active: currentUser.value.active > 0,
        cars: currentUser.value.cars || [],
        patente: currentUser.value.cars && currentUser.value.cars.length > 0 ? currentUser.value.cars[0].patente : '',
        identity_validated: currentUser.value.identity_validated,
        identity_validated_at: currentUser.value.identity_validated_at
    });
    if (newInfo.nro_doc) {
        newInfo.nro_doc = formatId(newInfo.nro_doc, settings.value.profile_id_format);
    }
};

const toUserMessages = (user) => {
    console.log('toUserMessages');
    conversationsStore.createConversation({ user: user, tripId: null }).then(
        (conversation) => {
            console.log('toUserMessages then', conversation);
            router.push({
                name: 'conversation-chat',
                params: { id: conversation.id }
            });
        }
    );
};

const isNumber = (value) => {
    inputIsNumber(value);
};

const handleDniInput = (event) => {
    const formatted = formatId(event.target.value, settings.value.profile_id_format);
    event.target.value = formatted;
    newInfo.nro_doc = formatted;
};

const clear = () => {
    currentUser.value = '';
    Object.assign(newInfo, {
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
    });
};

const conversationsSearch = () => {
    // Placeholder method
};

const unreadMessage = () => {
    // Placeholder method
};

const select = (user) => {
    if (user) {
        selectUser(user);
    } else {
        clear();
    }
};

const loadUserFromQuery = () => {
    const userId = route.query.userId;
    if (!userId) return;
    userApi.value.show(userId).then((response) => {
        const user = response.data;
        if (user) {
            selectUser(user);
            textSearch.value = user.name || '';
            userList.value = [user];
        }
    }).catch(() => {
        dialogs.message(t('noSeEncontroNingunUsuario'), { estado: 'error' });
    });
};

const openConfirmModal = (action) => {
    pendingAction.value = action;
    banNote.value = '';
    showConfirmModal.value = true;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
    pendingAction.value = null;
    banNote.value = '';
};

const executePendingAction = () => {
    if (!currentUser.value || !currentUser.value.id) return;
    loadingAction.value = true;
    const api = adminApi.value;
    let promise;
    if (pendingAction.value === 'delete') {
        promise = api.deleteUser(currentUser.value.id);
    } else if (pendingAction.value === 'anonymize') {
        promise = api.anonymizeUser(currentUser.value.id);
    } else if (pendingAction.value === 'banAndAnonymize') {
        promise = api.banAndAnonymizeUser(currentUser.value.id, banNote.value);
    } else {
        loadingAction.value = false;
        return;
    }
    const userId = currentUser.value.id;
    promise
        .then(() => {
            loadingAction.value = false;
            closeConfirmModal();
            clear();
            userList.value = userList.value.filter((u) => u.id !== userId);
            dialogs.message(t('accionCompletadaExitosamente'), {
                duration: 5,
                estado: 'success'
            });
        })
        .catch((err) => {
            loadingAction.value = false;
            const msg = (err.response && err.response.data && err.response.data.message) || err.message || t('errorAlActualizar');
            dialogs.message(msg, {
                duration: 5,
                estado: 'error'
            });
            if (err.response && err.response.data && err.response.data.error === 'requires_ban') {
                closeConfirmModal();
            }
        });
};

const validate = () => {
    let hasGlobalError = false;
    Object.assign(nombreError, { state: false, message: '' });
    Object.assign(descError, { state: false, message: '' });
    Object.assign(passError, { state: false, message: '' });
    Object.assign(dniError, { state: false, message: '' });
    Object.assign(emailError, { state: false, message: '' });
    Object.assign(phoneError, { state: false, message: '' });
    Object.assign(accountNumberError, { state: false, message: '' });
    Object.assign(accountTypeError, { state: false, message: '' });
    Object.assign(accountBankError, { state: false, message: '' });
    Object.assign(patenteError, { state: false, message: '' });

    if (newInfo.patente && newInfo.patente.length > 0) {
        if (newInfo.patente.length > 20) {
            patenteError.state = true;
            patenteError.message = t('patenteNoValida');
            hasGlobalError = true;
        }
    }

    return hasGlobalError;
};

const save = () => {
    if (!validate()) {
        newInfo.user = currentUser.value;
        if (newInfo.pass && newInfo.pass.password) {
            newInfo.password = newInfo.pass.password;
            newInfo.password_confirmation = newInfo.pass.password_confirmation;
        }

        if (newInfo.nro_doc) {
            newInfo.nro_doc = cleanId(newInfo.nro_doc, settings.value.profile_id_format);
        }

        if (newInfo.patente && newInfo.patente.length > 0) {
            if (newInfo.cars && newInfo.cars.length > 0) {
                newInfo.cars[0].patente = newInfo.patente;
            } else {
                newInfo.cars = [{ patente: newInfo.patente }];
            }
        }

        adminStore.adminUpdate(newInfo)
            .then(() => {
                dialogs.message(t('perfilActualizadoCorrectamente'));
            })
            .catch((err) => {
                console.log(err);
                let mensajeErr = t('errorAlActualizar');
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
        onSearchUsers();
    } else {
        dialogs.message(t('verifiqueLosCampos'), { estado: 'error' });
    }
};

watch(isMobile, () => {
    if (!isMobile.value) {
        // router.push({ name: 'conversation-chat' });
    }
});

watch(textSearch, (newValue, oldValue) => {
    if (oldValue.length === 0 && newValue.length > 0) {
        clear();
    }
});

watch(() => newInfo.patente, () => {
    patenteError.state = false;
});

watch(() => route.query.userId, () => {
    loadUserFromQuery();
});

onMounted(() => {
    adminApi.value = new AdminApi();
    userApi.value = new UserApi();
    profileStore.getBankData().then((data) => {
        console.log('get bank data', data);
        banks.value = data.banks;
        accountTypes.value = data.cc;
    });
    conversationsSearch();
    thread = new Thread(() => {
        unreadMessage();
    });
    thread.run(20000);
    loadUserFromQuery();
});

onBeforeUnmount(() => {
    if (thread) {
        thread.stop();
    }
    select(null);
});
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
