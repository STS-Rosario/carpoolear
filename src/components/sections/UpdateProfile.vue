<template>
  <div class="update-profile-component" v-if="user" >
    <div class="alert alert-info" v-if="!user.image || user.image.length === 0 || !user.description || user.description.length === 0">
        <div class='alert-icon'><i class="fa fa-exclamation" aria-hidden="true"></i></div>
        <div class='alert-message'>
            {{ $t('hola') }} <strong>{{user.name}}</strong> {{ $t('bienvenidoACarpoolear') }}
            <span v-if="(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                {{ $t('completaTu') }} <strong>{{ $t('imagenPerfil') }}</strong> {{ $t('yTu') }} <strong>{{ $t('descripcion') }}</strong> {{ $t('comenzarViajar') }}
            </span>
            <span v-if="(!user.image || user.image.length === 0) && !(!user.description || user.description.length === 0)">
                {{ $t('completaTu') }} <strong>{{ $t('imagenPerfil') }}</strong> {{ $t('comenzarViajar') }}
            </span>
            <span v-if="!(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                {{ $t('completaTu') }} <strong>{{ $t('descripcion') }}</strong> {{ $t('comenzarViajar') }}
            </span>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-24 col-sm-8 col-sm-push-16 profile_image">
            <div class='profile_image-container'>
                <div class="circle-box" v-imgSrc:profile="user.image" :class="{'loading': loadingImg}">
                    <div @click="changePhoto" class="profile_image-edit">
                        <svgItem icon='addPhoto' size='28'></svgItem>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-24 col-sm-16 col-sm-pull-8">
            <div class='form'>
                <div class="alert alert-info">
                    {{ $t('incentivoFoto') }}
                </div>
                <div class="form-group">
                    <label for="input-name">{{ $t('nombreYapellido') }} <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                    <input maxlength="25" v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre" :class="{'has-error': nombreError.state }" :disabled="!firstTime" />
                    <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-email">E-mail <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                    <input maxlength="40" v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail" disabled>
                </div>
                <!--<div class="form-group">
                    <label for="">Fecha de nacimiento <span class="required-field-flag" title="Campo requerido">(*)</span></label>
                    <DatePicker :value="birthday | moment('YYYY-MM-DD') " ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>
                    <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
                </div>-->
                <div class="form-group">
                    <label for="input-description">{{ $t('acercaDeMi') }} <span class="required-field-flag" title="Campo requerido">(*)</span><span class="description"> {{ $t('incentivoDescripcion') }}</span></label>
                    <textarea maxlength="1000" v-model="user.description" placeholder="Descripción" :class="{'has-error': descError.state }" ></textarea>
                    <span class="error textarea" v-if="descError.state"> {{descError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-dni">{{ $t('documento') }} <span class="description">({{ $t('soloNumeros') }}). {{ $t('incentivoDoc') }} {{ $t('doc') }} {{ $t('momentoViajar') }}</span></label>
                    <input v-numberMask="'dniRawValue'" type="text" data-max-length="8" v-model="user.nro_doc" class="form-control" id="input-dni" placeholder="DNI" :class="{'has-error': dniError.state }">
                    <span class="error" v-if="dniError.state"> {{dniError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-telefono">{{ $t('nroTel') }} <span class="description">({{ $t('ejemploTelefono') }}). {{ $t('incentivoTelefono') }}</span></label>
                    <input maxlength="20" @keydown="isNumber" v-on:paste='isNumber' v-model="user.mobile_phone" type="tel" class="form-control" id="input-phone" placeholder="Número de teléfono (al menos 7 números)" :class="{'has-error': phoneError.state }">
                    <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
                </div>

                <div class="checkbox">
                    <label>
                    <input type="checkbox" v-model="user.emails_notifications"> {{ $t('notificacionesPorCorreo') }}
                    </label>
                </div>
                <hr />
                <div class="checkbox">
                    <label >
                        <input type="checkbox"  @change="changeShowPassword"> {{ $t('cambiarPassword') }}
                    </label>
                </div>
                <div class="form-group" v-if="showChangePassword">
                    <label for="input-pass">{{ $t('ingreseNuevaPassword') }}</label>
                    <input maxlength="40" v-model="pass.password" type="password" class="form-control" id="input-pass" placeholder="Contraseña">
                    <input maxlength="40" v-model="pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repetir contraseña">
                </div>
                <hr />
                <div class="checkbox" v-if="settings.module_validated_drivers && !user.driver_is_verified">
                    <label >
                        <input type="checkbox" @change="changeBeDriver" v-model="this.showBeDriver"> {{ $t('solicitarSerChofer') }}
                    </label>
                </div>
                <div class="form-group" v-if="settings.module_validated_drivers && showBeDriver && !user.driver_is_verified">
                    <label for="driver_documentation">{{ $t('ingreseDocumentacion') }}</label>
                    <input type="file" id="driver_documentation" multiple @change="onDriverDocumentChange" />
                    <p class="help-block">{{ $t('seRequiereDocumentacion') }}</p>
                </div>
                <div v-if="user.driver_is_verified">
                    <i class="fa fa-check-circle check-driver-verified" aria-hidden="true"></i>
                    <strong>{{ $t('choferVerificado') }}</strong>
                </div>
                <div v-if="user.driver_is_verified || (settings.module_validated_drivers && showBeDriver)">
                    <div class="form-group">
                        <label for="tipoDeCuenta">
                            {{ $t('tipoDeCuenta') }}
                            <span class="required-field-flag" title="Campo requerido">(*)</span>
                        </label>
                        <select v-model="user.account_type" id="tipoDeCuenta" class="form-control">
                            <option v-for="option in accountTypes" v-bind:value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
                        <span class="error" v-if="accountTypeError.state"> {{accountTypeError.message}} </span>
                    </div>
                    <div class="form-group">
                        <label for="bancoDeCuenta">
                            {{ $t('bancoDeCuenta') }}
                            <span class="required-field-flag" title="Campo requerido">(*)</span>
                        </label>
                        <select v-model="user.account_bank" id="" class="form-control">
                            <option v-for="option in banks" v-bind:value="option.id">
                                {{ option.name }}
                            </option>
                        </select>
                        <span class="error" v-if="accountBankError.state"> {{accountBankError.message}} </span>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber">
                            {{ $t('numeroDeCuenta') }}
                            <span class="required-field-flag" title="Campo requerido">(*)</span>
                        </label>
                        <input v-model="user.account_number" type="text" class="form-control" id="accountNumber" :placeholder="$t('numeroDeCuenta')">
                        <span class="error" v-if="accountNumberError.state"> {{accountNumberError.message}} </span>
                    </div>
                </div>
                <div class="row" v-if="user.driver_data_docs && user.driver_data_docs.length">
                    <div v-imgSrc:docs="img"  v-for="img in user.driver_data_docs" class="img-doc col-md-8 col-sm-12"></div>
                </div>

                <div class="btn-container">
                    <button class="btn btn-primary" @click="grabar" :disabled="loading"> <span v-if="!loading">{{ $t('guardarCambios') }}</span><span v-if="loading">{{ $t('guardando') }}</span> </button>
                    <span class="required-field-flag" v-bind:class="{ 'required-field-info': isMobile }">{{ $t('camposObligatorios') }}</span>
                </div>
                <span v-if="error">{{error}}</span>
                <Uploadfile :name="'profile'" @change="onPhotoChange" ref="file"></Uploadfile>
            </div>
        </div>
    </div>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { inputIsNumber } from '../../services/utility';
import Uploadfile from '../Uploadfile';
import DatePicker from '../DatePicker';
import SvgItem from '../SvgItem';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';
import bus from '../../services/bus-event';

class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

let patentRegex = /([A-Za-z]{3}[0-9]{3})|([A-Za-z]{2}[0-9]{3}[A-Za-z]{2})/;

export default {
    name: 'upddate-profile',
    data () {
        return {
            user: null,
            car: null,
            patente: '',
            pass: {
                password: '',
                password_confirmation: ''
            },
            error: null,
            loading: false,
            loadingImg: false,
            dniRawValue: '',
            globalError: false,
            nombreError: new Error(),
            descError: new Error(),
            birthdayError: new Error(),
            patentError: new Error(),
            dniError: new Error(),
            phoneError: new Error(),
            emailError: new Error(),
            accountNumberError: new Error(),
            accountTypeError: new Error(),
            accountBankError: new Error(),
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate(),
            birthday: '',
            birthdayAnswer: '',
            showChangePassword: false,
            showBeDriver: false,
            driverFiles: null,
            banks: [],
            accountTypes: []
        };
    },
    computed: {
        ...mapGetters({
            userData: 'auth/user',
            firstTime: 'auth/firstTime',
            cars: 'cars/cars',
            isMobile: 'device/isMobile',
            settings: 'auth/appConfig'
        }),
        iptUser () {
            if (this.user) {
                return this.user.name;
            }
        },
        iptEmail () {
            if (this.user) {
                return this.user.email;
            }
        },
        iptBirthday () {
            if (this.user) {
                return this.user.birthdayAnswer;
            }
        },
        iptDescription () {
            if (this.user) {
                return this.user.description;
            }
        },
        iptDni () {
            if (this.user) {
                return this.user.nro_doc;
            }
        },
        iptPhone () {
            if (this.user) {
                return this.user.mobile_phone;
            }
        }
    },
    methods: {
        ...mapActions({
            update: 'auth/update',
            updatePhoto: 'auth/updatePhoto',
            carCreate: 'cars/create',
            carUpdate: 'cars/update',
            getBankData: 'profile/getBankData'
        }),
        changeShowPassword () {
            this.showChangePassword = !this.showChangePassword;
        },
        changeBeDriver () {
            this.showBeDriver = !this.showBeDriver;
        },
        isNumber (value) {
            inputIsNumber(value);
        },
        onPhotoChange (data) {
            this.loadingImg = true;
            this.updatePhoto(data).then(user => {
                this.user.image = user.image;
                this.loadingImg = false;
            }).catch(() => {
                this.loadingImg = false;
            });
        },
        onDriverDocumentChange (event) {
            if (event.target.files) {
                this.driverFiles = event.target.files;
            }
        },
        dateChange (value) {
            this.birthdayAnswer = value;
        },
        changePhoto () {
            this.$refs.file.show();
        },
        grabar () {
            if (this.validate()) {
                dialogs.message(this.$t('faltanCamposObligatorios'), { duration: 10, estado: 'error' });
                return;
            }
            this.loading = true;
            var data = Object.assign({}, this.user);
            if (this.pass.password) {
                if (this.pass.password !== this.pass.password_confirmation) {
                    this.error = this.$t('passwordNoCoincide');
                    return;
                }
                data.password = this.pass.password;
                data.password_confirmation = this.pass.password_confirmation;
            }
            /* if (moment(this.birthdayAnswer, 'YYYY-MM-DD').isValid()) {
                console.log('valid date');
                data.birthday = this.birthdayAnswer;
                console.log(this.user.birthday);
            } */
            data.nro_doc = this.dniRawValue;
            /* global FormData */
            let bodyFormData = new FormData();
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    bodyFormData.append(key, data[key]);
                }
            }
            if (this.driverFiles) {
                bodyFormData.append('user_be_driver', true);
                console.log('file', this.driverFiles);
                for (let index = 0; index < this.driverFiles.length; index++) {
                    const file = this.driverFiles[index];
                    console.log('file', file);
                    bodyFormData.append('driver_data_docs[]', file);
                }
            }
            this.update(bodyFormData).then(() => {
                this.pass.password = '';
                this.pass.password_confirmation = '';
                this.loading = false;
                dialogs.message(this.$t('perfilActualizadoCorrectamente'));
                if (this.patente.length) {
                    if (this.car) {
                        this.car.patente = this.patente;
                        this.carUpdate(this.car);
                    } else {
                        let car = {
                            description: 'NOT USED YET',
                            patente: this.patente
                        };
                        this.carCreate(car);
                    }
                }
                // this.user.birthday = this.birthdayAnswer;
                if ((this.user.image && this.user.image.length > 0) && (this.user.description && this.user.description.length > 0)) {
                    this.$router.rememberBack();
                } else {
                    if (!(this.user.image && this.user.image.length > 0)) {
                        dialogs.message(this.$t('debesImagenPerfil'), { duration: 10, estado: 'error' });
                    }
                }
            }).catch(response => {
                this.loading = false;
                this.error = this.$t('errorDatos');
            });
        },
        validate () {
            let globalError = false;
            /* if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvidó ingresar su contraseña.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseña debe tener al menos 8 caracteres.';
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvidó confirmar su contraseña.';
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseñas no coinciden.';
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
                this.birthdayError.message = 'Olvidaste ingresar tu fecha de nacimiento.';
                globalError = true;
            } else {
                let birthday = moment(this.birthdayAnswer);
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'Pareciera que no eres mayor de edad. Revisa si ingresaste bien tu fecha de nacimiento y recuerda que debes ser mayor de edad para utilizar Carpoolear. Para más información te recomendamos volver a leer los términos y condiciones.';
                    globalError = true;
                }
            } */

            if (this.patente && this.patente.length > 0) {
                if (!patentRegex.test(this.patente)) {
                    this.patentError.state = true;
                    this.patentError.message = this.$t('patenteNoValida');
                    globalError = true;
                }
            }

            if (!this.user.description || this.user.description.length < 1) {
                this.descError.state = true;
                this.descError.message = this.$t('olvidasteDescripcion');
                globalError = true;
            } else if (this.user.description.replace(' ', '').length < 10) {
                this.descError.state = true;
                this.descError.message = this.$t('descripcionCorta');
                globalError = true;
            }

            if (this.dniRawValue && this.dniRawValue.length > 0 && this.dniRawValue.length < 7) {
                this.dniError.state = true;
                this.dniError.message = this.$t('dniNoValido');
                globalError = true;
            }

            if (this.user.mobile_phone && this.user.mobile_phone.length > 0 && this.user.mobile_phone.length < 6) {
                this.phoneError.state = true;
                this.phoneError.message = this.$t('telefonoNoValido');
                globalError = true;
            }

            if (this.user.driver_is_verified || (this.settings.module_validated_drivers && this.showBeDriver)) {
                if (!this.user.account_number) {
                    this.accountNumberError.state = true;
                    this.accountNumberError.message = this.$t('campoObligatorio');
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
        }
    },
    watch: {
        cars: function () {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        },
        userData: function () {
            this.user = this.userData;
        },
        iptUser () {
            this.nombreError.state = false;
        },
        iptEmail () {
            this.emailError.state = false;
        },
        birthdayAnswer: function () {
            this.birthdayError.state = false;
        },
        iptDescription () {
            this.descError.state = false;
        },
        iptDni () {
            this.dniError.state = false;
        },
        iptPhone () {
            this.phoneError.state = false;
        },
        patente () {
            this.patentError.state = false;
        }
    },

    mounted () {
        this.getBankData().then((data) => {
            console.log('get bank data', data);
            this.banks = data.banks;
            this.accountTypes = data.cc;
        });
        bus.on('date-change', this.dateChange);
        this.user = this.userData;
        if (this.user.driver_data_docs && this.user.driver_data_docs.length) {
            this.showBeDriver = true;
        }
        if (this.cars) {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        };
        try {
            if (moment(this.user.birthday, 'YYYY-MM-DD').isValid()) {
                this.birthday = moment(this.user.birthday, 'YYYY-MM-DD');
            } else {
                this.birthday = '';
            }
        } catch (ex) {
            console.log('exception', ex);
        }
    },
    beforeDestroy () {
        bus.off('date-change', this.dateChange);
    },
    components: {
        DatePicker,
        Uploadfile,
        SvgItem
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
        margin-top: .8em;
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
</style>
