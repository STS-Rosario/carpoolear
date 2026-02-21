<template>
    <tabset ref="tabs" :keytabset="'profile'" :rememberTab="isMyOwnProfile">
        <tab :header="viajesHeaderTitle">
            <component :is="currentView" :userId="id"></component>
        </tab>
        <tab :header="t('perfil')">
            <ProfileInfo></ProfileInfo>
        </tab>
        <tab :header="t('calificaciones')">
            <ProfileRates :id="id"></ProfileRates>
        </tab>
    </tabset>
</template>
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useActionbarsStore } from '@/stores/actionbars';
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import ProfileInfo from '../sections/ProfileInfo';
import ProfileRates from '../sections/ProfileRates';
import MyTrips from './MyTrips';
import ProfileTrip from '../sections/ProfileTrip';
import bus from '../../services/bus-event.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const actionbarsStore = useActionbarsStore();

const tabs = ref(null);

const props = defineProps({
    id: {
        required: false,
        default: 'me'
    },
    userProfile: {
        required: false
    },
    activeTab: {
        required: false
    }
});

const currentView = ref(null);

const user = computed(() => authStore.user);
const profile = computed(() => profileStore.user);

const viajesHeaderTitle = computed(() => {
    return props.id === 'me' || props.id === user.value.id
        ? t('misViajes')
        : t('viajes');
});

const isMyOwnProfile = computed(() => {
    return props.id === 'me' || props.id === user.value.id;
});

const updateProfile = () => {
    if (props.id === 'me' || props.id === user.value.id) {
        profileStore.setUser(user.value);
        profileStore.fetchBadges(user.value ? user.value.id : 'me');
        currentView.value = MyTrips;
    } else {
        if (props.userProfile) {
            actionbarsStore.setTitle(props.userProfile.name);
        }
        profileStore.setUserByID({
            id: props.id,
            userProfile: props.userProfile
        })
            .then(() => {
                actionbarsStore.setTitle(profile.value.name);
                profileStore.fetchBadges(props.id);
            })
            .catch(() => {
                router.replace({ name: 'trips' });
            });
        currentView.value = ProfileTrip;
    }
};

const onBackClick = () => {
    router.back();
};

watch(() => route.fullPath, () => {
    updateProfile();
});

onMounted(() => {
    let index = 1;
    if (
        router.currentRoute &&
        router.currentRoute.value &&
        router.currentRoute.value.hash
    ) {
        index = parseInt(router.currentRoute.value.hash.replace('#', ''), 10);
    }
    if (props.activeTab) {
        index = parseInt(props.activeTab, 10);
    } else if (tabs.value) {
        index = tabs.value.getRememberedTab(1);
    }
    if (tabs.value) {
        tabs.value.activateTab(index);
    }
    updateProfile();
    bus.on('back-click', onBackClick);
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});
</script>
