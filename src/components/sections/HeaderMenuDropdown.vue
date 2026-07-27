<template>
    <dropdown type="icon" class="header-menu-dropdown" v-if="user">
        <template #button>
            <span class="header-menu-dropdown__profile">
                <span
                    class="circle-box header_profile_image"
                    v-imgSrc:profile="user.image"
                ></span>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </span>
        </template>
        <li class="header-menu-dropdown__user">
            <div class="header-menu-dropdown__user-row">
                <span class="header-menu-dropdown__avatar-wrap">
                    <span
                        class="circle-box header_profile_image header-menu-dropdown__avatar"
                        v-imgSrc:profile="user.image"
                    ></span>
                    <span
                        class="header-menu-dropdown__online"
                        aria-hidden="true"
                    ></span>
                </span>
                <div class="header-menu-dropdown__user-info">
                    <span class="header-menu-dropdown__user-name">{{
                        user.name
                    }}</span>
                    <router-link
                        class="header-menu-dropdown__public-profile"
                        :to="{ name: 'profile', params: { id: 'me' } }"
                    >
                        {{ $t('verPerfilPublico') }}
                    </router-link>
                </div>
            </div>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="desktopDefaultAccountRoute"
            >
                <i class="fa fa-user" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('miCuenta')
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'profile_update' }"
            >
                <i class="fa fa-cog" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('configuracion')
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'tickets' }"
            >
                <i class="fa fa-headphones" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('ayuda')
                }}</span>
            </router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li v-if="!isFacebokApp">
            <a
                class="header-menu-dropdown__item header-menu-dropdown__item--logout"
                @click="logout"
            >
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('cerrarSesion')
                }}</span>
            </a>
        </li>
    </dropdown>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import dropdown from '../Dropdown';
import { DESKTOP_DEFAULT_ACCOUNT_ROUTE } from '../../utils/myAccountDesktopSections';

export default {
    name: 'headerMenuDropdown',
    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        }),
        desktopDefaultAccountRoute() {
            return DESKTOP_DEFAULT_ACCOUNT_ROUTE;
        }
    },
    methods: {
        logout() {
            useAuthStore().logout();
        }
    },
    components: {
        dropdown
    }
};
</script>

<style scoped>
.header-menu-dropdown {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.5rem;
}
.header-menu-dropdown__profile {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    vertical-align: middle;
}
.header-menu-dropdown__profile .header_profile_image {
    margin: 0;
}
.header-menu-dropdown__profile > .fa {
    color: #fff;
    font-size: 0.75rem;
}
.header-menu-dropdown :deep(.btn-icon),
.header-menu-dropdown :deep(.btn-group.open .btn-icon),
.header-menu-dropdown :deep(.btn-icon:hover),
.header-menu-dropdown :deep(.btn-icon:focus),
.header-menu-dropdown :deep(.btn-icon:active) {
    color: #fff;
    background-color: transparent;
    box-shadow: none;
}
.header-menu-dropdown :deep(.btn-group.open .dropdown-toggle) {
    box-shadow: none;
}
.header-menu-dropdown :deep(.dropdown-menu) {
    right: 0;
    left: auto;
    min-width: 280px;
    padding: 0;
    font-size: 1rem;
    border-radius: 8px;
    overflow: visible;
}
.header-menu-dropdown__user {
    padding: 0;
    overflow: visible;
}
.header-menu-dropdown__user-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 1.1rem 1.25rem 0.95rem;
}
.header-menu-dropdown__avatar-wrap {
    position: relative;
    flex-shrink: 0;
    overflow: visible;
    line-height: 0;
    width: 48px;
    height: 48px;
}
.header-menu-dropdown__avatar {
    width: 48px !important;
    height: 48px !important;
    max-width: 48px;
    max-height: 48px;
    margin: 0;
    display: block;
}
.header-menu-dropdown__online {
    position: absolute;
    right: -2px;
    bottom: -1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #4caf50;
    border: 2px solid #fff;
    box-sizing: border-box;
    z-index: 1;
}
.header-menu-dropdown__user-info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.15rem;
}
.header-menu-dropdown__user-name {
    display: block;
    font-weight: 700;
    font-size: 1rem;
    color: #333;
    line-height: 1.25;
}
.header-menu-dropdown__public-profile {
    display: inline-block;
    margin-top: 0;
    color: #00a3e0;
    font-size: 0.9rem;
    line-height: 1.3;
    text-decoration: none;
}
.header-menu-dropdown__public-profile:hover,
.header-menu-dropdown__public-profile:focus {
    text-decoration: underline;
}
.header-menu-dropdown :deep(.dropdown-menu > li > a.header-menu-dropdown__item) {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 1rem;
    padding: 0.7rem 1.1rem;
    color: #333;
}
.header-menu-dropdown
    :deep(.dropdown-menu > li > a.header-menu-dropdown__item > .fa) {
    width: 18px;
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.header-menu-dropdown__item-label {
    flex: 1;
}
.header-menu-dropdown
    :deep(
        .dropdown-menu
            > li
            > a.header-menu-dropdown__item--logout
    ),
.header-menu-dropdown
    :deep(
        .dropdown-menu
            > li
            > a.header-menu-dropdown__item--logout
            > .fa
    ) {
    color: #e53935;
}
</style>
