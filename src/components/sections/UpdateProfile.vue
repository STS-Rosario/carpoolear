<template>
  <div class="update-profile-component" v-if="user" >
    <div class="row">
        <div class="col-xs-24 col-sm-8 col-sm-push-16 profile_image">
            <div class='profile_image-container'>
                <div class="circle-box" v-imgSrc:profile="user.image" :class="{'loading': loadingImg}">
                    <div @click="changePhoto" class="profile_image-edit">
                        <i class="material-icons">&#xE439;</i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xs-24 col-sm-16 col-sm-pull-8">
            <div class='form'>
                <div class="form-group">
                    <label for="input-name">Nombre</label>
                    <input v-model="user.name" type="text" class="form-control" id="input-name" placeholder="Nombre">
                </div>
                <div class="form-group">
                    <label for="input-email">E-mail</label>
                    <input v-model="user.email" type="text" class="form-control" id="input-email" placeholder="E-mail">
                </div>
                <div class="form-group">
                    <label for="">Fecha de nacimiento</label>
                    <Calendar :class="'form-control form-control-with-icon form-control-date'" :value="user.birthday" @change="(date) => this.user.birthday = date"></Calendar>
                </div>
                <div class="form-group">
                    <label for="input-dni">Número de documento</label>
                    <input v-model="user.nro_doc" type="text" class="form-control" id="input-dni" placeholder="DNI">
                </div>
                <div class="form-group">
                    <label for="input-telefono">Número de teléfono</label>
                    <input v-model="user.mobile_phone" type="text" class="form-control" id="input-phone" placeholder="Número de teléfono">
                </div>
                <div class="form-group">
                    <label for="input-genero">Sexo</label>
                    <input v-model="user.gender" type="text" class="form-control" id="input-genero" placeholder="Sexo">
                </div>
                <div class="form-group">
                    <label for="input-patente">Patente</label>
                    <input v-model="patente" type="text" class="form-control" id="input-patente" placeholder="Patente">
                </div>
                <div class="form-group">
                    <label for="input-description">Pequeña descripción personal</label>
                    <textarea v-model="user.description" placeholder="Descripción"></textarea>
                </div>

                <div class="checkbox">
                    <label>
                    <input type="checkbox" v-model="user.emails_notifications"> Recibir notificaciones por correo electrónico.
                    </label>
                </div>

                <div class="form-group">
                    <label for="input-pass">Cambiar contraseña</label>
                    <input v-model="pass.password" type="password" class="form-control" id="input-pass" placeholder="Contraseña">
                    <input v-model="pass.password_confirmation" type="password" class="form-control" id="input-pass-confirm" placeholder="Repetir contraseña">
                </div>

                <div class="btn-container">
                    <button class="btn btn-primary" @click="grabar"> Guardar cambios </button>
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
import Calendar from '../Calendar';
import Uploadfile from '../Uploadfile';

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
            loadingImg: false
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
            this.update(data).then(() => {
                this.pass.password = '';
                this.pass.password_confirmation = '';
                this.loading = false;
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
        Uploadfile
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
