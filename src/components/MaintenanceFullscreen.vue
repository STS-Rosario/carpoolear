<template>
    <div class="maintenance-fullscreen">
        <div class="maintenance-fullscreen__inner">
            <h1 class="maintenance-fullscreen__title">
                Carpoolear está en mantenimiento
            </h1>
            <p class="maintenance-fullscreen__lead">
                Te pedimos disculpas pero Carpoolear se encuentra en mantenimiento.
            </p>
            <p v-if="description" class="maintenance-fullscreen__detail">
                {{ description }}
            </p>
            <p v-if="formattedEnd" class="maintenance-fullscreen__end">
                Finalización prevista:
                <strong>{{ formattedEnd }}</strong>
            </p>
            <p class="maintenance-fullscreen__login">
                <router-link :to="{ name: 'login' }">Iniciar sesión</router-link>
                <span v-if="modeLabel"> · {{ modeLabel }}</span>
            </p>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import dayjs from '../dayjs';

export default {
    name: 'maintenance-fullscreen',
    computed: {
        ...mapState(useAuthStore, ['appConfig']),
        maintenance() {
            return (this.appConfig && this.appConfig.maintenance) || {};
        },
        description() {
            return this.maintenance.message || '';
        },
        formattedEnd() {
            const iso = this.maintenance.ends_at;
            if (!iso) {
                return '';
            }
            return dayjs
                .utc(iso)
                .tz('America/Argentina/Buenos_Aires')
                .format('dddd D [de] MMMM YYYY HH:mm');
        },
        modeLabel() {
            const m = this.maintenance.mode;
            if (m === 'strict') {
                return 'Modo estricto';
            }
            if (m === 'flexible') {
                return 'Modo solo administradores';
            }
            return '';
        }
    }
};
</script>

<style scoped>
.maintenance-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 10002;
    overflow: auto;
    background: #f4f6f8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
}

.maintenance-fullscreen__inner {
    max-width: 36rem;
}

.maintenance-fullscreen__title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: #1a2b3c;
}

.maintenance-fullscreen__lead {
    font-size: 1.05rem;
    margin: 0 0 1rem;
    color: #333;
}

.maintenance-fullscreen__detail {
    white-space: pre-wrap;
    margin: 0 0 1rem;
    color: #444;
    line-height: 1.5;
}

.maintenance-fullscreen__end {
    margin: 0 0 1.25rem;
    color: #333;
}

.maintenance-fullscreen__login {
    margin: 0;
    font-size: 0.95rem;
}

.maintenance-fullscreen__login a {
    font-weight: 600;
}
</style>
