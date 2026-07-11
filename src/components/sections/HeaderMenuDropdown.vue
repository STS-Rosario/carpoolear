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
                :to="{ name: 'my-account' }"
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

export default {
    name: 'headerMenuDropdown',
    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        })
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
    min-width: 260px;
    padding: 0.5rem 0;
    font-size: 1rem;
    border-radius: 8px;
}
.header-menu-dropdown__user {
    padding: 0.35rem 0 0.15rem;
}
.header-menu-dropdown__user-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.35rem 1.1rem 0.5rem;
}
.header-menu-dropdown__avatar-wrap {
    position: relative;
    flex-shrink: 0;
}
.header-menu-dropdown__avatar {
    width: 40px;
    height: 40px;
    margin: 0;
}
.header-menu-dropdown__online {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4caf50;
    border: 2px solid #fff;
}
.header-menu-dropdown__user-info {
    min-width: 0;
}
.header-menu-dropdown__user-name {
    display: block;
    font-weight: 700;
    color: #333;
    line-height: 1.3;
}
.header-menu-dropdown__public-profile {
    display: inline-block;
    margin-top: 0.1rem;
    color: #00a3e0;
    font-size: 0.9rem;
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
