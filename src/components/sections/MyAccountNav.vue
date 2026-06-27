<template>
    <aside class="my-account-nav" aria-label="my-account">
        <div class="my-account-nav__profile" v-if="user">
            <router-link
                class="my-account-nav__profile-link"
                :to="{ name: 'profile', params: { id: 'me' } }"
            >
                <div
                    class="circle-box my-account-nav__avatar"
                    v-imgSrc:profile="user.image"
                ></div>
            </router-link>
            <div class="my-account-nav__profile-info">
                <router-link
                    class="my-account-nav__name"
                    :to="{ name: 'profile', params: { id: 'me' } }"
                >
                    {{ user.name }}
                </router-link>
                <router-link
                    class="my-account-nav__public-profile"
                    :to="{ name: 'profile', params: { id: 'me' } }"
                >
                    {{ $t('verPerfilPublico') }}
                </router-link>
            </div>
        </div>

        <nav class="my-account-nav__list">
            <router-link
                v-for="item in menuItems"
                :key="item.id"
                class="my-account-nav__item"
                :class="{ 'my-account-nav__item--active': isItemActive(item) }"
                :to="item.route"
            >
                <i :class="['fa', item.icon]" aria-hidden="true"></i>
                <span class="my-account-nav__item-label">{{
                    $t(item.labelKey)
                }}</span>
            </router-link>
            <button
                type="button"
                class="my-account-nav__item my-account-nav__item--logout"
                v-if="!isFacebokApp"
                @click="logout"
            >
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span class="my-account-nav__item-label">{{
                    $t('cerrarSesion')
                }}</span>
            </button>
        </nav>
    </aside>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import {
    getMyAccountMenuItems,
    isMyAccountMenuItemActive
} from '../../utils/myAccountMenuItems';

export default {
    name: 'myAccountNav',
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        }),
        menuItems() {
            return getMyAccountMenuItems(this.config);
        }
    },
    methods: {
        isItemActive(item) {
            return isMyAccountMenuItemActive(item, this.$route.name);
        },
        logout() {
            useAuthStore().logout();
        }
    }
};
</script>

<style scoped>
.my-account-nav {
    color: #333;
}
.my-account-nav__profile {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.85rem;
    margin-bottom: 1.5rem;
    width: 100%;
    text-align: left;
}
.my-account-nav__profile-link {
    flex-shrink: 0;
    text-decoration: none;
}
.my-account-nav__avatar {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    border-radius: 50%;
    margin: 0;
}
.my-account-nav__profile-info {
    min-width: 0;
}
.my-account-nav__name {
    display: block;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #333;
    text-decoration: none;
}
.my-account-nav__name:hover,
.my-account-nav__name:focus {
    color: #111;
    text-decoration: none;
}
.my-account-nav__public-profile {
    display: inline-block;
    margin-top: 0.15rem;
    font-size: 0.95rem;
    color: #666;
    text-decoration: none;
}
.my-account-nav__public-profile:hover,
.my-account-nav__public-profile:focus {
    color: #333;
    text-decoration: underline;
}
.my-account-nav__list {
    border-top: 1px solid #e8e8e8;
}
.my-account-nav__item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.95rem 0;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
    text-decoration: none;
}
.my-account-nav__item:hover,
.my-account-nav__item:focus {
    color: #111;
    text-decoration: none;
}
.my-account-nav__item--active {
    font-weight: 700;
    color: #111;
}
.my-account-nav__item > .fa:first-child {
    width: 22px;
    text-align: center;
    color: #666;
    font-size: 1.15rem;
    flex-shrink: 0;
}
.my-account-nav__item-label {
    flex: 1;
    font-size: 1rem;
    line-height: 1.3;
}
.my-account-nav__item--logout {
    width: 100%;
    border: 0;
    background: transparent;
    cursor: pointer;
    font: inherit;
    text-align: left;
    color: #e53935;
}
.my-account-nav__item--logout:hover,
.my-account-nav__item--logout:focus {
    color: #c62828;
}
.my-account-nav__item--logout > .fa:first-child {
    color: #e53935;
}
</style>
