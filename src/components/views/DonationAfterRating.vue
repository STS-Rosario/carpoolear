<template>
    <div class="donation-after-rating container">
        <div class="col-xs-24">
            <h3 class="donation-after-rating__header">
                <span>{{ $t('donaACarpoolear') }}</span>
                <br class="hidden-sm hidden-md hidden-lg" />
                <small>{{ $t('proyectoDe') }}</small>
                <img
                    width="90"
                    alt="STS Rosario"
                    :src="$publicImg('logo_sts_nuevo_color.png')"
                />
            </h3>
            <div class="donation">
                <div class="text-center donation-text">
                    <p>
                        {{ $t('buenisimoCompartirViaje') }}
                    </p>
                    {{ $t('ayudanosPlataforma') }}
                </div>
                <DonationAmountPicker v-model="donateValue" />
                <div class="donation-actions">
                    <AppButton
                        class="donation-actions__btn"
                        variant="primary"
                        @click="onDonateMonthly"
                    >
                        <span class="donation-actions__label">
                            {{ $t('MENSUAL') }}
                        </span>
                        <span class="donation-actions__hint">
                            ({{ $t('cancelaCuando') }})
                        </span>
                    </AppButton>
                    <AppButton
                        class="donation-actions__btn"
                        variant="secondary"
                        @click="onDonateOnceTime"
                    >
                        {{ $t('unicaVez') }}
                    </AppButton>
                </div>
                <div class="text-center">
                    <br />
                    <a
                        href="/aportar"
                        target="_blank"
                        v-on:click.prevent="openDonationLink()"
                    >
                        {{ $t('conoceMasDonar') }}
                    </a>
                </div>
                <div class="text-center donation-after-rating__skip">
                    <button
                        class="btn btn-default"
                        @click="onContinueWithoutDonating"
                    >
                        {{ $t('continuarSinDonar') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useProfileStore } from '../../stores/profile';
import dialogs from '../../services/dialogs.js';
import DonationAmountPicker from '../elements/DonationAmountPicker.vue';
import AppButton from '../ui/AppButton.vue';
import {
    appendDonationTrackingUserId,
    getDonationMonthlyUrl,
    getDonationOnceUrl
} from '../../utils/donationOptions.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default {
    name: 'donation-after-rating',
    components: {
        DonationAmountPicker,
        AppButton
    },
    props: {
        tripId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            donateValue: 0
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        })
    },
    methods: {
        ...mapActions(useProfileStore, {
            registerDonation: 'registerDonation'
        }),
        async openExternalBrowser(url) {
            if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
                try {
                    await App.openUrl({ url });
                } catch (error) {
                    console.error('Error opening URL in external browser:', error);
                    window.open(url, '_blank');
                }
            } else {
                window.open(url, '_blank');
            }
        },
        async openDonationLink() {
            let url = 'https://carpoolear.com.ar/aportar';
            if (this.user && this.user.id) {
                url = `${url}?u=${this.user.id}`;
            }
            await this.openExternalBrowser(url);
        },
        async onDonateOnceTime() {
            if (this.donateValue > 0) {
                let url = getDonationOnceUrl(this.donateValue);
                url = appendDonationTrackingUserId(url, this.user && this.user.id);
                await this.openExternalBrowser(url);
                await this.registerDonation({
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.tripId
                });
                this.$router.push({ name: 'trips' });
            } else {
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        async onDonateMonthly() {
            if (this.donateValue > 0) {
                let url = getDonationMonthlyUrl(this.donateValue);
                url = appendDonationTrackingUserId(url, this.user && this.user.id);
                await this.openExternalBrowser(url);
                await this.registerDonation({
                    has_donated: 1,
                    has_denied: 0,
                    ammount: parseFloat(this.donateValue),
                    trip_id: this.tripId
                });
                this.$router.push({ name: 'trips' });
            } else {
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        async onContinueWithoutDonating() {
            await this.registerDonation({
                has_donated: 0,
                has_denied: 1,
                ammount: 0,
                trip_id: this.tripId
            });
            this.$router.push({ name: 'trips' });
        }
    }
};
</script>

<style scoped>
.donation-after-rating__header {
    text-align: center;
    margin-bottom: 1.5rem;
}

.donation-text {
    margin-bottom: 1.5rem;
}

.donation-text p {
    margin-top: 0;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.donation-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.donation-actions__btn {
    width: 100%;
    min-height: 4.5rem;
    flex-direction: column;
    gap: 0.25rem;
    white-space: normal;
    text-align: center;
}

.donation-actions__btn.app-button--secondary {
    min-height: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
}

.donation-actions__btn :deep(.app-button__label) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    line-height: 1.25;
}

.donation-actions__label {
    display: block;
}

.donation-actions__hint {
    display: block;
    font-size: 0.85em;
    font-weight: var(--ds-font-weight-normal, 400);
    line-height: 1.2;
}

@media (min-width: 768px) {
    .donation-actions {
        flex-direction: row;
    }

    .donation-actions__btn {
        flex: 1 1 0;
        width: auto;
    }
}

/* Clear fixed .actionbar-bottom (52px + safe area) on mobile */
.donation-after-rating__skip {
    margin-top: 1.5rem;
    margin-bottom: calc(52px + constant(safe-area-inset-bottom, 0px));
    margin-bottom: calc(52px + env(safe-area-inset-bottom, 0px));
}
</style>
