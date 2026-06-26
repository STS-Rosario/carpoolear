<template>
    <div class="my-account">
        <h1 class="my-account__title">{{ $t('miCuenta') }}</h1>

        <div class="my-account__profile" v-if="user">
            <div
                class="circle-box my-account__avatar"
                v-imgSrc:profile="user.image"
            ></div>
            <div class="my-account__profile-info">
                <div class="my-account__name">{{ user.name }}</div>
                <router-link
                    class="my-account__public-profile"
                    :to="{ name: 'profile', params: { id: 'me' } }"
                >
                    {{ $t('verPerfilPublico') }}
                </router-link>
            </div>
        </div>

        <nav class="my-account__list" aria-label="my-account">
            <router-link
                v-for="item in menuItems"
                :key="item.id"
                class="my-account__item"
                :to="item.route"
            >
                <i :class="['fa', item.icon]" aria-hidden="true"></i>
                <span class="my-account__item-label">{{ $t(item.labelKey) }}</span>
                <i class="fa fa-chevron-right my-account__chevron" aria-hidden="true"></i>
            </router-link>
        </nav>

        <button
            type="button"
            class="my-account__logout"
            v-if="!isFacebokApp"
            @click="logout"
        >
            {{ $t('cerrarSesion') }}
        </button>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';

export default {
    name: 'myAccount',
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        }),
        identityValidationAvailable() {
            const c = this.config;
            return (
                c &&
                c.identity_validation_enabled === true &&
                (c.identity_validation_mercado_pago_enabled === true ||
                    c.identity_validation_manual_enabled === true)
            );
        },
        menuItems() {
            const items = [
                {
                    id: 'edit-profile',
                    labelKey: 'editarPerfilPublico',
                    icon: 'fa-user-circle-o',
                    route: { name: 'profile_update' }
                },
                {
                    id: 'cars',
                    labelKey: 'misAutos',
                    icon: 'fa-car',
                    route: { name: 'profile_cars' }
                },
                {
                    id: 'friends',
                    labelKey: 'misAmigos',
                    icon: 'fa-id-card-o',
                    route: { name: 'friends_setting' }
                }
            ];

            if (this.identityValidationAvailable) {
                items.push({
                    id: 'identity-validation',
                    labelKey: 'validarIdentidad',
                    icon: 'fa-shield',
                    route: { name: 'identity_validation' }
                });
            }

            items.push(
                {
                    id: 'notifications',
                    labelKey: 'configuracionNotificaciones',
                    icon: 'fa-bell-o',
                    route: { name: 'profile_update' }
                },
                {
                    id: 'privacy',
                    labelKey: 'configuracionPrivacidad',
                    icon: 'fa-user-secret',
                    route: { name: 'profile_update' }
                },
                {
                    id: 'password',
                    labelKey: 'cambiarPassword',
                    icon: 'fa-key',
                    route: { name: 'profile_update' }
                },
                {
                    id: 'delete-account',
                    labelKey: 'eliminarCuenta',
                    icon: 'fa-trash-o',
                    route: { name: 'profile_update' }
                }
            );

            return items;
        }
    },
    methods: {
        logout() {
            useAuthStore().logout();
        }
    }
};
</script>

<style scoped>
.my-account {
    max-width: 480px;
    margin: 0 auto;
    padding: 1rem 1rem calc(5.5rem + env(safe-area-inset-bottom));
    color: #333;
}
.my-account__title {
    margin: 0 0 1.25rem;
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    color: #333;
}
.my-account__profile {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
    width: 100%;
    text-align: left;
}
.my-account__avatar {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 50%;
    margin: 0;
}
.my-account__profile-info {
    min-width: 0;
}
.my-account__name {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #333;
}
.my-account__public-profile {
    display: inline-block;
    margin-top: 0.15rem;
    font-size: 0.95rem;
    color: #666;
    text-decoration: none;
}
.my-account__public-profile:hover,
.my-account__public-profile:focus {
    color: #333;
    text-decoration: underline;
}
.my-account__list {
    border-top: 1px solid #e8e8e8;
}
.my-account__item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.95rem 0;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
    text-decoration: none;
}
.my-account__item:hover,
.my-account__item:focus {
    color: #111;
    text-decoration: none;
}
.my-account__item > .fa:first-child {
    width: 22px;
    text-align: center;
    color: #666;
    font-size: 1.15rem;
    flex-shrink: 0;
}
.my-account__item-label {
    flex: 1;
    font-size: 1rem;
    line-height: 1.3;
}
.my-account__chevron {
    color: #bbb;
    font-size: 0.85rem;
    flex-shrink: 0;
}
.my-account__logout {
    margin-top: 1.5rem;
    width: 100%;
    border: 0;
    border-radius: 8px;
    background: #f0f0f0;
    color: #e53935;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.9rem 1rem;
}
@media only screen and (min-width: 768px) {
    .my-account {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
}
</style>
