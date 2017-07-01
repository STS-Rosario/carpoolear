<template>
    <div class="reset-password-component" >
        <h1> Recuperar contraseña </h1>
        <div v-if="send">
            <h3> Se ha enviado un email a su casilla de correo con las indicaciones para restablecer su contraseña. </h3>
        </div>
        <div class='form' v-else-if="!token">
            <label for="txt_email">E-mail</label>
            <input type="text" id="txt_email" v-model='email'/>
            
            <button class="btn btn-primary" @click="reset"> Recuperar contraseña </button> 
            <span v-if="loading" class='loading'> Espere... </span>
            <span v-if="error"> {{error}} </span>
        </div>
        <div class='form' v-else-if="token">
            <div class='form'>
            <label for="txt_password">Password</label>
            <input  type="password" id="txt_password" v-model='password' />

            <label for="txt_password">Repetir Password </label>
            <input  type="password" id="txt_password" v-model='password_confirmation' />

            <button class="btn btn-primary" @click="change"> Cambiar contraseña </button> 
            <span v-if="loading" class='loading'> Espere... </span>
            <span v-if="error"> {{error}} </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'reset-password',
    props: {
        'token': {
            type: String,
            required: false
        }
    },

    data () {
        return {
            email: '',
            loading: false,
            error: null,
            send: false,
            password_confirmation: '',
            password: ''
        };
    },

    methods: {
        ...mapActions({
            'resetPassword': 'auth/resetPassword',
            'changePassword': 'auth/changePassword'
        }),

        reset () {
            this.loading = true;
            this.error = null;
            this.resetPassword(this.email).then(() => {
                this.loading = false;
                this.send = true;
            }, () => {
                this.loading = false;
                this.error = 'No se encuentra el e-mail en nuestra base de datos';
            });
        },

        change () {
            this.error = null;
            if (this.password === this.password_confirmation) {
                this.loading = true;
                let data = {};
                data.password = this.password;
                data.password_confirmation = this.password_confirmation;
                let token = this.token;
                this.changePassword({token, data}).then(() => {
                    // nothing
                }, () => {
                    this.loading = false;
                    this.error = 'Token invalido';
                });
            } else {
                this.error = 'No coicide los campos';
            }
        }
    },

    mounted () {

    }
};
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }
    h3 {
        margin-bottom: 2em;
        font-size: 18px;
    }
    .reset-password-component {
        padding-left: 10px;
        padding-right: 10px;
    }
    .form {
        margin-top:20px;
        border: 1px solid gray;
        padding: 2em;
        margin-bottom: 2rem;
    }
    label {
        display: block;
        margin-top: .3em;
        margin-bottom: .6em;
        font-weight: bold;
    }
    input {
        display:block;
        padding: 3px;
        margin-bottom: 0.8em;
        width: 100%;
    }
    loading {
        margin-left: 1em;
    }
</style>