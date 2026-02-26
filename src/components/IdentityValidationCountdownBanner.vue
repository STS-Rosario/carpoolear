<template>
    <div
        v-if="visible"
        class="identity-validation-countdown-banner"
        @click="goToValidation"
    >
        <span class="banner-text">
            {{ bannerMessage }}
        </span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'IdentityValidationCountdownBanner',
    data() {
        return {
            now: Date.now(),
            ticker: null
        };
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            appConfig: 'auth/appConfig'
        }),
        visible() {
            if (!this.user) return false;
            const daysEnabled = this.appConfig && Number(this.appConfig.identity_validation_days_for_current_users) > 0;
            if (!daysEnabled) return false;
            if (this.user.identity_validated) return false;
            if (!this.user.validate_by_date) return false;
            return true;
        },
        deadlineEndOfDay() {
            if (!this.user || !this.user.validate_by_date) return null;
            const dateStr = this.user.validate_by_date;
            const [y, m, d] = dateStr.split('-').map(Number);
            const endOfDay = new Date(y, m - 1, d, 23, 59, 59, 999);
            return endOfDay.getTime();
        },
        countdownParts() {
            if (this.deadlineEndOfDay == null) return null;
            let diff = this.deadlineEndOfDay - this.now;
            if (diff < 0) diff = 0;
            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / 60000) % 60);
            const hours = Math.floor((diff / 3600000) % 24);
            const days = Math.floor(diff / 86400000);
            return { days, hours, minutes, seconds };
        },
        countdownString() {
            const p = this.countdownParts;
            if (!p) return '';
            return `${p.days} ${this.$t('validacionProntoBannerDias')} ${p.hours} ${this.$t('validacionProntoBannerHs')} ${p.minutes} ${this.$t('validacionProntoBannerMin')} ${p.seconds} ${this.$t('validacionProntoBannerS')}`;
        },
        isPastDeadline() {
            return this.deadlineEndOfDay != null && this.now >= this.deadlineEndOfDay;
        },
        bannerMessage() {
            if (this.isPastDeadline) {
                return this.$t('validacionProntoBannerTiempoCumplido');
            }
            return this.$t('validacionProntoBanner', { countdown: this.countdownString });
        }
    },
    mounted() {
        this.ticker = setInterval(() => {
            this.now = Date.now();
        }, 1000);
    },
    beforeDestroy() {
        if (this.ticker) clearInterval(this.ticker);
    },
    methods: {
        goToValidation() {
            this.$router.push({ name: 'identity_validation' });
        }
    }
};
</script>

<style scoped>
.identity-validation-countdown-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 10px 14px;
    background: #c00;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    z-index: 10000;
}
.identity-validation-countdown-banner:hover {
    background: #a00;
}
.banner-text {
    display: inline-block;
}
</style>
