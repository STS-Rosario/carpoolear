<template>
    <div class="trip_share row">
        <a
            :href="'https://www.facebook.com/sharer/sharer.php?u=' + currentUrl"
            target="_blank"
            :aria-label="$t('compartirEnFacebook')"
            class="lnk lnk-social-network lnk-facebook"
            @click="onShareLinkClick"
        >
            <i class="fa fa-facebook" aria-hidden="true"></i>
        </a>
        <a
            :href="
                'https://twitter.com/intent/tweet/?text=' + encodeURIComponent(this.$t('publicarUnViajeCompartir')) + '&via=carpoolear&url=' +
                    currentUrl
            "
            target="_blank"
            :aria-label="$t('compartirEnTwitter')"
            class="lnk lnk-social-network lnk-twitter"
            @click="onShareLinkClick"
        >
            <i class="fa fa-twitter" aria-hidden="true"></i>
        </a>
        <a
            :href="'https://plus.google.com/share?url=' + currentUrl"
            target="_blank"
            :aria-label="$t('compartirEnGooglePlus')"
            class="lnk lnk-social-network lnk-google-plus"
            @click="onShareLinkClick"
        >
            <i class="fa fa-google-plus" aria-hidden="true"></i>
        </a>
        <a
            :href="
                'whatsapp://send?text=' + encodeURIComponent(this.$t('publicarUnViajeCompartir')) + '%20' +
                    currentUrl
            "
            target="_blank"
            :aria-label="$t('compartirEnWhatsApp')"
            class="lnk lnk-social-network lnk-whatsapp"
            v-if="isMobile"
            @click="onWhatsAppShareClick"
        >
            <i class="fa fa-whatsapp" aria-hidden="true"></i>
        </a>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    name: 'TripDate',
    data() {
        return {
            currentUrl: encodeURIComponent(
                'https://carpoolear.com.ar/app' + this.$route.fullPath
            )
        };
    },
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        }),
        isPassengersView() {
            return this.trip.is_passenger;
        },
        publicarUnViajeCompartir() {
            return this.$t('publicarUnViajeCompartir');
        }
    },
    components: {},
    methods: {
        onShareLinkClick(event) {
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
        },
        onWhatsAppShareClick(event) {
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
                    let message = this.$t('publicarUnViajeCompartir');
                    window.plugins.socialsharing.shareViaWhatsApp(
                        message,
                        null /* img */,
                        decodeURIComponent(this.currentUrl),
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
    }
};
</script>
<style scoped></style>
