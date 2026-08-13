<template>
    <div class="update-profile-component" v-if="user">
        <div class="update-profile-page__card">
            <h1 class="update-profile-page__heading">{{ $t('editarPerfil') }}</h1>
        <div
            class="alert alert-info"
            v-if="
                !user.image ||
                user.image.length === 0 ||
                !user.description ||
                user.description.length === 0
            "
        >
            <div class="alert-icon">
                <i class="fa fa-exclamation" aria-hidden="true"></i>
            </div>
            <div class="alert-message">
                {{ $t('hola') }}
                <strong>{{ user.name }}</strong>
                {{ $t('bienvenidoACarpoolear') }}
                <span
                    v-if="
                        (!user.image || user.image.length === 0) &&
                        (!user.description || user.description.length === 0)
                    "
                >
                    {{ $t('completaTu') }}
                    <strong>{{ $t('imagenPerfil') }}</strong>
                    {{ $t('yTu') }}
                    <strong>{{ $t('descripcion') }}</strong>
                    {{ $t('comenzarViajar') }}
                </span>
                <span
                    v-if="
                        (!user.image || user.image.length === 0) &&
                        !(!user.description || user.description.length === 0)
                    "
                >
                    {{ $t('completaTu') }}
                    <strong>{{ $t('imagenPerfil') }}</strong>
                    {{ $t('comenzarViajar') }}
                </span>
                <span
                    v-if="
                        !(!user.image || user.image.length === 0) &&
                        (!user.description || user.description.length === 0)
                    "
                >
                    {{ $t('completaTu') }}
                    <strong>{{ $t('descripcion') }}</strong>
                    {{ $t('comenzarViajar') }}
                </span>
            </div>
        </div>
        <div class="form">
            <div class="profile-top-row">
                <div class="profile-top-content">
                    <div class="alert alert-info profile-top-alert">
                        {{ $t('incentivoFoto') }}
                    </div>
                    <div class="profile-identity-fields">
                        <AppInput
                            id="input-name"
                            maxlength="25"
                            v-model="user.name"
                            :placeholder="$t('placeholderNombre')"
                            :disabled="isNameLockedByValidation"
                            :title="nameInputTitle"
                            :error="nombreError.state ? nombreError.message : ''"
                        >
                            <template #label>
                                {{ $t('nombreYapellido') }}
                                <span
                                    class="required-field-flag"
                                    :title="$t('tituloCampoRequerido')"
                                    >(*)</span
                                >
                            </template>
                        </AppInput>
                        <AppInput
                            id="input-email"
                            maxlength="40"
                            v-model="user.email"
                            :placeholder="$t('eMail')"
                            disabled
                        >
                            <template #label>
                                {{ $t('email') }}
                                <span
                                    class="required-field-flag"
                                    :title="$t('tituloCampoRequerido')"
                                    >(*)</span
                                >
                            </template>
                        </AppInput>
                    </div>
                </div>
                <div class="profile_image profile_image-inline">
                    <div class="profile_image-container">
                        <div
                            class="circle-box"
                            v-imgSrc:profile="user.image"
                            :class="{ loading: loadingImg }"
                        >
                            <div @click="changePhoto" class="profile_image-edit">
                                <svgItem icon="addPhoto" size="28"></svgItem>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                    <!--<div class="form-group">
                    <label for="">Fecha de nacimiento <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                    <DatePicker :model-value="dayjs(birthday).format('YYYY-MM-DD') " ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>
                    <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
                </div>-->
                    <AppTextarea
                        id="input-description"
                        maxlength="2000"
                        v-model="user.description"
                        :placeholder="$t('placeholderDescripcion')"
                        :error="descError.state ? descError.message : ''"
                        rows="5"
                    >
                        <template #label>
                            {{ $t('acercaDeMi') }}
                            <span
                                class="required-field-flag"
                                :title="$t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                {{ $t('incentivoDescripcion') }}
                            </span>
                        </template>
                    </AppTextarea>
                    <hr />
                    <p class="form-group">
                        {{ $t('siSosConductorDatosVisibles') }}
                    </p>
                    <AppInput
                        id="input-dni"
                        type="tel"
                        :model-value="user.nro_doc"
                        @update:modelValue="onDniModelUpdate"
                        :placeholder="config.profile_id_format"
                        :maxlength="(config.profile_id_format).length"
                        :disabled="isDniLockedByValidation"
                        :title="dniInputTitle"
                        :error="dniError.state ? dniError.message : ''"
                    >
                        <template #label>
                            {{ $t('documento') }}
                            <span
                                class="required-field-flag"
                                :title="$t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                {{ $t('incentivoDoc') }} {{ $t('doc') }}
                                {{ $t('momentoViajar') }}
                            </span>
                        </template>
                    </AppInput>
                    <AppInput
                        id="input-telefono"
                        maxlength="20"
                        type="tel"
                        @keydown="isNumber"
                        v-on:paste="isNumber"
                        v-model="user.mobile_phone"
                        :placeholder="$t('placeholderTelefono')"
                        :error="phoneError.state ? phoneError.message : ''"
                    >
                        <template #label>
                            {{ $t('nroTel') }}
                            <span
                                class="required-field-flag"
                                :title="$t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                ({{ $t('ejemploTelefono') }}).
                                {{ $t('incentivoTelefono') }}
                            </span>
                        </template>
                    </AppInput>
                    <AppInput
                        v-if="settings.module_facebook_profile_url_enabled"
                        id="input-facebook-profile-url"
                        v-model="user.facebook_profile_url"
                        type="url"
                        placeholder="https://facebook.com/tuperfil"
                        @blur="onFacebookProfileUrlBlur"
                    >
                        <template #label>
                            Perfil de Facebook (opcional)
                            <span class="description">
                                Opcional. Para generar confianza podés poner tu link a
                                tu perfil de Facebook
                            </span>
                        </template>
                    </AppInput>

                    <div
                        ref="autosLinkBlock"
                        class="form-group profile-autos-link"
                        :class="{
                            'missing-field-highlight': shouldHighlightAutosLink
                        }"
                    >
                        <p>{{ $t('autosGestionarEnConfiguracion') }}</p>
                        <router-link
                            :to="{ name: 'profile_cars' }"
                            class="btn btn-default"
                        >
                            {{ $t('autos') }}
                        </router-link>
                    </div>
                    <div class="checkbox update-profile-datos-publicos">
                        <label>
                            <input
                                type="checkbox"
                                v-model="user.data_visibility"
                                true-value="1"
                                false-value="0"
                            />
                            {{ $t('datosVisiblesCheck') }}
                        </label>
                        <div>
                            {{ $t('tildaOpcionDatosVisibles') }}
                        </div>
                    </div>
                    <hr v-if="showProfileEmailNotificationsSetting" />
                    <div
                        class="checkbox"
                        v-if="showProfileEmailNotificationsSetting"
                    >
                        <label>
                            <input
                                type="checkbox"
                                v-model="user.emails_notifications"
                            />
                            {{ $t('notificacionesPorCorreo') }}
                        </label>
                    </div>

                    <hr v-if="settings.module_unaswered_message_limit" />
                    <AppInput
                        v-if="settings.module_unaswered_message_limit"
                        id="input-unaswered_messages_limit"
                        type="numer"
                        data-max-length="8"
                        v-model="user.unaswered_messages_limit"
                        :error="
                            unaswered_messages_limitError.state
                                ? unaswered_messages_limitError.message
                                : ''
                        "
                    >
                        <template #label>
                            {{ $t('unaswered_messages_limit') }}
                            <span class="description">
                                ({{
                                    $t('unaswered_messages_limitDescription')
                                }})
                            </span>
                        </template>
                    </AppInput>
                    <div
                        class="checkbox"
                        v-if="
                            settings.module_validated_drivers &&
                            !user.driver_is_verified
                        "
                    >
                        <label>
                            <input
                                type="checkbox"
                                @change="changeBeDriver"
                                v-model="this.showBeDriver"
                            />
                            {{ $t('solicitarSerChofer') }}
                        </label>
                    </div>
                    <div
                        class="form-group"
                        v-if="
                            settings.module_validated_drivers &&
                            showBeDriver &&
                            !user.driver_is_verified
                        "
                    >
                        <label for="driver_documentation">{{
                            $t('ingreseDocumentacion')
                        }}</label>
                        <input
                            type="file"
                            id="driver_documentation"
                            multiple
                            :accept="imageUploadAccept"
                            @change="onDriverDocumentChange"
                        />
                        <p class="help-block">
                            {{ $t('seRequiereDocumentacion') }}
                        </p>
                    </div>
                    <div v-if="user.driver_is_verified">
                        <i
                            class="fa fa-check-circle check-driver-verified"
                            aria-hidden="true"
                        ></i>
                        <strong>{{ $t('choferVerificado') }}</strong>
                    </div>
                    <div
                        v-if="
                            user.driver_is_verified ||
                            (settings.module_validated_drivers && showBeDriver)
                        "
                    >
                        <div class="form-group">
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
                                        >(*)</span
                                    >
                                </template>
                                <select
                                    id="tipoDeCuenta"
                                    v-model="user.account_type"
                                    class="update-profile__select"
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
                        <div class="form-group">
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
                                        >(*)</span
                                    >
                                </template>
                                <select
                                    id="bancoDeCuenta"
                                    v-model="user.account_bank"
                                    class="update-profile__select"
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
                            id="accountNumber"
                            v-model="user.account_number"
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
                                    >(*)</span
                                >
                            </template>
                        </AppInput>
                    </div>
                    <div
                        class="row"
                        v-if="
                            Array.isArray(user.driver_data_docs) &&
                            user.driver_data_docs.length
                        "
                    >
                        <div
                            v-imgSrc:docs="img"
                            v-for="img in user.driver_data_docs"
                            class="img-doc col-md-8 col-sm-12"
                        ></div>
                    </div>

                    <div class="btn-container">
                        <span class="required-field-flag required-field-info">
                            {{ $t('camposObligatorios') }}
                        </span>
                        <AppButton
                            class="update-profile-save-btn"
                            variant="primary"
                            :loading="loading"
                            :disabled="loading"
                            @click="grabar"
                        >
                            {{ $t('guardarCambios') }}
                            <template #loading>
                                <spinner class="blue"></spinner>
                            </template>
                        </AppButton>
                    </div>
                    <div
                        v-if="error"
                        class="alert alert-danger profile-save-error"
                        role="alert"
                    >
                        <i
                            class="fa fa-exclamation-triangle"
                            aria-hidden="true"
                        ></i>
                        <span>{{ error }}</span>
                    </div>
                    <Uploadfile
                        :name="'profile'"
                        @change="onPhotoChange"
                        ref="file"
                    ></Uploadfile>
        </div>
        </div>

        <modal
            :name="'modal-delete-account'"
            v-if="showModalDeleteAccount"
            @close="toggleModalDeleteAccount"
            :body="'Body'"
        >
            <template #header><h3>
                <span>{{ $t('seguroEliminarCuenta') }}</span>
            </h3></template>
            <template #body><div>
                <div class="text-left color-black" v-if="!showNegativeRatingsInModal">
                    <template v-if="!showDeleteAccountConfirmation">
                        <p>{{ $t('eliminacionCuentaRecuperarCuenta') }}</p>
                        <div class="text-center" style="margin-top: 1em;">
                            <AppButton
                                variant="primary"
                                @click="openMesaAyudaFromDelete"
                            >
                                {{ $t('contactarMesaAyuda') }}
                            </AppButton>
                        </div>
                        <p style="margin-top: 1.5em;">{{ $t('eliminacionCuentaOtroMotivo') }}</p>
                        <div class="text-center" style="margin-top: 1.5em;">
                            <AppButton
                                variant="danger"
                                @click="promptDeleteAccountConfirmation"
                            >
                                {{ $t('eliminarCuenta') }}
                            </AppButton>
                        </div>
                    </template>
                    <template v-else>
                        <p>{{ $t('eliminacionCuentaIrreversible') }}</p>
                        <p>{{ $t('confirmarEliminarCuentaMensaje') }}</p>
                        <div class="text-center delete-account-confirmation-actions">
                            <button
                                type="button"
                                class="btn btn-default"
                                @click="cancelDeleteAccountConfirmation"
                            >
                                {{ $t('cancelar') }}
                            </button>
                            <button
                                class="btn btn-danger"
                                @click="deleteAccount"
                                :disabled="loadingDeleteAccount"
                            >
                                <span v-if="!loadingDeleteAccount">{{
                                    $t('confirmar')
                                }}</span>
                                <spinner
                                    class="blue"
                                    v-if="loadingDeleteAccount"
                                ></spinner>
                            </button>
                        </div>
                    </template>
                </div>
                <div class="text-left color-black" v-else>
                    <p>
                        <span>{{ $t('eliminacionCuentaNegativasLead') }}</span>
                        <router-link :to="{ name: 'tickets' }">{{ $t('mesaAyuda') }}</router-link>{{ $t('eliminacionCuentaNegativasTail') }}
                    </p>
                    <p>{{ $t('eliminacionCuentaIrreversible') }}</p>
                    <p>{{ $t('eliminacionCuentaPlazo') }}</p>
                    <div class="text-center" style="margin-top: 1.5em;">
                        <button
                            class="btn btn-primary"
                            @click="requestAccountDeletion"
                            :disabled="loadingDeleteAccount"
                        >
                            <span v-if="!loadingDeleteAccount">{{ $t('solicitarEliminacionCuenta') }}</span>
                            <spinner class="blue" v-if="loadingDeleteAccount"></spinner>
                        </button>
                    </div>
                </div>
            </div></template>
        </modal>

        <modal
            name="mesaAyudaModal"
            v-if="showMesaAyudaModal"
            @close="showMesaAyudaModal = false"
        >
            <template #header><h3>
                <span>{{ $t('mesaAyuda') }}</span>
            </h3></template>
            <template #body><div>
                <div class="text-left color-black login-modal">
                    <p>
                        <span>{{ $t('mesaAyudaContactoLead') }}</span>
                        <router-link :to="{ name: 'tickets' }">{{ $t('mesaAyuda') }}</router-link>{{ $t('mesaAyudaContactoTail') }}
                    </p>
                </div>
            </div></template>
        </modal>

        <modal
            name="errorAlGuardarModal"
            v-if="showBannedDniModal"
            @close="toggleBannedDniModal"
        >
            <template #header><h3>
                <span>{{ $t('errorAlGuardar') }}</span>
            </h3></template>
            <template #body><div>
                <div class="text-left color-black login-modal">
                    <p>
                        <span>{{ $t('errorAlGuardarContactarMesaAyuda') }}</span>
                        <router-link :to="{ name: 'tickets' }">{{ $t('mesaAyuda') }}</router-link>{{ $t('mesaAyudaContactoTail') }}
                    </p>
                </div>
            </div></template>
        </modal>

        <modal
            name="datosEnUsoModal"
            v-if="showDatosEnUsoModal"
            @close="toggleDatosEnUsoModal"
        >
            <template #header><h3>
                <span>{{ $t('datosEnUso') }}</span>
            </h3></template>
            <template #body><div>
                <div class="text-left color-black login-modal">
                    <p>
                        <span>{{ $t('datosEnUsoDescripcion') }}</span>
                        <router-link :to="{ name: 'tickets' }">{{ $t('mesaAyuda') }}</router-link>{{ $t('mesaAyudaContactoTail') }}
                    </p>
                </div>
            </div></template>
        </modal>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { useProfileStore } from '../../stores/profile';
