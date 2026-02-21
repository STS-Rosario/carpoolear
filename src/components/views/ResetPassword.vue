<template>
    <div class="user-form container">
        <router-link v-if="!isMobile" :to="{ name: 'trips' }">
            <img :src="carpoolear_logo" />
        </router-link>
        <h1 v-if="tripCardTheme !== 'light'">
            {{ t('recuperarContraseña') }}
        </h1>
        <div class="form row" v-if="send">
            <h3>
                {{ t('seHaEnviadoEmailIndicacionesRestablecerContrasena') }}
            </h3>
        </div>
        <div class="form row message" v-else-if="!token">
            <h1 v-if="tripCardTheme === 'light'">
                {{ t('recuperarContraseña') }}
            </h1>
            <label for="txt_email">{{ t('email') }}</label>
            <input v-jump type="text" id="txt_email" v-model="email" />
            <span class="error" v-if="error">{{ error }}</span>
            <button
                v-jump
                class="btn btn-primary btn-shadowed-black btn-outline"
                @click="reset"
                :disabled="loading"
            >
                <span v-if="!loading">{{ t('recuperarContraseña') }}</span>
                <spinner class="blue" v-if="loading"></spinner>
            </button>
        </div>
        <div class="form row" v-else-if="token">
            <label for="txt_password">{{ t('password') }}</label>
            <input
                v-jump
                type="password"
                id="txt_password"
                v-model="password"
            />
            <label for="txt_password">{{ t('repetirContrasena') }}</label>
            <input
                v-jump
                type="password"
                id="txt_password"
                v-model="password_confirmation"
            />
            <span class="error" v-if="error">{{ error }}</span>
            <button
                v-jump
                class="btn btn-primary"
                @click="change"
                :disabled="loading"
            >
                <span v-if="!loading">{{ t('cambiarPassword') }}</span>
                <spinner class="blue" v-if="loading"></spinner>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

let emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const props = defineProps({
    token: {
        type: String,
        required: false
    }
});

const email = ref('');
const loading = ref(false);
const error = ref(null);
const send = ref(false);
const password_confirmation = ref('');
const password = ref('');
const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';
const carpoolear_logo = ROUTE_BASE + 'static/img/carpoolear_logo.png';

const isMobile = computed(() => deviceStore.isMobile);
const settings = computed(() => authStore.appConfig);
const tripCardTheme = computed(() => {
    return settings.value ? settings.value.trip_card_design : '';
});

const reset = () => {
    error.value = null;
    if (emailRegex.test(email.value)) {
        loading.value = true;
        authStore.resetPassword(email.value).then(
            () => {
                loading.value = false;
                send.value = true;
            },
            () => {
                loading.value = false;
                error.value = t('emailIngresadoNoPerteneceUsuario');
            }
        );
    } else {
        error.value = t('ingreseEmailValido');
    }
};

const change = () => {
    error.value = null;
    if (password.value === password_confirmation.value) {
        loading.value = true;
        let data = {};
        data.password = password.value;
        data.password_confirmation = password_confirmation.value;
        let token = props.token;
        authStore.changePassword({ token, data }).then(
            () => {
                router.replace({ name: 'login' });
            },
            () => {
                loading.value = false;
                error.value = t('tokenInvalido');
            }
        );
    } else {
        error.value = t('noCoincidenCampos');
    }
};

const onBackClick = () => {
    router.back();
};

onMounted(() => {
    bus.on('back-click', onBackClick);
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});
</script>

<style>
.app-container {
    min-height: 100vh;
}
</style>

<style scoped>
h3 {
    margin-bottom: 2em;
    font-size: 18px;
}
label {
    display: block;
    margin-top: 0.3em;
    margin-bottom: 0.6em;
}
input {
    margin-bottom: 0.8em;
}
loading {
    margin-left: 1em;
}
.message > span {
    vertical-align: -0.6em;
    color: red;
    margin-left: 2em;
}
h3 {
    color: #fff;
}
@media only screen and (min-width: 768px) {
    h3 {
        color: #036686;
    }
}
</style>
