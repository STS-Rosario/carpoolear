<template>
    <AdminLayout>
        <div class="container admin-user-edit">
            <div class="row">
                <div class="col-md-20 col-md-offset-2">
                    <div
                        v-if="userLoading"
                        class="alert alert-info"
                    >
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoUsuarios') }}
                    </div>
                    <div
                        v-else-if="currentUser"
                        class="user-settings col-xs-24"
                    >
                        <div class="settings-container">
                            <p class="user-admin-edit-nav">
                                <AppButton
                                    variant="secondary"
                                    size="sm"
                                    :to="{
                                        name: 'admin-users-user',
                                        params: { userId: String(currentUser.id) }
                                    }"
                                >
                                    {{ $t('adminUsuariosVolverResumen') }}
                                </AppButton>
                                <button
                                    type="button"
                                    class="btn btn-link btn-sm"
                                    @click="goToListOnly"
                                >
                                    {{ $t('adminUsuariosVolverAlListado') }}
                                </button>
                            </p>
                            <AppInput
                                id="input-name"
                                maxlength="25"
                                v-model="newInfo.name"
                                :placeholder="$t('nombre')"
                                :error="nombreError.state ? nombreError.message : ''"
                            >
                                <template #label>{{ $t('nombreYApellido') }}</template>
                            </AppInput>

                            <AppInput
                                id="input-email"
                                maxlength="40"
                                v-model="newInfo.email"
                                :placeholder="$t('eMail')"
                            >
                                <template #label>{{ $t('eMail') }}</template>
                            </AppInput>

                            <AppTextarea
                                id="input-description"
                                maxlength="1000"
                                v-model="newInfo.description"
                                :placeholder="$t('descripcion')"
                                :error="descError.state ? descError.message : ''"
                            >
                                <template #label>{{ $t('acercaDeMi') }}</template>
                            </AppTextarea>

                            <AppTextarea
                                id="input-private-note"
                                maxlength="1000"
                                v-model="newInfo.private_note"
                                :placeholder="$t('notaSoloVisiblePorAdmins')"
                            >
                                <template #label>{{ $t('notaPrivada') }}</template>
                            </AppTextarea>
                            <AppInput
                                v-if="settings.module_facebook_profile_url_enabled"
                                id="input-facebook-profile-url"
                                v-model="newInfo.facebook_profile_url"
                                type="url"
                                placeholder="https://facebook.com/tuperfil"
                                @blur="onFacebookProfileUrlBlur"
                            >
                                <template #label>
                                    Perfil de Facebook (opcional)
                                    <span class="description">
                                        Opcional. Para generar confianza podés poner tu
                                        link a tu perfil de Facebook
                                    </span>
                                </template>
                            </AppInput>

                            <AppInput
                                id="input-dni"
                                type="tel"
                                :model-value="newInfo.nro_doc"
                                @update:modelValue="onDniModelUpdate"
                                :placeholder="documentIdPlaceholder"
                                :maxlength="documentIdMaxLength"
                                :error="dniError.state ? dniError.message : ''"
                            >
                                <template #label>
                                    {{ $t('numeroDeDocumento') }}
                                    <span
                                        v-if="documentIdPlaceholder"
                                        class="description"
                                    >
                                        ({{ documentIdPlaceholder }})
                                    </span>
                                </template>
                            </AppInput>

                            <AppInput
                                id="input-phone"
                                maxlength="20"
                                type="tel"
                                @keydown="isNumber"
                                v-on:paste="isNumber"
                                v-model="newInfo.mobile_phone"
                                :placeholder="$t('numeroDeTelefonoAlMenos7Numeros')"
                                :error="phoneError.state ? phoneError.message : ''"
                            >
                                <template #label>{{ $t('numeroDeTelefono') }}</template>
                            </AppInput>

                            <AppInput
                                id="input-patente"
                                maxlength="20"
                                v-model="newInfo.patente"
                                :placeholder="$t('patente')"
                                :error="patenteError.state ? patenteError.message : ''"
                            >
                                <template #label>{{ $t('patente') }}</template>
                            </AppInput>

                            <div
                                v-if="newInfo.identity_validated_at"
                                class="form-group"
                            >
                                <label>{{ $t('identidadValidada') }}</label>
                                <p class="text-muted">
                                    {{ $t('identidadValidadaTooltip') }}
                                </p>
                                <AppButton
                                    type="button"
                                    variant="warning"
                                    :disabled="clearingIdentity"
                                    @click="confirmClearIdentityValidation"
                                >
                                    {{ $t('removerValidacionIdentidad') }}
                                </AppButton>
                            </div>

                            <AppInput
                                id="input-pass"
                                maxlength="40"
                                v-model="newInfo.pass.password"
                                password
                                :placeholder="$t('contrasena')"
                                autocomplete="new-password"
                                :error="passError.state ? passError.message : ''"
                            >
                                <template #label>{{ $t('ingreseSuNuevaContrasena') }}</template>
                            </AppInput>
                            <AppInput
                                id="input-pass-confirm"
                                maxlength="40"
                                v-model="newInfo.pass.password_confirmation"
                                password
                                :placeholder="$t('repetirContrasena')"
                                autocomplete="new-password"
                            />
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
                                    {{ $t('documentacionDelChofer') }}
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
                                <AppField
                                    label-for="tipoDeCuenta"
                                    :error="
                                        accountTypeError.state
                                            ? accountTypeError.message
                                            : ''
                                    "
                                >
                                    <template #label>
                                        {{ $t('tipoDeCuenta') }}
                                        <span
                                            class="required-field-flag"
                                            :title="$t('tituloCampoRequerido')"
                                        >
                                            (*)
                                        </span>
                                    </template>
                                    <select
                                        id="tipoDeCuenta"
                                        v-model="newInfo.account_type"
                                        class="users-crud__select"
                                    >
                                        <option
                                            v-for="option in accountTypes"
                                            :key="option.id"
                                            v-bind:value="option.id"
                                        >
                                            {{ option.name }}
                                        </option>
                                    </select>
                                </AppField>
                            </div>
                            <div
                                class="form-group"
                                v-if="settings.module_validated_drivers"
                            >
                                <AppField
                                    label-for="bancoDeCuenta"
                                    :error="
                                        accountBankError.state
                                            ? accountBankError.message
                                            : ''
                                    "
                                >
                                    <template #label>
                                        {{ $t('bancoDeCuenta') }}
                                        <span
                                            class="required-field-flag"
                                            :title="$t('tituloCampoRequerido')"
                                        >
                                            (*)
                                        </span>
                                    </template>
                                    <select
                                        id="bancoDeCuenta"
                                        v-model="newInfo.account_bank"
                                        class="users-crud__select"
                                    >
                                        <option
                                            v-for="option in banks"
                                            :key="option.id"
                                            v-bind:value="option.id"
                                        >
                                            {{ option.name }}
                                        </option>
                                    </select>
                                </AppField>
                            </div>
                            <AppInput
                                v-if="settings.module_validated_drivers"
                                id="accountNumber"
                                v-model="newInfo.account_number"
                                :placeholder="$t('numeroDeCuenta')"
                                :error="
                                    accountNumberError.state
                                        ? accountNumberError.message
                                        : ''
                                "
                            >
                                <template #label>
                                    {{ $t('numeroDeCuenta') }}
                                    <span
                                        class="required-field-flag"
                                        :title="$t('tituloCampoRequerido')"
                                    >
                                        (*)
                                    </span>
                                </template>
                            </AppInput>
                            <div
                                class="checkbox"
                                v-if="settings.module_validated_drivers"
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="newInfo.driver_is_verified"
                                    />
                                    {{ $t('esChofer') }}
                                </label>
                            </div>
                            <hr />
                            <div class="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        v-model="newInfo.active"
                                    />
                                    {{ $t('usuarioActivo') }}
                                </label>
                            </div>

                            <div class="row">
                                <div class="checkbox col-md-19">
                                    <label>
                                        <input
                                                type="checkbox"
                                                v-model="newInfo.banned"
                                            />
                                        {{ $t('usuarioSuspendido') }}
                                    </label>
                                </div>
                                <div class="col-md-5 text-right">
                                    <AppButton
                                        type="button"
                                        variant="primary"
                                        @click="save"
                                    >
                                        {{ $t('grabar') }}
                                    </AppButton>
                                </div>
                            </div>
                            <hr />
                            <div class="row" style="margin-top: 1em;">
                                <div class="col-md-24 users-crud__danger-actions">
                                    <AppButton
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        @click="openConfirmModal('delete')"
                                    >
                                        {{ $t('eliminarUsuario') }}
                                    </AppButton>
                                    <AppButton
                                        type="button"
                                        variant="warning"
                                        size="sm"
                                        @click="openConfirmModal('anonymize')"
                                    >
                                        {{ $t('anonimizarUsuario') }}
                                    </AppButton>
                                    <AppButton
                                        type="button"
                                        variant="warning"
                                        size="sm"
                                        @click="openConfirmModal('banAndAnonymize')"
                                    >
                                        {{ $t('anonimizarYBloquearUsuario') }}
                                    </AppButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <modal
            v-if="showConfirmModal"
            :name="'modal-confirm-admin-action'"
            @close="closeConfirmModal"
        >
            <template #header><h3>
                <span>{{ confirmModalTitle }}</span>
            </h3></template>
            <template #body><div>
                <div class="text-left color-black">
                    <p>{{ confirmModalMessage }}</p>
                    <AppInput
                        v-model="banNote"
                        v-if="pendingAction === 'banAndAnonymize'"
                        :label="`${$t('nota')} (${$t('opcional')})`"
                    />
                    <div class="text-center users-crud__modal-actions">
                        <AppButton
                            type="button"
                            variant="danger"
                            :disabled="loadingAction"
                            @click="executePendingAction"
                        >
                            <span v-if="!loadingAction">{{ $t('confirmar') }}</span>
                            <spinner v-if="loadingAction" class="blue"></spinner>
                        </AppButton>
                        <AppButton
                            type="button"
                            variant="secondary"
                            @click="closeConfirmModal"
                        >
                            {{ $t('cancelar') }}
                        </AppButton>
                    </div>
                </div>
            </div></template>
        </modal>
    </AdminLayout>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
