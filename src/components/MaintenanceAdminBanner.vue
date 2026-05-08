<template>
    <div class="maintenance-admin-banner" role="status">
        <span class="maintenance-admin-banner__text">
            Mantenimiento activo (modo flexible).
            <template v-if="formattedEnd">
                Fin previsto:
                <strong>{{ formattedEnd }}</strong>.
            </template>
            <template v-else> Sin fecha de fin indicada. </template>
        </span>
        <router-link
            class="maintenance-admin-banner__link"
            :to="{ name: 'admin-maintenance' }"
        >
            Ir a mantenimiento
        </router-link>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import dayjs from '../dayjs';

export default {
    name: 'maintenance-admin-banner',
    computed: {
        ...mapState(useAuthStore, ['appConfig']),
        maintenance() {
            return (this.appConfig && this.appConfig.maintenance) || {};
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
        }
    }
};
</script>

<style scoped>
.maintenance-admin-banner {
    position: sticky;
    top: 0;
    z-index: 9998;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 16px;
    padding: 10px 14px;
    background: #fff3cd;
    border-bottom: 1px solid #f0e1a6;
    color: #664d03;
    font-size: 14px;
}

.maintenance-admin-banner__link {
    font-weight: 600;
    white-space: nowrap;
}
</style>
