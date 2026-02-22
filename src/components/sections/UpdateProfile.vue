<template>
    <div class="update-profile-component" v-if="localUser">
        <div
            class="alert alert-info"
            v-if="
                !localUser.image ||
                localUser.image.length === 0 ||
                !localUser.description ||
                localUser.description.length === 0
            "
        >
            <div class="alert-icon">
                <i class="fa fa-exclamation" aria-hidden="true"></i>
            </div>
            <div class="alert-message">
                {{ t('hola') }}
                <strong>{{ localUser.name }}</strong>
                {{ t('bienvenidoACarpoolear') }}
                <span
                    v-if="
                        (!localUser.image || localUser.image.length === 0) &&
                        (!localUser.description || localUser.description.length === 0)
                    "
                >
                    {{ t('completaTu') }}
                    <strong>{{ t('imagenPerfil') }}</strong>
                    {{ t('yTu') }}
                    <strong>{{ t('descripcion') }}</strong>
                    {{ t('comenzarViajar') }}
                </span>
                <span
                    v-if="
                        (!localUser.image || localUser.image.length === 0) &&
                        !(!localUser.description || localUser.description.length === 0)
                    "
                >
                    {{ t('completaTu') }}
                    <strong>{{ t('imagenPerfil') }}</strong>
                    {{ t('comenzarViajar') }}
                </span>
                <span
                    v-if="
                        !(!localUser.image || localUser.image.length === 0) &&
                        (!localUser.description || localUser.description.length === 0)
                    "
                >
                    {{ t('completaTu') }}
                    <strong>{{ t('descripcion') }}</strong>
                    {{ t('comenzarViajar') }}
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-24 col-sm-8 col-sm-push-16 profile_image">
                <div class="profile_image-container">
                    <div
                        class="circle-box"
                        v-imgSrc:profile="localUser.image"
                        :class="{ loading: loadingImg }"
                    >
                        <div @click="changePhoto" class="profile_image-edit">
                            <svgItem icon="addPhoto" size="28"></svgItem>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xs-24 col-sm-16 col-sm-pull-8">
                <div class="form">
                    <div class="alert alert-info">
                        {{ t('incentivoFoto') }}
                    </div>
                    <div class="form-group">
                        <label for="input-name">
                            {{ t('nombreYapellido') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                        </label>
                        <input
                            maxlength="25"
                            v-model="localUser.name"
                            type="text"
                            class="form-control"
                            id="input-name"
                            :placeholder="t('placeholderNombre')"
                            :class="{ 'has-error': nombreError.state }"
                            :disabled="!firstTime"
                        />
                        <span class="error" v-if="nombreError.state">
                            {{ nombreError.message }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="input-email">
                            {{ t('email') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                        </label>
                        <input
                            maxlength="40"
                            v-model="localUser.email"
                            type="text"
                            class="form-control"
                            id="input-email"
                            :placeholder="t('eMail')"
                            disabled
                        />
                    </div>
                    <div class="form-group">
                        <label for="input-description">
                            {{ t('acercaDeMi') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                {{ t('incentivoDescripcion') }}
                            </span>
                        </label>
                        <textarea
                            maxlength="2000"
                            v-model="localUser.description"
                            :placeholder="t('placeholderDescripcion')"
                            :class="{ 'has-error': descError.state }"
                        ></textarea>
                        <span class="error textarea" v-if="descError.state">
                            {{ descError.message }}
                        </span>
                    </div>
                    <hr />
                    <p class="form-group">
                        {{ t('siSosConductorDatosVisibles') }}
                    </p>
                    <div class="form-group">
                        <label for="input-dni">
                            {{ t('documento') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                {{ t('incentivoDoc') }} {{ t('doc') }}
                                {{ t('momentoViajar') }}
                            </span>
                        </label>
                        <input
                            type="tel"
                            v-model="localUser.nro_doc"
                            @input="handleDniInput"
                            class="form-control"
                            id="input-dni"
                            :placeholder="config.profile_id_format"
                            :class="{ 'has-error': dniError.state }"
                            :maxlength="(config.profile_id_format).length"
                            :disabled="isDniLockedByValidation"
                            :title="dniInputTitle"
                        />
                        <span class="error" v-if="dniError.state">
                            {{ dniError.message }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="input-telefono">
                            {{ t('nroTel') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                            <span class="description">
                                ({{ t('ejemploTelefono') }}).
                                {{ t('incentivoTelefono') }}
                            </span>
                        </label>
                        <input
                            maxlength="20"
                            @keydown="isNumber"
                            v-on:paste="isNumber"
                            v-model="localUser.mobile_phone"
                            type="tel"
                            class="form-control"
                            id="input-telefono"
                            :placeholder="t('placeholderTelefono')"
                            :class="{ 'has-error': phoneError.state }"
                        />
                        <span class="error" v-if="phoneError.state">
                            {{ phoneError.message }}
                        </span>
                    </div>

                    <div class="form-group">
                        <label for="input-telefono">
                            {{ t('patente') }}
                            <span class="description">
                                ({{ t('soloConductores') }}).
                                {{ t('incentivoPatente') }}
                            </span>
                        </label>
                        <input
                            maxlength="20"
                            v-model="patente"
                            type="text"
                            class="form-control"
                            id="input-phone"
                            :class="{ 'has-error': patentError.state }"
                        />
                        <span class="error" v-if="patentError.state">
                            {{ patentError.message }}
                        </span>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                v-model="localUser.data_visibility"
                                true-value="1"
                                false-value="0"
                            />
                            {{ t('datosVisiblesCheck') }}
                        </label>
                        <div>
                            {{ t('tildaOpcionDatosVisibles') }}
                        </div>
                    </div>
                    <hr />
                    <div class="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                v-model="localUser.emails_notifications"
                            />
                            {{ t('notificacionesPorCorreo') }}
                        </label>
                    </div>
                    <hr />
                    <div class="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                @change="changeShowPassword"
                            />
                            {{ t('cambiarPassword') }}
                        </label>
                    </div>
                    <div class="form-group" v-if="showChangePassword">
                        <label for="input-pass">{{
                            t('ingreseNuevaPassword')
                        }}</label>
                        <input
                            maxlength="40"
                            v-model="pass.password"
                            type="password"
                            autocomplete="new-password"
                            class="form-control"
                            id="input-pass"
                            :placeholder="t('placeholderContrasena')"
                        />
                        <input
                            maxlength="40"
                            v-model="pass.password_confirmation"
                            type="password"
                            autocomplete="new-password"
                            class="form-control"
                            id="input-pass-confirm"
                            :placeholder="t('placeholderRepetirContrasena')"
                        />
                    </div>

                    <hr v-if="settings.module_unaswered_message_limit" />
                    <div
                        class="form-group"
                        v-if="settings.module_unaswered_message_limit"
                    >
                        <label for="input-unaswered_messages_limit">
                            {{ t('unaswered_messages_limit') }}
                            <span class="description">
                                ({{
                                    t('unaswered_messages_limitDescription')
                                }})
                            </span>
                        </label>
                        <input
                            type="numer"
                            data-max-length="8"
                            v-model="localUser.unaswered_messages_limit"
                            class="form-control"
                            id="input-unaswered_messages_limit"
                            :class="{
                                'has-error': unaswered_messages_limitError.state
                            }"
                        />
                        <span
                            class="error"
                            v-if="unaswered_messages_limitError.state"
                        >
                            {{ unaswered_messages_limitError.message }}
                        </span>
                    </div>
                    <hr />
                    <div
                        class="checkbox"
                        v-if="
                            settings.module_validated_drivers &&
                            !localUser.driver_is_verified
                        "
                    >
                        <label>
                            <input
                                type="checkbox"
                                @change="changeBeDriver"
                                v-model="showBeDriver"
                            />
                            {{ t('solicitarSerChofer') }}
                        </label>
                    </div>
                    <div
                        class="form-group"
                        v-if="
                            settings.module_validated_drivers &&
                            showBeDriver &&
                            !localUser.driver_is_verified
                        "
                    >
                        <label for="driver_documentation">{{
                            t('ingreseDocumentacion')
                        }}</label>
                        <input
                            type="file"
                            id="driver_documentation"
                            multiple
                            @change="onDriverDocumentChange"
                        />
                        <p class="help-block">
                            {{ t('seRequiereDocumentacion') }}
                        </p>
                    </div>
                    <div v-if="localUser.driver_is_verified">
                        <i
                            class="fa fa-check-circle check-driver-verified"
                            aria-hidden="true"
                        ></i>
                        <strong>{{ t('choferVerificado') }}</strong>
                    </div>
                    <div
                        v-if="
                            localUser.driver_is_verified ||
                            (settings.module_validated_drivers && showBeDriver)
                        "
                    >
                        <div class="form-group">
                            <label for="tipoDeCuenta">
                                {{ t('tipoDeCuenta') }}
                                <span
                                    class="required-field-flag"
                                    :title="t('tituloCampoRequerido')"
                                    >(*)</span
                                >
                            </label>
                            <select
                                v-model="localUser.account_type"
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
                            <span class="error" v-if="accountTypeError.state">
                                {{ accountTypeError.message }}
                            </span>
                        </div>
                        <div class="form-group">
                            <label for="bancoDeCuenta">
                                {{ t('bancoDeCuenta') }}
                                <span
                                    class="required-field-flag"
                                    :title="t('tituloCampoRequerido')"
                                    >(*)</span
                                >
                            </label>
                            <select
                                v-model="localUser.account_bank"
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
                            <span class="error" v-if="accountBankError.state">
                                {{ accountBankError.message }}
                            </span>
                        </div>
                        <div class="form-group">
                            <label for="accountNumber">
                                {{ t('numeroDeCuenta') }}
                                <span
                                    class="required-field-flag"
                                    :title="t('tituloCampoRequerido')"
                                    >(*)</span
                                >
                            </label>
                            <input
                                v-model="localUser.account_number"
                                type="text"
                                class="form-control"
                                id="accountNumber"
                                :placeholder="t('numeroDeCuenta')"
                            />
                            <span class="error" v-if="accountNumberError.state">
                                {{ accountNumberError.message }}
                            </span>
                        </div>
                    </div>
                    <div
                        class="row"
                        v-if="
                            Array.isArray(localUser.driver_data_docs) &&
                            localUser.driver_data_docs.length
                        "
                    >
                        <div
                            v-imgSrc:docs="img"
                            v-for="img in localUser.driver_data_docs"
                            class="img-doc col-md-8 col-sm-12"
                        ></div>
                    </div>

                    <div class="btn-container">
                        <button
                            class="btn btn-primary btn-donar-header"
                            @click="grabar"
                            :disabled="loading"
                        >
                            <span v-if="!loading">{{
                                t('guardarCambios')
                            }}</span>
                            <spinner class="blue" v-if="loading"></spinner>
                        </button>
                        <span
                            class="required-field-flag"
                            v-bind:class="{ 'required-field-info': isMobile }"
                        >
                            {{ t('camposObligatorios') }}
                        </span>
                    </div>
                    <hr />
                    <div class="delete-account-container">
                        <button
                            class="btn btn-danger pull-right"
                            @click="toggleModalDeleteAccount"
                        >
                            {{ t('eliminarCuenta') }}
                        </button>
                    </div>

                    <span v-if="error">{{ error }}</span>
                    <Uploadfile
                        :name="'profile'"
                        @change="onPhotoChange"
                        ref="fileRef"
                    ></Uploadfile>
                </div>
            </div>
        </div>

        <modal
            :name="'modal-delete-account'"
            v-if="showModalDeleteAccount"
            @close="toggleModalDeleteAccount"
            :body="'Body'"
        >
            <template #header>
                <h3>
                    <span>{{ t('seguroEliminarCuenta') }}</span>
                    <i
                        v-on:click="toggleModalDeleteAccount"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
            </template>
            <template #body>
                <div class="text-left color-black" v-if="!showNegativeRatingsInModal">
                    <p>{{ t('eliminacionCuentaRecuperarCuenta') }}</p>
                    <div class="text-center" style="margin-top: 1em;">
                        <button
                            class="btn btn-default"
                            @click="openMesaAyudaFromDelete"
                        >
                            {{ t('contactarMesaAyuda') }}
                        </button>
                    </div>
                    <p style="margin-top: 1.5em;">{{ t('eliminacionCuentaOtroMotivo') }}</p>
                    <div class="text-center" style="margin-top: 1.5em;">
                        <button
                            class="btn btn-danger"
                            @click="deleteAccount"
                            :disabled="loadingDeleteAccount"
                        >
                            <span v-if="!loadingDeleteAccount"
                                >{{ t('eliminarCuenta') }}</span
                            >
                            <spinner class="blue" v-if="loadingDeleteAccount"></spinner>
                        </button>
                    </div>
                </div>
                <div class="text-left color-black" v-else>
                    <p>{{ t('eliminacionCuentaNegativas') }}</p>
                    <p>{{ t('eliminacionCuentaIrreversible') }}</p>
                    <p>{{ t('eliminacionCuentaPlazo') }}</p>
                    <div class="text-center" style="margin-top: 1.5em;">
                        <button
                            class="btn btn-primary"
                            @click="requestAccountDeletion"
                            :disabled="loadingDeleteAccount"
                        >
                            <span v-if="!loadingDeleteAccount">{{ t('solicitarEliminacionCuenta') }}</span>
                            <spinner class="blue" v-if="loadingDeleteAccount"></spinner>
                        </button>
                    </div>
                </div>
            </template>
        </modal>

        <modal
            name="mesaAyudaModal"
            v-if="showMesaAyudaModal"
            @close="showMesaAyudaModal = false"
        >
            <template #header>
                <h3>
                    <span>{{ t('mesaAyuda') }}</span>
                    <i
                        v-on:click="showMesaAyudaModal = false"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
            </template>
            <template #body>
                <div class="text-left color-black login-modal">
                    <p>
                        {{ t('mesaAyudaFuncionaDesde') }}
                        <a :href="'mailto:' + config.admin_email">
                            {{ config.admin_email }}</a>,
                        {{ t('mensajePrivadoDe') }}
                        <a href="https://instagram.com/carpoolear">Instagram</a>
                        {{ t('y') }}
                        <a href="https://facebook.com/carpoolear">Facebook</a>.
                    </p>
                </div>
            </template>
        </modal>

        <modal
            name="errorAlGuardarModal"
            v-if="showBannedDniModal"
            @close="toggleBannedDniModal"
        >
            <template #header>
                <h3>
                    <span>{{ t('errorAlGuardar') }}</span>
                    <i
                        v-on:click="toggleBannedDniModal"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
            </template>
            <template #body>
                <div class="text-left color-black login-modal">
                    <p>
                        {{ t('errorAlGuardarContactarMesaAyuda') }}
                    </p>
                    <p>
                        {{ t('escribinosMesaAyuda') }}
                    </p>
                    <p>
                        {{ t('mesaAyudaFuncionaDesde') }}
                        <a :href="'mailto:' + config.admin_email">
                            {{ config.admin_email }}</a>,
                        {{ t('mensajePrivadoDe') }}
                        <a href="https://instagram.com/carpoolear">Instagram</a>
                        {{ t('y') }}
                        <a href="https://facebook.com/carpoolear">Facebook</a>.
                    </p>
                </div>
            </template>
        </modal>

        <modal
            name="datosEnUsoModal"
            v-if="showDatosEnUsoModal"
            @close="toggleDatosEnUsoModal"
        >
            <template #header>
                <h3>
                    <span>{{ t('datosEnUso') }}</span>
                    <i
                        v-on:click="toggleDatosEnUsoModal"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
            </template>
            <template #body>
                <div class="text-left color-black login-modal">
                    <p>
                        {{ t('datosEnUsoDescripcion') }}
                    </p>
                    <p>
                        {{ t('escribinosMesaAyuda') }}
                    </p>
                    <p>
                        {{ t('mesaAyudaFuncionaDesde') }}
                        <a :href="'mailto:' + config.admin_email">
                            {{ config.admin_email }}</a>,
                        {{ t('mensajePrivadoDe') }}
                        <a href="https://instagram.com/carpoolear">Instagram</a>
                        {{ t('y') }}
                        <a href="https://facebook.com/carpoolear">Facebook</a>.
                    </p>
                </div>
            </template>
        </modal>
    </div>
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCarsStore } from '@/stores/cars';
import { useDeviceStore } from '@/stores/device';
import { useProfileStore } from '@/stores/profile';
import { inputIsNumber, formatId, cleanId } from '../../services/utility';
import Uploadfile from '../Uploadfile';
import DatePicker from '../DatePicker';
import SvgItem from '../SvgItem';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';
import modal from '../Modal';
import { UserApi } from '../../services/api';
import { scrollToElement } from '../../../utils/helpers';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const carsStore = useCarsStore();
const deviceStore = useDeviceStore();
const profileStore = useProfileStore();

class ValidationError {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

const fileRef = ref(null);

const localUser = ref(null);
const car = ref(null);
const patente = ref('');
const pass = reactive({
    password: '',
    password_confirmation: ''
});
const error = ref(null);
const loading = ref(false);
const loadingImg = ref(false);
const globalError = ref(false);
const nombreError = reactive(new ValidationError());
const descError = reactive(new ValidationError());
const birthdayError = reactive(new ValidationError());
const patentError = reactive(new ValidationError());
const dniError = reactive(new ValidationError());
const unaswered_messages_limitError = reactive(new ValidationError());
const phoneError = reactive(new ValidationError());
const emailError = reactive(new ValidationError());
const accountNumberError = reactive(new ValidationError());
const accountTypeError = reactive(new ValidationError());
const accountBankError = reactive(new ValidationError());
const maxDate = moment().toDate();
const minDate = moment('1900-01-01').toDate();
const birthday = ref('');
const birthdayAnswer = ref('');
const showChangePassword = ref(false);
const showBeDriver = ref(false);
const driverFiles = ref(null);
const banks = ref([]);
const accountTypes = ref([]);
const showModalDeleteAccount = ref(false);
const loadingDeleteAccount = ref(false);
const showDatosEnUsoModal = ref(false);
const showBannedDniModal = ref(false);
const showNegativeRatingsInModal = ref(false);
const showMesaAyudaModal = ref(false);
const userApi = ref(null);

const userData = computed(() => authStore.user);
const firstTime = computed(() => authStore.firstTime);
const cars = computed(() => carsStore.cars);
const isMobile = computed(() => deviceStore.isMobile);
const settings = computed(() => authStore.appConfig);
const config = computed(() => authStore.appConfig);

const iptUser = computed(() => {
    if (localUser.value) {
        return localUser.value.name;
    }
});
const iptEmail = computed(() => {
    if (localUser.value) {
        return localUser.value.email;
    }
});
const iptBirthday = computed(() => {
    if (localUser.value) {
        return localUser.value.birthdayAnswer;
    }
});
const iptDescription = computed(() => {
    if (localUser.value) {
        return localUser.value.description;
    }
});
const iptDni = computed(() => {
    if (localUser.value) {
        return localUser.value.nro_doc;
    }
});
const isDniLockedByValidation = computed(() => {
    return !!(
        localUser.value &&
        localUser.value.identity_validated &&
        localUser.value.identity_validated_at
    );
});
const dniInputTitle = computed(() => {
    return isDniLockedByValidation.value
        ? t('dniValidadoContacteSoporte')
        : '';
});
const iptPhone = computed(() => {
    if (localUser.value) {
        return localUser.value.mobile_phone;
    }
});

function jumpToError() {
    let hasError = document.getElementsByClassName('has-error');
    if (hasError.length) {
        let element = hasError[0];
        scrollToElement(element, -270);
    }
}

function changeShowPassword() {
    showChangePassword.value = !showChangePassword.value;
}

function changeBeDriver() {
    showBeDriver.value = !showBeDriver.value;
}

function isNumber(value) {
    inputIsNumber(value);
}

function handleDniInput(event) {
    const formatted = formatId(event.target.value, config.value.profile_id_format);
    event.target.value = formatted;
    localUser.value.nro_doc = formatted;
}

function onPhotoChange(data) {
    loadingImg.value = true;
    authStore.updatePhoto(data)
        .then((u) => {
            localUser.value.image = u.image;
            loadingImg.value = false;
        })
        .catch(() => {
            loadingImg.value = false;
        });
}

function onDriverDocumentChange(event) {
    if (event.target.files) {
        driverFiles.value = event.target.files;
    }
}

function dateChange(value) {
    birthdayAnswer.value = value;
}

function changePhoto() {
    fileRef.value.show();
}

function grabar() {
    if (validate()) {
        nextTick(() => {
            jumpToError();
            dialogs.message(t('faltanCamposObligatorios'), {
                duration: 10,
                estado: 'error'
            });
        });
        return;
    }
    loading.value = true;
    // Ensure localUser.nro_doc is raw value (no dots) before sending
    if (localUser.value && localUser.value.nro_doc) {
        localUser.value.nro_doc = cleanId(localUser.value.nro_doc, config.value.profile_id_format);
    }
    console.log('localUser', localUser.value);
    var data = Object.assign({}, localUser.value);
    console.log('data.user', data);
    if (pass.password) {
        if (pass.password !== pass.password_confirmation) {
            error.value = t('passwordNoCoincide');
            return;
        }
        data.password = pass.password;
        data.password_confirmation = pass.password_confirmation;
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
                if (data[key] !== null) {
                    bodyFormData.append(key, data[key]);
                }
            }
        }
    }
    if (driverFiles.value) {
        bodyFormData.append('user_be_driver', true);
        for (let index = 0; index < driverFiles.value.length; index++) {
            const file = driverFiles.value[index];
            bodyFormData.append('driver_data_docs[]', file);
        }
    }
    authStore.update(bodyFormData)
        .then(() => {
            pass.password = '';
            pass.password_confirmation = '';
            loading.value = false;
            dialogs.message(t('perfilActualizadoCorrectamente'));
            if (patente.value.length) {
                if (car.value) {
                    car.value.patente = patente.value;
                    carsStore.update(car.value);
                } else {
                    let carData = {
                        description: 'NOT USED YET',
                        patente: patente.value
                    };
                    carsStore.create(carData);
                }
            }
            if (
                localUser.value.image &&
                localUser.value.image.length > 0 &&
                localUser.value.description &&
                localUser.value.description.length > 0
            ) {
                if (router.rememberRoute) {
                    router.rememberBack();
                }
            } else {
                if (!(localUser.value.image && localUser.value.image.length > 0)) {
                    dialogs.message(t('debesImagenPerfil'), {
                        duration: 10,
                        estado: 'error'
                    });
                }
            }
        })
        .catch((err) => {
            console.error(err);
            loading.value = false;
            error.value = t('errorDatos');
            jumpToError();
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
                showDatosEnUsoModal.value = true;
            }
            const isBannedDni =
                err &&
                err.errors &&
                err.errors.error === 'banned_dni';
            if (isBannedDni) {
                showBannedDniModal.value = true;
            }
        });
}

function validate() {
    let hasGlobalError = false;

    if (!localUser.value.name || localUser.value.name.length < 1) {
        nombreError.state = true;
        nombreError.message = t('olvidasteNombre');
        hasGlobalError = true;
    }

    if (!localUser.value.description || localUser.value.description.length < 1) {
        descError.state = true;
        descError.message = t('olvidasteDescripcion');
        hasGlobalError = true;
    } else if (localUser.value.description.replace(' ', '').length < 10) {
        descError.state = true;
        descError.message = t('descripcionCorta');
        hasGlobalError = true;
    }

    const dniRaw = localUser.value && localUser.value.nro_doc
        ? cleanId(localUser.value.nro_doc, config.value.profile_id_format)
        : '';

    if (!dniRaw || dniRaw.length < 1) {
        dniError.state = true;
        dniError.message = t('olvidasteDni');
        hasGlobalError = true;
    } else if (dniRaw.length > 0 && dniRaw.length < 7) {
        dniError.state = true;
        dniError.message = t('dniNoValido');
        hasGlobalError = true;
    }

    if (!localUser.value.mobile_phone || localUser.value.mobile_phone.length < 1) {
        phoneError.state = true;
        phoneError.message = t('olvidasteTel');
        hasGlobalError = true;
    } else if (
        localUser.value.mobile_phone &&
        localUser.value.mobile_phone.length > 0 &&
        localUser.value.mobile_phone.length < 6
    ) {
        phoneError.state = true;
        phoneError.message = t('telefonoNoValido');
        hasGlobalError = true;
    }

    if (
        localUser.value.driver_is_verified ||
        (settings.value.module_validated_drivers && showBeDriver.value)
    ) {
        if (!localUser.value.account_number) {
            accountNumberError.state = true;
            accountNumberError.message = t('campoObligatorio');
            hasGlobalError = true;
        }
        if (!localUser.value.account_type) {
            accountTypeError.state = true;
            accountTypeError.message = t('campoObligatorio');
            hasGlobalError = true;
        }
        if (!localUser.value.account_bank) {
            accountBankError.state = true;
            accountBankError.message = t('campoObligatorio');
            hasGlobalError = true;
        }
    }

    return hasGlobalError;
}

function toggleModalDeleteAccount() {
    showModalDeleteAccount.value = !showModalDeleteAccount.value;
    showNegativeRatingsInModal.value = false;
}

function openMesaAyudaFromDelete() {
    showModalDeleteAccount.value = false;
    showMesaAyudaModal.value = true;
}

function toggleDatosEnUsoModal() {
    showDatosEnUsoModal.value = !showDatosEnUsoModal.value;
}

function toggleBannedDniModal() {
    showBannedDniModal.value = !showBannedDniModal.value;
}

function deleteAccount() {
    loadingDeleteAccount.value = true;
    userApi.value
        .deleteAccount()
        .then((response) => {
            loadingDeleteAccount.value = false;
            showModalDeleteAccount.value = false;
            const action = response && response.action;
            const message = action === 'deleted'
                ? t('usuarioEliminadoExitosamente')
                : action === 'anonymized'
                    ? t('usuarioAnonimizadoExitosamente')
                    : (response && response.message) || t('pedidoEliminacionEnviado');
            dialogs.message(message, {
                duration: 5,
                estado: 'success'
            });
            window.location.href = router.resolve({ name: 'trips' }).href;
        })
        .catch((err) => {
            loadingDeleteAccount.value = false;
            if (err.data && err.data.error === 'negative_ratings') {
                showNegativeRatingsInModal.value = true;
            } else {
                const message = (err.data && err.data.message) || t('errorEnviarPedidoEliminacion');
                dialogs.message(message, {
                    duration: 5,
                    estado: 'error'
                });
            }
        });
}

function requestAccountDeletion() {
    loadingDeleteAccount.value = true;
    userApi.value
        .deleteAccountRequest()
        .then(() => {
            loadingDeleteAccount.value = false;
            showModalDeleteAccount.value = false;
            showNegativeRatingsInModal.value = false;
            dialogs.message(t('pedidoEliminacionEnviado'), {
                duration: 5,
                estado: 'success'
            });
        })
        .catch(() => {
            loadingDeleteAccount.value = false;
            dialogs.message(t('errorEnviarPedidoEliminacion'), {
                duration: 5,
                estado: 'error'
            });
        });
}

watch(cars, () => {
    console.log('cars', cars.value);
    if (cars.value && cars.value.length > 0) {
        car.value = cars.value[0];
        patente.value = car.value.patente;
    }
});

watch(userData, () => {
    console.log('userData', userData.value);
    localUser.value = userData.value ? JSON.parse(JSON.stringify(userData.value)) : null;
    if (localUser.value && localUser.value.nro_doc) {
        localUser.value.nro_doc = formatId(localUser.value.nro_doc, config.value.profile_id_format);
    }
});

watch(iptUser, () => {
    nombreError.state = false;
});
watch(iptEmail, () => {
    emailError.state = false;
});
watch(birthdayAnswer, () => {
    birthdayError.state = false;
});
watch(iptDescription, () => {
    descError.state = false;
});
watch(iptDni, () => {
    dniError.state = false;
});
watch(iptPhone, () => {
    phoneError.state = false;
});
watch(patente, () => {
    patentError.state = false;
});

onMounted(() => {
    userApi.value = new UserApi();
    console.log('router', router);
    profileStore.getBankData().then((data) => {
        console.log('get bank data', data);
        banks.value = data.banks;
        accountTypes.value = data.cc;
    });

    // Load user's cars to populate patente field
    carsStore.index().then(() => {
        console.log('Cars loaded for profile update');
        if (cars.value && cars.value.length > 0) {
            car.value = cars.value[0];
            patente.value = car.value.patente;
            console.log('Patente set from loaded car:', patente.value);
        }
    }).catch((err) => {
        console.error('Failed to load cars:', err);
    });
    bus.on('date-change', dateChange);
    localUser.value = userData.value ? JSON.parse(JSON.stringify(userData.value)) : null;
    // Format nro_doc with pattern when page loads
    if (localUser.value && localUser.value.nro_doc) {
        localUser.value.nro_doc = formatId(localUser.value.nro_doc, config.value.profile_id_format);
    }
    console.log('USUARIO', userData.value);
    if (
        Array.isArray(localUser.value.driver_data_docs) &&
        localUser.value.driver_data_docs.length
    ) {
        showBeDriver.value = true;
    }
    if (cars.value) {
        if (cars.value.length > 0) {
            car.value = cars.value[0];
            patente.value = car.value.patente;
        }
    }
    try {
        if (moment(localUser.value.birthday, 'YYYY-MM-DD').isValid()) {
            birthday.value = moment(localUser.value.birthday, 'YYYY-MM-DD');
        } else {
            birthday.value = '';
        }
    } catch (ex) {
        console.log('exception', ex);
    }
});

onBeforeUnmount(() => {
    bus.off('date-change', dateChange);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.delete-account-container {
    display: flex;
    justify-content: flex-end;
}
.required-field-flag {
    color: red;
}
.required-field-info {
    display: block;
    padding: 1em 0;
}
.profile_image-container.error .circle-box {
    border: solid 2px red;
}
.profile_image-container.error .span {
    color: red;
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

hr {
    border-top: 1px solid #cccccc;
}
</style>