import { inputIsNumber, formatId, cleanId } from '../../services/utility';
import Uploadfile from '../Uploadfile';
import DatePicker from '../DatePicker';
import SvgItem from '../SvgItem';
import dialogs from '../../services/dialogs.js';
import dayjs from '../../dayjs';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import AppTextarea from '../ui/AppTextarea.vue';
import modal from '../Modal';
import { UserApi } from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import { normalizeFacebookProfileUrl } from '../../utils/facebookProfileUrl.js';
import {
    IMAGE_UPLOAD_ACCEPT
} from '../../utils/imageUpload';
import { applyImageUploadSelection } from '../../utils/imageUploadSelection';
import { cloneProfileUser } from '../../utils/profileUserClone';
import { DELETE_ACCOUNT_QUERY } from '../../utils/myAccountMenuItems';

class Error {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'upddate-profile',
    data() {
        return {
            user: null,
            error: null,
            loading: false,
            loadingImg: false,
            globalError: false,
            nombreError: new Error(),
            descError: new Error(),
            birthdayError: new Error(),
            dniError: new Error(),
            unaswered_messages_limitError: new Error(),
            phoneError: new Error(),
            emailError: new Error(),
            accountNumberError: new Error(),
            accountTypeError: new Error(),
            accountBankError: new Error(),
            maxDate: dayjs().toDate(),
            minDate: dayjs('1900-01-01').toDate(),
            birthday: '',
            birthdayAnswer: '',
            showBeDriver: false,
            showProfileEmailNotificationsSetting: false,
            driverFiles: null,
            imageUploadAccept: IMAGE_UPLOAD_ACCEPT,
            banks: [],
            accountTypes: [],
            showModalDeleteAccount: false,
            showDeleteAccountConfirmation: false,
            loadingDeleteAccount: false,
            showDatosEnUsoModal: false,
            showBannedDniModal: false,
            showNegativeRatingsInModal: false,
            showMesaAyudaModal: false,
            userApi: null
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            userData: 'user',
            firstTime: 'firstTime',
            settings: 'appConfig',
            config: 'appConfig',

        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        iptUser() {
            if (this.user) {
                return this.user.name;
            }
        },
        iptEmail() {
            if (this.user) {
                return this.user.email;
            }
        },
        iptBirthday() {
            if (this.user) {
                return this.user.birthdayAnswer;
            }
        },
        iptDescription() {
            if (this.user) {
                return this.user.description;
            }
        },
        iptDni() {
            if (this.user) {
                return this.user.nro_doc;
            }
        },
        isIdentityValidated() {
            return !!(
                this.user &&
                this.user.identity_validated &&
                this.user.identity_validated_at
            );
        },
        isDniLockedByValidation() {
            return this.isIdentityValidated;
        },
        isNameLockedByValidation() {
            return this.isIdentityValidated;
        },
        dniInputTitle() {
            return this.isDniLockedByValidation
                ? this.$t('dniValidadoContacteSoporte')
                : '';
        },
        nameInputTitle() {
            return this.isNameLockedByValidation
                ? this.$t('nombreValidadoContacteSoporte')
                : '';
        },
        iptPhone() {
            if (this.user) {
                return this.user.mobile_phone;
            }
        },
        shouldHighlightAutosLink() {
            return !!(
                this.$route &&
                this.$route.query &&
                this.$route.query.missing === 'patente'
            );
        }
    },
    methods: {
        dayjs,
        ...mapActions(useAuthStore, {
            update: 'update',
            updatePhoto: 'updatePhoto'
        }),
        ...mapActions(useProfileStore, {
            getBankData: 'getBankData'
        }),
        onFacebookProfileUrlBlur() {
            const normalized = normalizeFacebookProfileUrl(this.user.facebook_profile_url);
            if (normalized) {
                this.user.facebook_profile_url = normalized;
            }
        },
        syncProfileDraftFromStore() {
            this.user = cloneProfileUser(this.userData);
            if (this.user && this.user.nro_doc) {
                this.user.nro_doc = formatId(
                    this.user.nro_doc,
                    this.config.profile_id_format
                );
            }
        },
        jumpToError() {
            let hasError = document.getElementsByClassName('has-error');
            if (hasError.length) {
                let element = hasError[0];
                this.$scrollToElement(element, -270);
            }
        },
        redirectMissingPatenteToAutos() {
            if (
                !this.$route ||
                !this.$route.query ||
                this.$route.query.missing !== 'patente'
            ) {
                return;
            }

            this.$router.replace({ name: 'profile_cars' });
        },
        scrollToAutosLinkIfNeeded() {
            if (!this.shouldHighlightAutosLink) {
                return;
            }

            this.$nextTick(() => {
                const block = this.$refs.autosLinkBlock;
                if (block) {
                    this.$scrollToElement(block, -270);
                }
            });
        },
        changeBeDriver() {
            this.showBeDriver = !this.showBeDriver;
        },
        isNumber(value) {
            inputIsNumber(value);
        },
        // Handle DNI input - format using pattern
        handleDniInput(event) {
            const formatted = formatId(event.target.value, this.config.profile_id_format);
            event.target.value = formatted;
            // Update the Vue data model with the formatted value
            this.user.nro_doc = formatted;
        },
        onDniModelUpdate(value) {
            this.user.nro_doc = formatId(value, this.config.profile_id_format);
        },
        onPhotoChange(data) {
            this.loadingImg = true;
            this.updatePhoto(data)
                .then((user) => {
                    this.user.image = user.image;
                    this.loadingImg = false;
                })
                .catch(() => {
                    this.loadingImg = false;
                });
        },
        onDriverDocumentChange(event) {
            const { files, rejected } = applyImageUploadSelection(
                this,
                event,
                event.target.files,
                { config: this.config }
            );
            this.driverFiles = rejected || !files.length ? null : files;
        },
        dateChange(value) {
            this.birthdayAnswer = value;
        },
        changePhoto() {
            this.$refs.file.show();
        },
        grabar() {
            if (this.validate()) {
                this.$nextTick(() => {
                    this.jumpToError();
                    dialogs.message(this.$t('faltanCamposObligatorios'), {
                        duration: 10,
                        estado: 'error'
                    });
                });
                return;
            }
            this.loading = true;
            // Ensure user.nro_doc is raw value (no dots) before sending
            if (this.user && this.user.nro_doc) {
                this.user.nro_doc = cleanId(this.user.nro_doc, this.config.profile_id_format);
            }
            // Only send properties the backend allows for profile edit (email is read-only)
            const allowedProfileUpdateKeys = [
                'birthday', 'gender', 'description', 'mobile_phone', 'emails_notifications',
                'nro_doc', 'data_visibility',
                'do_not_alert_request_seat', 'do_not_alert_accept_passenger',
                'do_not_alert_pending_rates', 'do_not_alert_pricing',
                'autoaccept_requests', 'unaswered_messages_limit',
                'account_number', 'account_type', 'account_bank',
                'facebook_profile_url'
            ];
            const data = {};
            allowedProfileUpdateKeys.forEach((key) => {
                if (this.user.hasOwnProperty(key) && this.user[key] !== undefined) {
                    data[key] = this.user[key];
                }
            });
            if (!this.isNameLockedByValidation && this.user.name !== undefined) {
                data['name'] = this.user.name;
            }
            if (data.facebook_profile_url) {
                const normalized = normalizeFacebookProfileUrl(data.facebook_profile_url);
                if (normalized) {
                    data.facebook_profile_url = normalized;
                }
            }
            /* global FormData */
            let bodyFormData = new FormData();
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (Array.isArray(data[key])) {
                        for (let index = 0; index < data[key].length; index++) {
                            const element = data[key][index];
                            bodyFormData.append(key + '[]', element);
                        }
                    } else {
                        if (data[key] !== null && data[key] !== undefined) {
                            bodyFormData.append(key, data[key]);
                        }
                    }
                }
            }
            if (this.driverFiles) {
                bodyFormData.append('user_be_driver', true);
                for (let index = 0; index < this.driverFiles.length; index++) {
                    const file = this.driverFiles[index];
                    bodyFormData.append('driver_data_docs[]', file);
                }
            } else {
            }
            this.update(bodyFormData)
                .then(() => {
                    this.error = null;
                    this.loading = false;
                    dialogs.message(this.$t('perfilActualizadoCorrectamente'));
                    // this.user.birthday = this.birthdayAnswer;
                    if (
                        this.user.image &&
                        this.user.image.length > 0 &&
                        this.user.description &&
                        this.user.description.length > 0
                    ) {
                        if (this.$router.rememberRoute) {
                            this.$router.rememberBack();
                        }
                    } else {
                        if (!(this.user.image && this.user.image.length > 0)) {
                            dialogs.message(this.$t('debesImagenPerfil'), {
                                duration: 10,
                                estado: 'error'
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.loading = false;
                    const message = getApiErrorMessage(
                        err,
                        this.$t('errorDatos'),
                        this.$t.bind(this)
                    );
                    this.error = message;
                    dialogs.message(message, {
                        duration: 10,
                        estado: 'error'
                    });
                    this.jumpToError();
                    const isDocTaken =
                        err &&
                        err.errors &&
                        err.errors.nro_doc &&
                        Array.isArray(err.errors.nro_doc) &&
                        err.errors.nro_doc.length > 0 &&
                        (err.errors.nro_doc[0].indexOf('taken') >= 0 ||
                            err.errors.nro_doc[0].indexOf(
                                'ya ha sido tomado'
                            ) >= 0);
                    const isPhoneTaken =
                        err &&
                        err.errors &&
                        err.errors.mobile_phone &&
                        Array.isArray(err.errors.mobile_phone) &&
                        err.errors.mobile_phone.length > 0 &&
                        (err.errors.mobile_phone[0].indexOf('taken') >= 0 ||
                            err.errors.mobile_phone[0].indexOf(
                                'ya ha sido tomado'
                            ) >= 0);
                    if (isDocTaken || isPhoneTaken) {
                        this.showDatosEnUsoModal = true;
                    }
                    const isBannedDni =
                        err &&
                        err.errors &&
                        err.errors.error === 'banned_dni';
                    if (isBannedDni) {
                        this.showBannedDniModal = true;
                    }
                });
        },
        validate() {
            let globalError = false;
            /* if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('olvidoContrasena');
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('contraCorta');
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('olvidoConfirmarContra');
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('contraNoCoinciden');
                globalError = true;
            } */

            if (!this.user.name || this.user.name.length < 1) {
                this.nombreError.state = true;
                this.nombreError.message = this.$t('olvidasteNombre');
                globalError = true;
            }

            /* console.log(this.birthdayAnswer);
            if (!this.birthdayAnswer || this.birthdayAnswer.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = this.$t('olvidasteFechaNacimiento');
                globalError = true;
            } else {
                let birthday = dayjs(this.birthdayAnswer);
                if (dayjs().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = this.$t('debesSerMayorDeEdad');
                    globalError = true;
                }
            } */

            // Patente validation removed - now allows all strings
            // Only basic length validation is handled by the input maxlength attribute

            if (!this.user.description || this.user.description.length < 1) {
                this.descError.state = true;
                this.descError.message = this.$t('olvidasteDescripcion');
                globalError = true;
            } else if (this.user.description.replace(' ', '').length < 10) {
                this.descError.state = true;
                this.descError.message = this.$t('descripcionCorta');
                globalError = true;
            }

            // Get raw DNI value (strip any dots that might be present)
            const dniRaw = this.user && this.user.nro_doc
                ? cleanId(this.user.nro_doc, this.config.profile_id_format)
                : '';
            
            if (!dniRaw || dniRaw.length < 1) {
                this.dniError.state = true;
                this.dniError.message = this.$t('olvidasteDni');
                globalError = true;
            } else if (dniRaw.length > 0 && dniRaw.length < 7) {
                this.dniError.state = true;
                this.dniError.message = this.$t('dniNoValido');
                globalError = true;
            }

            if (!this.user.mobile_phone || this.user.mobile_phone.length < 1) {
                this.phoneError.state = true;
                this.phoneError.message = this.$t('olvidasteTel');
                globalError = true;
            } else if (
                this.user.mobile_phone &&
                this.user.mobile_phone.length > 0 &&
                this.user.mobile_phone.length < 6
            ) {
                this.phoneError.state = true;
                this.phoneError.message = this.$t('telefonoNoValido');
                globalError = true;
            }

            if (
                this.user.driver_is_verified ||
                (this.settings.module_validated_drivers && this.showBeDriver)
            ) {
                if (!this.user.account_number) {
                    this.accountNumberError.state = true;
                    this.accountNumberError.message =
                        this.$t('campoObligatorio');
                    globalError = true;
                }
                if (!this.user.account_type) {
                    this.accountTypeError.state = true;
                    this.accountTypeError.message = this.$t('campoObligatorio');
                    globalError = true;
                }
                if (!this.user.account_bank) {
                    this.accountBankError.state = true;
                    this.accountBankError.message = this.$t('campoObligatorio');
                    globalError = true;
                }
            }

            return globalError;
        },
        toggleModalDeleteAccount() {
            const wasOpen = this.showModalDeleteAccount;
            this.showModalDeleteAccount = !this.showModalDeleteAccount;
            this.showNegativeRatingsInModal = false;
            this.showDeleteAccountConfirmation = false;
            if (wasOpen) {
                this.clearDeleteAccountRouteQuery();
            }
        },
        isDeleteAccountRouteQuery() {
            return this.$route.query.action === DELETE_ACCOUNT_QUERY.action;
        },
        openDeleteAccountModalFromRoute() {
            if (this.isDeleteAccountRouteQuery()) {
                this.showModalDeleteAccount = true;
            }
        },
        clearDeleteAccountRouteQuery() {
            if (!this.isDeleteAccountRouteQuery()) {
                return;
            }
            const query = { ...this.$route.query };
            delete query.action;
            this.$router.replace({ name: 'profile_update', query });
        },
        openMesaAyudaFromDelete() {
            this.showModalDeleteAccount = false;
            this.clearDeleteAccountRouteQuery();
            this.showMesaAyudaModal = true;
        },
        toggleDatosEnUsoModal() {
            this.showDatosEnUsoModal = !this.showDatosEnUsoModal;
        },
        toggleBannedDniModal() {
            this.showBannedDniModal = !this.showBannedDniModal;
        },
        promptDeleteAccountConfirmation() {
            this.showDeleteAccountConfirmation = true;
        },
        cancelDeleteAccountConfirmation() {
            this.showDeleteAccountConfirmation = false;
        },
        deleteAccount() {
            this.loadingDeleteAccount = true;
            this.userApi
                .deleteAccount()
                .then((response) => {
                    this.loadingDeleteAccount = false;
                    this.showModalDeleteAccount = false;
                    const action = response && response.action;
                    const message = action === 'deleted'
                        ? this.$t('usuarioEliminadoExitosamente')
                        : action === 'anonymized'
                            ? this.$t('usuarioAnonimizadoExitosamente')
                            : (response && response.message) || this.$t('pedidoEliminacionEnviado');
                    dialogs.message(message, {
                        duration: 5,
                        estado: 'success'
                    });
                    window.location.href = this.$router.resolve({ name: 'trips' }).href;
                })
                .catch((error) => {
                    this.loadingDeleteAccount = false;
                    if (error.data && error.data.error === 'negative_ratings') {
                        this.showNegativeRatingsInModal = true;
                    } else {
                        const message = getApiErrorMessage(
                            error,
                            this.$t('errorEnviarPedidoEliminacion'),
                            this.$t.bind(this)
                        );
                        dialogs.message(message, {
                            duration: 5,
                            estado: 'error'
                        });
                    }
                });
        },
        requestAccountDeletion() {
            this.loadingDeleteAccount = true;
            this.userApi
                .deleteAccountRequest()
                .then(() => {
                    this.loadingDeleteAccount = false;
                    this.showModalDeleteAccount = false;
                    this.showNegativeRatingsInModal = false;
                    dialogs.message(this.$t('pedidoEliminacionEnviado'), {
                        duration: 5,
                        estado: 'success'
                    });
                })
                .catch(() => {
                    this.loadingDeleteAccount = false;
                    dialogs.message(this.$t('errorEnviarPedidoEliminacion'), {
                        duration: 5,
                        estado: 'error'
                    });
                });
        }
    },
    watch: {
        cars: function () {
            this.syncUserCarsFromStore();
        },
        userData: function () {
            console.log('userData', this.userData);
            this.syncProfileDraftFromStore();
        },
        iptUser() {
            this.nombreError.state = false;
        },
        iptEmail() {
            this.emailError.state = false;
        },
        birthdayAnswer: function () {
            this.birthdayError.state = false;
        },
        iptDescription() {
            this.descError.state = false;
        },
        iptDni() {
            this.dniError.state = false;
        },
        iptPhone() {
            this.phoneError.state = false;
        },
        '$route.query.missing'() {
            this.redirectMissingPatenteToAutos();
            this.scrollToAutosLinkIfNeeded();
        },
        '$route.query.action'(action) {
            if (action === DELETE_ACCOUNT_QUERY.action) {
                this.showModalDeleteAccount = true;
            }
        }
    },

    mounted() {
        this.userApi = new UserApi();
        console.log('touter', this.$router);
        this.getBankData().then((data) => {
            console.log('get bank data', data);
            this.banks = data.banks;
            this.accountTypes = data.cc;
        });
        
        this.redirectMissingPatenteToAutos();
        this.scrollToAutosLinkIfNeeded();
        this.openDeleteAccountModalFromRoute();
        bus.on('date-change', this.dateChange);
        this.syncProfileDraftFromStore();
        console.log('USUARIO', this.userData);
        if (
            Array.isArray(this.user.driver_data_docs) &&
            this.user.driver_data_docs.length
        ) {
            this.showBeDriver = true;
        }
        if (this.cars) {
            this.syncUserCarsFromStore();
        }
        try {
            if (dayjs(this.user.birthday, 'YYYY-MM-DD').isValid()) {
                this.birthday = dayjs(this.user.birthday, 'YYYY-MM-DD');
            } else {
                this.birthday = '';
            }
        } catch (ex) {
            console.log('exception', ex);
        }
        this.scrollToMissingRouteField();
    },
    beforeUnmount() {
        bus.off('date-change', this.dateChange);
    },
    components: {
        DatePicker,
        Uploadfile,
        SvgItem,
        Spinner,
        AppButton,
        AppField,
        AppInput,
        AppTextarea,
        modal
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.update-profile-page__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

.update-profile-page__card {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--profile-card-bg, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.update-profile-component {
    padding-left: 0;
}

.update-profile-component .form {
    max-width: none;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
}

.update-profile-datos-publicos {
    margin-left: 5px;
}

.update-profile__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.update-profile__select:focus {
    outline: none;
}

.update-profile-component :deep(.app-input__label .description) {
    display: block;
    font-weight: 400;
    color: #666;
    margin-top: 0.25rem;
}

.profile-autos-link p {
    margin-bottom: 0.75rem;
}

@media only screen and (max-width: 768px) {
    .update-profile-component {
        padding: 1em;
    }
}

.required-field-flag {
    color: red;
}
.required-field-info {
    display: block;
    padding: 0 0 1em;
}
.profile_image-container.error .circle-box {
    border: solid 2px red;
}
.profile_image-container.error .span {
    color: red;
}
.profile-top-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
}
.profile-top-content {
    min-width: 0;
}
.profile-top-alert {
    margin-bottom: 1rem;
}
.profile_image-inline {
    order: -1;
    text-align: center;
    margin-bottom: 1rem;
}
.profile_image-inline .profile_image-container {
    margin: 0 auto;
    position: relative;
    width: 160px;
}
.profile_image-inline .circle-box {
    width: 160px;
    height: 160px;
    max-width: 160px;
    max-height: 160px;
    margin: 0;
}
.profile-identity-fields {
    min-width: 0;
}
.profile-identity-fields .form-group:last-child {
    margin-bottom: 0;
}
@media only screen and (min-width: 768px) {
    .profile-top-row {
        flex-direction: row;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1rem;
    }
    .profile-top-content {
        order: 1;
        flex: 1;
    }
    .profile_image-inline {
        order: 2;
        flex: 0 0 auto;
        margin-bottom: 0;
        align-self: stretch;
        display: flex;
        align-items: flex-start;
        justify-content: center;
    }
    .profile_image-inline .profile_image-container {
        width: 220px;
    }
    .profile_image-inline .circle-box {
        width: 220px;
        height: 220px;
        max-width: 220px;
        max-height: 220px;
    }
    .profile-identity-fields .form-group:last-child {
        margin-bottom: 15px;
    }
}
span.error {
    display: block;
    font-size: 12px;
    margin-top: -5px;
    font-weight: bold;
    color: red;
}
span.error.textarea {
    margin-top: 0.8em;
}
@media only screen and (min-width: 768px) {
    span.error {
        font-weight: 300;
    }
}
.img-doc {
    height: 320px;
    background-size: cover;
}
.check-driver-verified {
    font-size: 24px;
    vertical-align: -2px;
    margin-right: 5px;
    color: var(--trip-mostly-free-color);
}
.profile-save-error {
    display: flex;
    align-items: flex-start;
    gap: 0.5em;
    margin-top: 1em;
}

.profile-save-error .fa {
    flex-shrink: 0;
    margin-top: 0.15em;
}

.missing-field-highlight {
    background: #fff4cc;
    border-radius: 4px;
    padding: 0.75em;
}

hr {
    border-top: 1px solid #cccccc;
}

.delete-account-confirmation-actions {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 1.5em;
}
</style>

