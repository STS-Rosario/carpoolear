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
                    <label for="input-name">Nombre</label>
                    <input maxlength="25" v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre">
                </div>
                <div class="form-group">
                    <label for="input-email">E-mail</label>
                    <input maxlength="40" v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail" disabled>
                </div>
                <div class="form-group">
                    <label for="">Fecha de nacimiento</label>
                    <Calendar :class="'form-control form-control-with-icon form-control-date'" :value="user.birthday | moment('DD//MM//YYYY')" @change="(date) => this.user.birthday = date"></Calendar>
                </div>
                <div class="form-group">
                    <label for="input-dni">Número de documento <span class="description">(Solo números)</span></label>
                    <input v-numberMask="'dniRawValue'" type="text" data-max-length="8" v-model="user.nro_doc" class="form-control" id="input-dni" placeholder="DNI">
                </div>
                <div class="form-group">
                    <label for="input-telefono">Número de teléfono <span class="description">(Código área + teléfono. Ej: 0341156708223)</span></label>
                    <input maxlength="20" @keydown="isNumber" v-on:paste='isNumber' v-model="user.mobile_phone" type="tel" class="form-control" id="input-phone" placeholder="Número de teléfono">
                </div>
                <div class="form-group">
                    <label for="input-patente">Patente <span class="description">(Sin espacios. Ej: ABC123 o AA123AA)</span></label>
                    <input :style="patente.length > 0 ? 'text-transform: uppercase' : ''" v-mask="'AAN##NA'" v-model="patente" type="text" class="form-control" id="input-patente" placeholder="Patente">
                </div>
                <div class="form-group">
                    <label for="input-description">Descripción <span class="description"> Contale de vos al resto de los carpooleros así te suman a sus viajes!! Qué te gusta hacer, en qué andas metido ahora, si estás con alguna idea, si te gustan los colores, etc.</span></label>
                    <textarea maxlength="280" v-model="user.description" placeholder="Descripción"></textarea>
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
import Calendar from '../Calendar';
import Uploadfile from '../Uploadfile';
import SvgItem from '../SvgItem';
import dialogs from '../../services/dialogs.js';

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
            dniRawValue: ''
        };
    },
    computed: {
        ...mapGetters({
            userData: 'auth/user',
            cars: 'cars/cars'
        })
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
            this.loading = true;
            var data = Object.assign({}, this.user);
            if (this.pass.password) {
                if (this.pass.password !== this.pass.password_confirmation) {
                    this.error = 'password no coincide';
                }
                data.password = this.pass.password;
                data.password = this.pass.password_confirmation;
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
                this.$router.rememberBack();
            }).catch(response => {
                this.loading = false;
                this.error = 'No se pudo grabar los datos. Intente de nuevo';
            });
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
        }
    },

    mounted () {
        this.user = this.userData;
        if (this.cars) {
            if (this.cars.length > 0) {
                this.car = this.cars[0];
                this.patente = this.car.patente;
            }
        }
    },
    components: {
        Calendar,
        Uploadfile,
        SvgItem
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