import { useAdminStore } from '../../stores/admin';
import { useProfileStore } from '../../stores/profile';
import { Thread } from '../../classes/Threads.js';
import { inputIsNumber } from '../../services/utility';
import {
    cleanDocumentIdForStorageFromConfig,
    formatDocumentIdFromConfig,
    formatDocumentIdInput,
    getDocumentIdPlaceholderFromConfig,
    getMaxDocumentIdInputLengthFromConfig,
    isValidDocumentIdForConfig,
    resolveProfileIdFormats
} from '../../utils/documentId';
import { normalizeFacebookProfileUrl } from '../../utils/facebookProfileUrl.js';
import dialogs from '../../services/dialogs.js';
import AdminLayout from '../layouts/AdminLayout.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import AppTextarea from '../ui/AppTextarea.vue';
import modal from '../Modal';
import Spinner from '../Spinner.vue';
import { AdminApi, UserApi } from '../../services/api';

export default {
    // TODO fix css names
    // TODO search by facebook
    name: 'admin-user-edit',
    data() {
        return {
            userLoading: true,
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
                patente: '',
                facebook_profile_url: ''
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
            banks: [],
            accountTypes: [],
            showConfirmModal: false,
            pendingAction: null,
            loadingAction: false,
            adminApi: null,
            banNote: '',
            clearingIdentity: false
        };
    },

    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useAuthStore, {
            settings: 'appConfig'
        }),
        documentIdMaxLength() {
            return getMaxDocumentIdInputLengthFromConfig(this.settings);
        },
        documentIdPlaceholder() {
            return getDocumentIdPlaceholderFromConfig(this.settings);
        },
        confirmModalTitle() {
            if (this.pendingAction === 'delete') return this.$t('confirmarEliminarUsuario');
            if (this.pendingAction === 'anonymize') return this.$t('confirmarAnonimizarUsuario');
            if (this.pendingAction === 'banAndAnonymize') return this.$t('confirmarAnonimizarYBloquearUsuario');
            return '';
        },
        confirmModalMessage() {
            if (this.pendingAction === 'delete') return this.$t('confirmarEliminarUsuarioMensaje');
            if (this.pendingAction === 'anonymize') return this.$t('confirmarAnonimizarUsuarioMensaje');
            if (this.pendingAction === 'banAndAnonymize') return this.$t('confirmarAnonimizarYBloquearUsuarioMensaje');
            return '';
        }
    },

    methods: {
        ...mapActions(useAdminStore, {
            update: 'adminUpdate'
        }),
        ...mapActions(useProfileStore, {
            getBankData: 'getBankData'
        }),
        onFacebookProfileUrlBlur() {
            const normalized = normalizeFacebookProfileUrl(this.newInfo.facebook_profile_url);
            if (normalized) {
                this.newInfo.facebook_profile_url = normalized;
            }
        },

        goToListOnly() {
            this.resetUserState();
            this.$router.push({ name: 'admin-users' });
        },
        async loadUserForEdit() {
            const userId = this.$route.params.userId;
            if (!userId) {
                this.userLoading = false;
                this.resetUserState();
                this.$router.replace({ name: 'admin-users' });
                return;
            }
            this.userLoading = true;
            try {
                const body = await this.userApi.show(userId);
                const user = body.data;
                if (user) {
                    this.selectUser(user);
                } else {
                    dialogs.message(this.$t('noSeEncontroNingunUsuario'), { estado: 'error' });
                    this.$router.replace({ name: 'admin-users' });
                }
            } catch (e) {
                console.error(e);
                dialogs.message(this.$t('noSeEncontroNingunUsuario'), { estado: 'error' });
                this.$router.replace({ name: 'admin-users' });
            } finally {
                this.userLoading = false;
            }
        },
        confirmClearIdentityValidation() {
            if (!this.currentUser || !this.currentUser.id) return;
            if (!confirm(this.$t('confirmarRemoverValidacionIdentidad'))) return;
            this.doClearIdentityValidation();
        },
        doClearIdentityValidation() {
            if (!this.currentUser || !this.currentUser.id) return;
            this.clearingIdentity = true;
            const api = new AdminApi();
            api.clearIdentityValidation(this.currentUser.id)
                .then(() => {
                    this.newInfo.identity_validated = false;
                    this.newInfo.identity_validated_at = null;
                    this.currentUser.identity_validated = false;
                    this.currentUser.identity_validated_at = null;
                    dialogs.message(this.$t('validacionIdentidadRemovida'));
                })
                .catch(() => {
                    dialogs.message(this.$t('resultError'), { estado: 'error' });
                })
                .finally(() => {
                    this.clearingIdentity = false;
                });
        },
        selectUser(user) {
            this.currentUser = user;
            console.log('selectUser', user);
            // Ensure nro_doc is stored as raw value (no dots) when loaded from backend
            const nroDocRaw = this.currentUser.nro_doc || '';
            this.newInfo = {
                name: this.currentUser.name,
                email: this.currentUser.email,
                description: this.currentUser.description,
                private_note: this.currentUser.private_note,
                nro_doc: nroDocRaw,
                mobile_phone: this.currentUser.mobile_phone,
                pass: {},
                user: {},
                driver_is_verified: this.currentUser.driver_is_verified,
                driver_data_docs: this.currentUser.driver_data_docs,
                account_number: this.currentUser.account_number,
                account_type: this.currentUser.account_type,
                account_bank: this.currentUser.account_bank,
                facebook_profile_url: this.currentUser.facebook_profile_url,
                banned: this.currentUser.banned > 0,
                active: this.currentUser.active > 0,
                cars: this.currentUser.cars || [],
                patente: this.currentUser.cars && this.currentUser.cars.length > 0 ? this.currentUser.cars[0].patente : '',
                identity_validated: this.currentUser.identity_validated,
                identity_validated_at: this.currentUser.identity_validated_at
            };
            // Format nro_doc for display after loading
            if (this.newInfo.nro_doc) {
                this.newInfo.nro_doc = formatDocumentIdFromConfig(
                    nroDocRaw,
                    this.settings
                );
            }
        },
        isNumber(value) {
            inputIsNumber(value);
        },

        onDniModelUpdate(value) {
            this.newInfo.nro_doc = formatDocumentIdInput(
                value,
                resolveProfileIdFormats(this.settings)
            );
        },

        resetUserState() {
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
                patente: '',
                facebook_profile_url: ''
            };
        },
        clear() {
            this.resetUserState();
            if (this.$route.params.userId) {
                this.$router.replace({ name: 'admin-users' });
            }
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
        openConfirmModal(action) {
            this.pendingAction = action;
            this.banNote = '';
            this.showConfirmModal = true;
        },
        closeConfirmModal() {
            this.showConfirmModal = false;
            this.pendingAction = null;
            this.banNote = '';
        },
        executePendingAction() {
            if (!this.currentUser || !this.currentUser.id) return;
            this.loadingAction = true;
            const api = this.adminApi;
            let promise;
            if (this.pendingAction === 'delete') {
                promise = api.deleteUser(this.currentUser.id);
            } else if (this.pendingAction === 'anonymize') {
                promise = api.anonymizeUser(this.currentUser.id);
            } else if (this.pendingAction === 'banAndAnonymize') {
                promise = api.banAndAnonymizeUser(this.currentUser.id, this.banNote);
            } else {
                this.loadingAction = false;
                return;
            }
            const userId = this.currentUser.id;
            promise
                .then(() => {
                    this.loadingAction = false;
                    this.closeConfirmModal();
                    this.resetUserState();
                    this.$router.replace({ name: 'admin-users' });
                    dialogs.message(this.$t('accionCompletadaExitosamente'), {
                        duration: 5,
                        estado: 'success'
                    });
                })
                .catch((err) => {
                    this.loadingAction = false;
                    const msg = (err.response && err.response.data && err.response.data.message) || err.message || this.$t('errorAlActualizar');
                    dialogs.message(msg, {
                        duration: 5,
                        estado: 'error'
                    });
                    if (err.response && err.response.data && err.response.data.error === 'requires_ban') {
                        this.closeConfirmModal();
                    }
                });
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
                this.dniError.state = true;
                this.dniError.message = 'asdasdasdasd';

                globalError = true;
            }

            if (this.newInfo.mobile_phone && this.newInfo.mobile_phone.length > 0 && this.newInfo.mobile_phone.length < 6) {
                this.phoneError.state = true;
                this.phoneError.message = 'El teléfono que ingresaste no es válido.';
                globalError = true;
            }

            if (this.newInfo.pass.password && this.newInfo.pass.password !== this.newInfo.pass.password_confirmation) {
                this.passError = this.$t('passwordNoCoincide');
                globalError = true;
            } */

            if (this.newInfo.nro_doc && !isValidDocumentIdForConfig(this.newInfo.nro_doc, this.settings)) {
                this.dniError.state = true;
                this.dniError.message = this.$t('dniNoValido');
                globalError = true;
            }

            // Validate patente if provided - allow all strings
            if (this.newInfo.patente && this.newInfo.patente.length > 0) {
                // Basic validation: just check it's not empty and has reasonable length
                if (this.newInfo.patente.length > 20) {
                    this.patenteError.state = true;
                    this.patenteError.message = this.$t('patenteNoValida');
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
                // DNI: send raw value without dots (backend expects digits only)
                const nroDocRaw = this.newInfo.nro_doc
                    ? cleanDocumentIdForStorageFromConfig(
                        this.newInfo.nro_doc,
                        this.settings
                    )
                    : this.newInfo.nro_doc;

                // Patente: trim whitespace before sending
                const patenteValue = (this.newInfo.patente && this.newInfo.patente.trim) ? this.newInfo.patente.trim() : (this.newInfo.patente || '');

                // Only send properties from the admin form (backend allows these for admin)
                const payload = {
                    user: { id: this.currentUser.id },
                    name: this.newInfo.name,
                    email: this.newInfo.email,
                    description: this.newInfo.description,
                    private_note: this.newInfo.private_note,
                    nro_doc: nroDocRaw,
                    mobile_phone: this.newInfo.mobile_phone,
                    patente: patenteValue,
                    driver_is_verified: this.newInfo.driver_is_verified ? 1 : 0,
                    account_number: this.newInfo.account_number,
                    account_type: this.newInfo.account_type,
                    account_bank: this.newInfo.account_bank,
                    facebook_profile_url:
                        normalizeFacebookProfileUrl(this.newInfo.facebook_profile_url) ??
                        this.newInfo.facebook_profile_url,
                    banned: this.newInfo.banned ? 1 : 0,
                    active: this.newInfo.active ? 1 : 0
                };

                if (this.newInfo.pass && this.newInfo.pass.password) {
                    payload.password = this.newInfo.pass.password;
                    payload.password_confirmation = this.newInfo.pass.password_confirmation;
                }

                this.update(payload)
                    .then(() => {
                        dialogs.message(this.$t('perfilActualizadoCorrectamente'));
                        this.loadUserForEdit();
                    })
                    .catch((err) => {
                        console.log(err);
                        let mensajeErr = this.$t('errorAlActualizar');
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
            } else {
                dialogs.message(this.$t('verifiqueLosCampos'), { estado: 'error' });
            }
        }
    },

    beforeUnmount() {
        this.thread.stop();
        this.select(null);
    },

    watch: {
        isMobile: function () {
            if (!this.isMobile) {
                // router.push({ name: 'conversation-chat' });
            }
        },
        'newInfo.patente': function () {
            this.patenteError.state = false;
        }
    },

    beforeRouteUpdate(to, from, next) {
        next();
        if (to.name === 'admin-users-edit') {
            this.loadUserForEdit();
        }
    },

    async mounted() {
        this.adminApi = new AdminApi();
        this.userApi = new UserApi();
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
        if (this.$route.query.userId) {
            const id = String(this.$route.query.userId);
            await this.$router.replace({
                name: 'admin-users-edit',
                params: { userId: id },
                query: {}
            });
        }
        await this.loadUserForEdit();
    },
    updated() {},
    components: {
        AdminLayout,
        AppButton,
        AppField,
        AppInput,
        AppTextarea,
        modal,
        Spinner
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

.users-crud__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
}

.users-crud__select:focus {
    outline: none;
}

.users-crud__danger-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.users-crud__modal-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 1.5em;
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

.list-group-item.conversation_header.active,
.list-group-item.conversation_header.active:hover {
    background-color: #e7f0ff;
    border-color: #b8d4f0;
}

.user-admin-pager-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.user-admin-pager-label {
    flex: 1;
    text-align: center;
    font-size: 12px;
}

.user-admin-view h4 {
    margin-top: 0;
}

.user-admin-view-actions .btn {
    margin-right: 8px;
    margin-bottom: 8px;
}

.user-admin-edit-nav {
    margin-bottom: 12px;
}
</style>
