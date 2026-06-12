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
                <div class="radio">
                    <label class="radio-inline">
                        <input
                            type="radio"
                            name="donationValor"
                            id="donation50"
                            value="2000"
                            v-model="donateValue"
                        />
                        <span>$ 2000</span>
                    </label>
                    <label class="radio-inline">
                        <input
                            type="radio"
                            name="donationValor"
                            id="donation100"
                            value="5000"
                            v-model="donateValue"
                        />
                        <span>$ 5000</span>
                    </label>
                    <label class="radio-inline">
                        <input
                            type="radio"
                            name="donationValor"
                            id="donation200"
                            value="10000"
                            v-model="donateValue"
                        />
                        <span>$ 10000</span>
                    </label>
                    <label class="radio-inline">
                        <input
                            type="radio"
                            name="donationValor"
                            id="donation500"
                            value="10000"
                            v-model="donateValue"
                        />
                        <span>{{ $t('elegiPropiaAventura') }}</span>
                    </label>
                </div>
                <div>
                    <button
                        class="btn btn-success btn-unica-vez"
                        @click="onDonateOnceTime"
                    >
                        {{ $t('unicaVez') }}
                    </button>
                    <button
                        class="btn btn-info btn-mensualmente"
                        @click="onDonateMonthly"
                    >
                        {{ $t('MENSUAL') }}
                        <br />
                        {{ $t('cancelaCuando') }}
                    </button>
                </div>
                <div class="text-center">
                    <br />
                    <a
                        href="/donar"
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
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default {
    name: 'donation-after-rating',
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
            let url = 'https://carpoolear.com.ar/donar';
            if (this.user && this.user.id) {
                url = `${url}?u=${this.user.id}`;
            }
            await this.openExternalBrowser(url);
        },
        async onDonateOnceTime() {
            if (this.donateValue > 0) {
                var url = 'http://mpago.la/jgap';
                switch (this.donateValue) {
                    case '2000':
                        url = 'https://mpago.la/1WhaoLf';
                        break;
                    case '5000':
                        url = 'https://mpago.la/1SB6on8';
                        break;
                    case '10000':
                        url = 'https://mpago.la/2USgEBv';
                        break;
                    default:
                        break;
                }
                if (this.user && this.user.id) {
                    const separator = url.includes('?') ? '&' : '?';
                    url = `${url}${separator}u=${this.user.id}`;
                }
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
                var url = 'http://mpago.la/2XdoxpF';
                switch (this.donateValue) {
                    case '2000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848a2fd5c9018a33702cc50181';
                        break;
                    case '5000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848cee0ea5018d0e9ea71016d7';
                        break;
                    case '10000':
                        url = 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497030fc7019705478b370068';
                        break;
                    default:
                        break;
                }
                if (this.user && this.user.id) {
                    const separator = url.includes('?') ? '&' : '?';
                    url = `${url}${separator}u=${this.user.id}`;
                }
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

.donation-after-rating__skip {
    margin-top: 1.5rem;
}
</style>
