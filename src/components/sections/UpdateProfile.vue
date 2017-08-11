<template>
  <div class="update-profile-component" v-if="user" >
    <div class="alert alert-info" v-if="!user.image || user.image.length === 0 || !user.description || user.description.length === 0">
        <div class='alert-icon'><i class="fa fa-exclamation" aria-hidden="true"></i></div>
        <div class='alert-message'>
            Hola <strong>{{user.name}}</strong>!! Bienvenido a Carpoolear, para comenzar a subirte a viajes y crear tus propios viajes, debes terminar de completar tu perfil.
            <span v-if="(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                Completa tu <strong>imagen de perfil</strong> y tu <strong>descripción</strong> para comenzar a viajar.
            </span>
            <span v-if="(!user.image || user.image.length === 0) && !(!user.description || user.description.length === 0)">
                Completa tu <strong>imagen de perfil</strong> para comenzar a viajar.
            </span>
            <span v-if="!(!user.image || user.image.length === 0) && (!user.description || user.description.length === 0)">
                Completa tu <strong>descripción</strong> para comenzar a viajar.
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
                <div class="form-group">
                    <label for="input-name">Nombre y apellido (*)</label>
                    <input maxlength="25" v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre" :class="{'has-error': nombreError.state }" />
                    <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-email">E-mail (*)</label>
                    <input maxlength="40" v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail" disabled>
                </div>
                <div class="form-group">
                    <label for="">Fecha de nacimiento (*)</label>
                    <DatePicker :value="birthday" ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>
                    <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-description">Descripción (*)<span class="description"> Contale de vos al resto de los carpooleros así te suman a sus viajes!! Qué te gusta hacer, en qué andas metido ahora, si estás con alguna idea, si te gustan los colores, etc.</span></label>
                    <textarea maxlength="280" v-model="user.description" placeholder="Descripción" :class="{'has-error': descError.state }" ></textarea>
                    <span class="error textarea" v-if="descError.state"> {{descError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-dni">Número de documento <span class="description">(Solo números)</span></label>
                    <input v-numberMask="'dniRawValue'" type="text" data-max-length="8" v-model="user.nro_doc" class="form-control" id="input-dni" placeholder="DNI" :class="{'has-error': dniError.state }">
                    <span class="error" v-if="dniError.state"> {{dniError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-telefono">Número de teléfono <span class="description">(Código área + teléfono. Ej: 0341156708223)</span></label>
                    <input maxlength="20" @keydown="isNumber" v-on:paste='isNumber' v-model="user.mobile_phone" type="tel" class="form-control" id="input-phone" placeholder="Número de teléfono (al menos 7 números)" :class="{'has-error': phoneError.state }">
                    <span class="error" v-if="phoneError.state"> {{phoneError.message}} </span>
                </div>
                <div class="form-group">
                    <label for="input-patente">Patente <span class="description">(Sin espacios. Ej: ABC123 o AA123AA)</span></label>
                    <input :style="patente.length > 0 ? 'text-transform: uppercase' : ''" v-mask="'AAN##NA'" v-model="patente" type="text" class="form-control" id="input-patente" placeholder="Patentes válidas (AAA111 o AA111BB)" :class="{'has-error': patentError.state }">
                    <span class="error" v-if="patentError.state"> {{patentError.message}} </span>
                </div>

                <div class="checkbox">
                    <label>
                    <input type="checkbox" v-model="user.emails_notifications"> Recibir notificaciones por correo electrónico.
                    </label>
                </div>
                <div class="form-group">
                    <label for="input-pass">Cambiar contraseña</label>
                    <input maxlength="40" v-model="pass.password" type="password" class="form-control" id="input-pass" placeholder="Contraseña">
                    <input maxlength="40" v-model="pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repetir contraseña">
                </div>

                <div class="btn-container">
                    <button class="btn btn-primary" @click="grabar" :disabled="loading"> <span v-if="!loading">Guardar cambios</span><span v-if="loading">Guardando ...</span> </button>
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
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate(),
            birthday: ''
        };
    },
    computed: {
        ...mapGetters({
            userData: 'auth/user',
            cars: 'cars/cars'
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
                return this.user.birthday;
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
            carUpdate: 'cars/update'
        }),
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
        changePhoto () {
            this.$refs.file.show();
        },
        grabar () {
            if (this.validate()) {
                dialogs.message('Te faltaron completar campos obligatorios o ingresaste datos inválidos.', { duration: 10, estado: 'error' });
                return;
            }
            this.loading = true;
            var data = Object.assign({}, this.user);
            if (this.pass.password) {
                if (this.pass.password !== this.pass.password_confirmation) {
                    this.error = 'Password no coincide';
                    return;
                }
                data.password = this.pass.password;
                data.password_confirmation = this.pass.password_confirmation;
            }
            data.nro_doc = this.dniRawValue;
            this.update(data).then(() => {
                this.pass.password = '';
                this.pass.password_confirmation = '';
                this.loading = false;
                dialogs.message('Perfil actualizado correctamente.');
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
                if ((this.user.image && this.user.image.length > 0) && (this.user.description && this.user.description.length > 0)) {
                    this.$router.rememberBack();
                }
                if (moment(this.birthday, 'DD/MM/YYYY').isValid()) {
                    console.log('valid date');
                    this.user.birthday = moment(this.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    console.log(this.user.birthday);
                }
            }).catch(response => {
                this.loading = false;
                this.error = 'No se pudo grabar los datos. Intente de nuevo';
            });
        },
        validate () {
            let globalError = false;
            /* if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvido ingresar su contraseña.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseña debe tener al menos 8 caracteres.';
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvido confirmar su contraseña.';
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseñas no coinciden.';
                globalError = true;
            } */

            if (!this.user.name || this.user.name.length < 1) {
                this.nombreError.state = true;
                this.nombreError.message = 'Olvidaste ingresar tu nombre y apellido.';
                globalError = true;
            }

            if (!this.birthday || this.birthday.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'Olvidaste ingresar tu fecha de nacimiento.';
                globalError = true;
            } else {
                let birthday = moment(this.birthday, 'DD/MM/YYYY');
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'Pareciera que no eres mayor de edad. Revisa si ingresaste bien tu fecha de nacimiento y recuerda que debes ser mayor de edad para utilziar carpoolear. Para más información te recomendamos volver a leer los términos y condiciones.';
                    globalError = true;
                }
            }

            if (this.patente && this.patente.length > 0) {
                if (!patentRegex.test(this.patente)) {
                    this.patentError.state = true;
                    this.patentError.message = 'La patente ingresada no tiene un formato válido.';
                    globalError = true;
                }
            }

            if (!this.user.description || this.user.description.length < 1) {
                this.descError.state = true;
                this.descError.message = 'Olvidaste completar tu descripción.';
                globalError = true;
            } else if (this.user.description.replace(' ', '').length < 10) {
                this.descError.state = true;
                this.descError.message = 'Ups! Tu descripción es muy acotada. No seas tímido, contanos un poco más.';
                globalError = true;
            }

            if (this.dniRawValue && this.dniRawValue.length > 0 && this.dniRawValue.length < 7) {
                this.dniError.state = true;
                this.dniError.message = 'El DNI que ingresaste no es válido.';
                globalError = true;
            }

            if (this.user.mobile_phone && this.user.mobile_phone.length > 0 && this.user.mobile_phone.length < 6) {
                this.phoneError.state = true;
                this.phoneError.message = 'El teléfono que ingresaste no es válido.';
                globalError = true;
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
        birthday: function () {
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
        bus.on('date-change', (value) => {
            console.log(value);
            this.birthday = value;
        });
        this.user = this.userData;
        if (this.cars) {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        };
        console.log(this.user.birthday);
        if (moment(this.user.birthday, 'YYYY-MM-DD').isValid()) {
            console.log('is valid');
            this.birthday = moment(this.user.birthday, 'YYYY-MM-DD').format('DD/MM/YYYY');
        } else {
            console.log('is not valid');
            this.birthday = '';
        }
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
</style>
