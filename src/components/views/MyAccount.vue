<template>
    <div class="my-account">
        <h1 class="my-account__title">{{ $t('miCuenta') }}</h1>

        <div class="my-account__profile" v-if="user">
            <router-link
                class="my-account__profile-link"
                :to="{ name: 'profile', params: { id: 'me' } }"
            >
                <div
                    class="circle-box my-account__avatar"
                    v-imgSrc:profile="user.image"
                ></div>
            </router-link>
            <div class="my-account__profile-info">
                <router-link
                    class="my-account__name"
                    :to="{ name: 'profile', params: { id: 'me' } }"
                >
                    {{ user.name }}
                </router-link>
                <div class="my-account__stats">
                    <UserRatingsCounts
                        class="my-account__ratings"
                        :ratings="ratings"
                    />
                    <span
                        class="my-account__stats-separator"
                        v-if="showTripsStat"
                    ></span>
                    <span class="my-account__trips" v-if="showTripsStat">
                        {{ tripsCount }} {{ $t('viajes') }}
                    </span>
                </div>
                <router-link
                    class="my-account__public-profile"
                    :to="{ name: 'profile', params: { id: 'me' } }"
                >
                    {{ $t('verPerfilPublico') }}
                </router-link>
            </div>
        </div>

        <section
            class="my-account__section"
            v-for="section in mobileSections"
            :key="section.id"
        >
            <h2 class="my-account__section-title">{{ $t(section.labelKey) }}</h2>
            <nav class="my-account__list" :aria-label="section.id">
                <template v-for="item in section.items" :key="item.id">
                    <div
                        v-if="item.localeSwitcher"
                        class="my-account__item my-account__locale"
                    >
                        <i :class="['fa', item.icon]" aria-hidden="true"></i>
                        <span class="my-account__item-label">
                            <a
                                href="#"
                                :class="{ active: $i18n.locale === 'arg' }"
                                @click.prevent="setLocale('arg')"
                                >Español</a
                            >
                            <span class="my-account__locale-sep">·</span>
                            <a
                                href="#"
                                :class="{ active: $i18n.locale === 'en' }"
                                @click.prevent="setLocale('en')"
                                >English</a
                            >
                        </span>
                    </div>
                    <component
                        v-else
                        :is="itemTag(item)"
                        class="my-account__item"
                        :class="{
                            'my-account__item--external': item.href,
                            'my-account__item--placeholder': item.placeholder
                        }"
                        v-bind="itemProps(item)"
                    >
                        <i :class="['fa', item.icon]" aria-hidden="true"></i>
                        <span class="my-account__item-label">{{
                            $t(item.labelKey)
                        }}</span>
                        <span
                            class="my-account__item-value"
                            v-if="item.value"
                            >{{ item.value }}</span
                        >
                        <i
                            class="fa fa-chevron-right my-account__chevron"
                            aria-hidden="true"
                        ></i>
                    </component>
                </template>
            </nav>
        </section>

        <AppButton
            class="my-account__logout"
            variant="secondary"
            icon-left="fa fa-sign-out"
            v-if="!isFacebokApp"
            @click="logout"
        >
            {{ $t('cerrarSesion') }}
        </AppButton>

        <router-link
            class="my-account__delete"
            :to="deleteAccountRoute"
            v-if="!isFacebokApp"
        >
            <i class="fa fa-trash-o" aria-hidden="true"></i>
            {{ $t('eliminarCuenta') }}
        </router-link>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { userRatingsFromProfile } from '../../utils/tripRating';
import { normalizeTripsCount } from '../../utils/profileMemberStats';
import {
    getMyAccountMobileSections,
    MOBILE_DELETE_ACCOUNT_ROUTE
} from '../../utils/myAccountMobileSections';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend
} from '../../utils/userLocale.js';
import UserRatingsCounts from '../elements/UserRatingsCounts.vue';
import AppButton from '../ui/AppButton.vue';

const userApi = new UserApi();

export default {
    name: 'myAccount',
    components: {
        UserRatingsCounts,
        AppButton
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig',
            logged: 'checkLogin'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        }),
        mobileSections() {
            return getMyAccountMobileSections(this.config);
        },
        ratings() {
            return userRatingsFromProfile(this.user);
        },
        tripsCount() {
            return normalizeTripsCount(this.user && this.user.trips_count);
        },
        showTripsStat() {
            return Boolean(this.user && this.user.trips_count != null);
        },
        deleteAccountRoute() {
            return MOBILE_DELETE_ACCOUNT_ROUTE;
        }
    },
    methods: {
        logout() {
            useAuthStore().logout();
        },
        setLocale(locale) {
            this.$root.$i18n.locale = locale;
            persistLocaleChoice(locale);
            syncLocaleToBackend(userApi, locale, this.logged).catch(() => {});
        },
        itemTag(item) {
            if (item.href) {
                return 'a';
            }
            if (item.route) {
                return 'router-link';
            }
            return 'span';
        },
        itemProps(item) {
            if (item.href) {
                return { href: item.href, target: '_blank', rel: 'noopener' };
            }
            if (item.route) {
                return { to: item.route };
            }
            return { 'aria-disabled': 'true' };
        }
    }
};
</script>

<style scoped>
.my-account {
    max-width: 480px;
    margin: 0 auto;
    padding: 1rem 1rem calc(7rem + env(safe-area-inset-bottom));
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
.my-account__profile-link {
    flex-shrink: 0;
    text-decoration: none;
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
    display: block;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #333;
    text-decoration: none;
}
.my-account__name:hover,
.my-account__name:focus {
    color: #111;
    text-decoration: none;
}
.my-account__stats {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.2rem;
    font-size: 0.85rem;
    color: #666;
}
.my-account__ratings {
    font-size: 0.85rem;
}
.my-account__stats-separator {
    width: 1px;
    height: 0.9rem;
    background: #d8d8d8;
}
.my-account__trips {
    color: #666;
}
.my-account__public-profile {
    display: inline-block;
    margin-top: 0.25rem;
    font-size: 0.95rem;
    color: #00a3e0;
    text-decoration: none;
}
.my-account__public-profile:hover,
.my-account__public-profile:focus {
    text-decoration: underline;
}
.my-account__section {
    margin-bottom: 0.5rem;
}
.my-account__section-title {
    margin: 1.25rem 0 0.25rem;
    padding: 0;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #888;
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
    font-size: 1.05rem;
    flex-shrink: 0;
}
.my-account__item-label {
    flex: 1;
    font-size: 1rem;
    line-height: 1.3;
}
.my-account__item-value {
    color: #999;
    font-size: 0.9rem;
    margin-right: 0.25rem;
}
.my-account__chevron {
    color: #c4c4c4;
    font-size: 0.85rem;
    flex-shrink: 0;
}
.my-account__item--placeholder {
    color: #999;
}
.my-account__item--placeholder > .fa:first-child {
    color: #aaa;
}
.my-account__locale a {
    color: #666;
    text-decoration: none;
}
.my-account__locale a.active {
    color: #333;
    font-weight: 700;
}
.my-account__locale-sep {
    margin: 0 0.35rem;
    color: #999;
}
.my-account__logout {
    display: flex;
    margin: 1.75rem auto 0;
    width: 100%;
    max-width: 260px;
}
.my-account__delete {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    margin-top: 2.5rem;
    color: #e53935;
    font-size: 0.9rem;
    text-decoration: none;
}
.my-account__delete:hover,
.my-account__delete:focus {
    text-decoration: underline;
}
@media only screen and (min-width: 768px) {
    .my-account {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
}
</style>
