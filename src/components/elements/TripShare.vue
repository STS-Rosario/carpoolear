<template>
    <div class="trip_share row">
        <a
            :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl"
            target="_blank"
            :aria-label="t('compartirEnFacebook')"
            class="lnk lnk-social-network lnk-facebook"
            @click="onShareLinkClick"
        >
            <i class="fa fa-facebook" aria-hidden="true"></i>
        </a>
        <a
            :href="
                'https://twitter.com/intent/tweet/?text=' + encodeURIComponent(t('publicarUnViajeCompartir')) + '&via=carpoolear&url=' +
                    currentUrl
            "
            target="_blank"
            :aria-label="t('compartirEnTwitter')"
            class="lnk lnk-social-network lnk-twitter"
            @click="onShareLinkClick"
        >
            <i class="fa fa-twitter" aria-hidden="true"></i>
        </a>
        <a
            :href="
                'whatsapp://send?text=' + encodeURIComponent(t('publicarUnViajeCompartir')) + '%20' +
                    currentUrl
            "
            target="_blank"
            :aria-label="t('compartirEnWhatsApp')"
            class="lnk lnk-social-network lnk-whatsapp"
            v-if="isMobile"
            @click="onWhatsAppShareClick"
        >
            <i class="fa fa-whatsapp" aria-hidden="true"></i>
        </a>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';

const { t } = useI18n();
const route = useRoute();
const tripsStore = useTripsStore();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const currentUrl = ref(encodeURIComponent(
    import.meta.env.VITE_WEB_URL + route.fullPath
));

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const isMobile = computed(() => deviceStore.isMobile);

const isPassengersView = computed(() => {
    return trip.value.is_passenger;
});

const publicarUnViajeCompartir = computed(() => {
    return t('publicarUnViajeCompartir');
});

function onShareLinkClick(event) {
    if (
        window.device &&
        window.device.platform &&
        window.device.platform.toLowerCase() !== 'browser'
    ) {
        // Estoy en movil
        event.preventDefault();
        let href = event.target.getAttribute('href');
        if (!href) {
            href = event.target.parentElement.getAttribute('href');
        }
        if (href) {
            window.location.href = href;
        }
    }
}

function onWhatsAppShareClick(event) {
    if (
        window.device &&
        window.device.platform &&
        window.device.platform.toLowerCase() !== 'browser'
    ) {
        // Estoy en movil
        event.preventDefault();
        if (
            window &&
            window.plugins &&
            window.plugins.socialsharing &&
            window.plugins.socialsharing.shareWithOptions
        ) {
            let message = t('publicarUnViajeCompartir');
            window.plugins.socialsharing.shareViaWhatsApp(
                message,
                null /* img */,
                decodeURIComponent(currentUrl.value),
                function () {
                    console.log('share ok');
                },
                function (errormsg) {
                    console.log('share not ok:', errormsg);
                }
            );
        }
    }
}
</script>
<style scoped></style>
