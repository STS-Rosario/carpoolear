<template>
    <div class="donation-after-rating">
        <div class="donation-after-rating__page">
            <DonationAfterRatingHero />
            <section class="donation-after-rating__cta">
            <h2 class="donation-after-rating__cta-title">
                <span>{{ $t('donationAfterRatingJoinPrefix') }}</span>
                <span class="donation-after-rating__cta-title-accent">
                    {{ $t('donationAfterRatingJoinAccent') }}
                </span>
            </h2>
            <p
                class="donation-after-rating__cta-intro"
                v-html="$t('donationAfterRatingMonthlyBenefitsIntro')"
            ></p>
            <ul class="donation-after-rating__benefits">
                <li
                    v-for="benefitKey in benefitKeys"
                    :key="benefitKey"
                    class="donation-after-rating__benefits-item"
                >
                    <strong>{{ $t(`${benefitKey}Title`) }}</strong>
                    {{ $t(`${benefitKey}Text`) }}
                </li>
            </ul>
        </section>
        <div class="donation-after-rating__content container">
            <div class="col-xs-24">
                <div class="donation donation-after-rating__donation">
                    <DonationAmountPicker
                        v-model="donateValue"
                        usage-note-key="donationAfterRatingMonthlyAmountIntro"
                        :usage-note-html="true"
                        :body-text-tone="true"
                        radio-group-name="donationAfterRatingMonthly"
                    />
                    <AppButton
                        class="donation-after-rating__btn-monthly"
                        variant="header-donate"
                        @click="onDonateMonthly"
                    >
                        <span class="donation-after-rating__btn-label">
                            {{ $t('donationAfterRatingJoinCommunityMonthly') }}
                        </span>
                        <span class="donation-after-rating__btn-hint">
                            ({{ $t('donationAfterRatingJoinCommunityMonthlyHint') }})
                        </span>
                    </AppButton>

                    <section class="donation-after-rating__once">
                        <p
                            class="donation-after-rating__once-intro"
                            v-html="$t('donationAfterRatingOnceIntro')"
                        ></p>
                        <DonationAmountPicker
                            v-model="donateValue"
                            :show-usage-note="false"
                            :body-text-tone="true"
                            radio-group-name="donationAfterRatingOnce"
                        />
                        <AppButton
                            class="donation-after-rating__btn-once"
                            variant="secondary"
                            @click="onDonateOnceTime"
                        >
                            {{ $t('donationAfterRatingOnceCta') }}
                        </AppButton>
                        <AppButton
                            v-if="qrEnabled"
                            class="donation-after-rating__btn-qr"
                            variant="secondary"
                            :loading="loadingQr"
                            :disabled="loadingQr"
                            @click="onDonateOnceQr"
                        >
                            {{ $t('pagarConQR') }}
                        </AppButton>
                        <ManualValidationQrPaymentHelp
                            v-if="qrEnabled"
                            computer-suffix-key="comoHacerPagoQRComputadoraSuffixAportar"
                        />
                        <div
                            v-if="showQrPanel"
                            class="qr-payment-panel panel panel-default"
                        >
                            <div class="panel-body text-center">
                                <p class="qr-instruction">
                                    {{ $t('escaneáConAppMercadoPago') }}
                                </p>
                                <div v-if="qrImageUrl" class="qr-image-wrap">
                                    <img
                                        :src="qrImageUrl"
                                        alt="QR"
                                        class="qr-image"
                                    />
                                </div>
                                <p v-else class="qr-loading">
                                    {{ $t('cargando') }}...
                                </p>
                                <p class="qr-expiry small">
                                    {{ $t('qrExpiraEn') }}
                                </p>
                                <ManualValidationQrPaymentHelp
                                    computer-suffix-key="comoHacerPagoQRComputadoraSuffixAportar"
                                />
                                <AppButton
                                    variant="tertiary"
                                    size="sm"
                                    @click="closeQrPanel"
                                >
                                    {{ $t('cerrar') }}
                                </AppButton>
                            </div>
                        </div>
                    </section>

                    <section class="donation-after-rating__alternatives">
                        <i18n-t
                            keypath="donationAfterRatingVolunteerParagraph"
                            tag="p"
                            class="donation-after-rating__alt-copy"
                        >
                            <template #link>
                                <strong><a
                                    :href="externalHref(collaborateUrl)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    @click.prevent="openExternalLink(collaborateUrl)"
                                >{{ $t('donationAfterRatingVolunteerLink') }}</a></strong>
                            </template>
                        </i18n-t>
                        <div class="donation-after-rating__word-of-mouth-block">
                            <p class="donation-after-rating__alt-copy">
                                {{ $t('donationAfterRatingWordOfMouthIntro') }}
                            </p>
                            <ul class="donation-after-rating__word-of-mouth">
                        <i18n-t
                            keypath="donationAfterRatingInstagramParagraph"
                            tag="li"
                            class="donation-after-rating__alt-copy"
                        >
                            <template #instagram>
                                <strong><a
                                    :href="externalHref(instagramUrl)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    @click.prevent="openExternalLink(instagramUrl)"
                                >{{ $t('donationAfterRatingInstagramLink') }}</a></strong>
                            </template>
                            <template #facebook>
                                <strong><a
                                    :href="externalHref(facebookUrl)"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    @click.prevent="openExternalLink(facebookUrl)"
                                >{{ $t('donationAfterRatingFacebookLink') }}</a></strong>
                            </template>
                        </i18n-t>
                                <li class="donation-after-rating__alt-copy">
                                    {{ $t('donationAfterRatingWordOfMouthFaceToFace') }}
                                </li>
                            </ul>
                        </div>
                        <AppButton
                            v-if="tripId"
                            class="donation-after-rating__btn-skip"
                            variant="secondary"
                            @click="onContinueWithoutDonating"
                        >
                            {{ $t('donationAfterRatingContinueWithoutContributing') }}
                        </AppButton>
                        <div class="donation-after-rating__sign-off">
                            <p class="donation-after-rating__alt-copy">
                                {{ $t('donationAfterRatingSignOffGreeting') }}
                            </p>
                            <i18n-t
                                keypath="donationAfterRatingSignOffTeam"
                                tag="p"
                                class="donation-after-rating__alt-copy"
                            >
                                <template #team>
                                    <strong>{{
                                        $t('donationAfterRatingSignOffTeamName')
                                    }}</strong>
                                </template>
                            </i18n-t>
                        </div>
                    </section>
                </div>
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
import QRCode from 'qrcode';
import DonationAmountPicker from '../elements/DonationAmountPicker.vue';
import DonationAfterRatingHero from '../sections/DonationAfterRatingHero.vue';
import ManualValidationQrPaymentHelp from '../sections/ManualValidationQrPaymentHelp.vue';
import AppButton from '../ui/AppButton.vue';
import {
    isPlatformDonationsQrEnabled,
    startDonationCheckout,
    startDonationQrCheckout
} from '../../utils/donationCheckout.js';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from '../../utils/donationAfterRatingBenefits.js';
import {
    CARPOOLEAR_COLLABORATE_URL,
    CARPOOLEAR_FACEBOOK_PROFILE_URL,
    CARPOOLEAR_INSTAGRAM_PROFILE_URL
} from '../../utils/carpoolearSocialUrls.js';
import {
    openExternalUrl,
    resolveExternalUrl
} from '../../utils/externalLink.js';

export default {
    name: 'donation-after-rating',
    components: {
        DonationAmountPicker,
        DonationAfterRatingHero,
        ManualValidationQrPaymentHelp,
        AppButton
    },
    props: {
        /** Set on the after-rating flow; absent on the trip-independent /donate page. */
        tripId: {
            type: [String, Number],
            default: null
        },
        preview: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            donateValue: 0,
            benefitKeys: DONATION_AFTER_RATING_BENEFIT_KEYS,
            collaborateUrl: CARPOOLEAR_COLLABORATE_URL,
            instagramUrl: CARPOOLEAR_INSTAGRAM_PROFILE_URL,
            facebookUrl: CARPOOLEAR_FACEBOOK_PROFILE_URL,
            loadingQr: false,
            showQrPanel: false,
            qrImageUrl: null
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            appConfig: 'appConfig'
        }),
        checkoutSource() {
            return this.tripId ? 'after_rating' : 'donate_page';
        },
        qrEnabled() {
            return isPlatformDonationsQrEnabled(this.appConfig);
        }
    },
    methods: {
        ...mapActions(useProfileStore, {
            registerDonation: 'registerDonation'
        }),
        externalHref(url) {
            return resolveExternalUrl(url);
        },
        openExternalLink(url) {
            openExternalUrl(url);
        },
        notifyPreviewMode() {
            dialogs.message('Preview mode: donation actions are disabled.', {
                duration: 4,
                estado: 'info'
            });
        },
        async onDonateOnceTime() {
            if (this.preview) {
                this.notifyPreviewMode();
                return;
            }
            if (this.donateValue > 0) {
                try {
                    const url = await startDonationCheckout({
                        type: 'once',
                        amount: this.donateValue,
                        source: this.checkoutSource,
                        tripId: this.tripId,
                        userId: this.user && this.user.id,
                        appConfig: this.appConfig
                    });
                    openExternalUrl(url);
                } catch (error) {
                    console.error('Donation checkout failed:', error);
                    dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                        duration: 10,
                        estado: 'error'
                    });
                    return;
                }
                this.$router.push({ name: 'trips' });
            } else {
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        async onDonateOnceQr() {
            if (this.preview) {
                this.notifyPreviewMode();
                return;
            }
            if (this.donateValue <= 0) {
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
                return;
            }
            this.loadingQr = true;
            try {
                const result = await startDonationQrCheckout({
                    amount: this.donateValue,
                    source: this.checkoutSource,
                    tripId: this.tripId,
                    userId: this.user && this.user.id,
                    appConfig: this.appConfig
                });
                const qrData = result?.qr_data ?? result?.data?.qr_data;
                if (qrData) {
                    this.showQrPanel = true;
                    this.qrImageUrl = null;
                    QRCode.toDataURL(qrData, { width: 256, margin: 2 }, (err, url) => {
                        if (!err) {
                            this.qrImageUrl = url;
                        }
                    });
                }
            } catch (error) {
                console.error('Donation QR checkout failed:', error);
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            } finally {
                this.loadingQr = false;
            }
        },
        closeQrPanel() {
            this.showQrPanel = false;
            this.qrImageUrl = null;
        },
        async onDonateMonthly() {
            if (this.preview) {
                this.notifyPreviewMode();
                return;
            }
            if (this.donateValue > 0) {
                try {
                    const url = await startDonationCheckout({
                        type: 'monthly',
                        amount: this.donateValue,
                        source: this.checkoutSource,
                        tripId: this.tripId,
                        userId: this.user && this.user.id,
                        appConfig: this.appConfig
                    });
                    openExternalUrl(url);
                } catch (error) {
                    console.error('Donation checkout failed:', error);
                    dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                        duration: 10,
                        estado: 'error'
                    });
                    return;
                }
                this.$router.push({ name: 'trips' });
            } else {
                dialogs.message(this.$t('tienesQueSeleccionarDonacion'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        async onContinueWithoutDonating() {
            if (this.preview) {
                this.notifyPreviewMode();
                return;
            }
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
.donation-after-rating__page {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.donation-after-rating__cta {
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
    padding: 0 1rem 2rem;
    text-align: center;
}

.donation-after-rating__cta-title {
    margin: 0 0 1rem;
    font-family: 'Dela Gothic One', var(--ds-font-family);
    font-size: clamp(1.75rem, 8vw, 3rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--ds-text-secondary);
    text-transform: uppercase;
}

.donation-after-rating__cta-title-accent {
    display: block;
    color: var(--ds-header-donate-bg);
}

.donation-after-rating__cta-intro {
    margin: 0 auto;
    color: var(--ds-text-primary);
    font-size: 1.2rem;
    line-height: 1.45;
}

.donation-after-rating__benefits {
    margin: 1.25rem auto 0;
    padding: 0;
    padding-inline-start: 2rem;
    max-width: 42rem;
    list-style: disc;
    list-style-position: outside;
    text-align: left;
}

.donation-after-rating__benefits-item {
    margin: 0 0 0.75rem;
    padding-left: 0.5rem;
    color: var(--ds-text-primary);
    font-size: 1.05rem;
    line-height: 1.45;
}

.donation-after-rating__benefits-item:last-child {
    margin-bottom: 0;
}

@media (max-width: 767px) {
    .donation-after-rating__benefits {
        margin-left: 0;
        margin-right: 0;
        padding-inline-start: 1.75rem;
        padding-inline-end: 0.25rem;
        list-style-position: inside;
    }

    .donation-after-rating__benefits-item {
        padding-left: 0;
    }
}

.donation-after-rating__donation {
    max-width: 42rem;
    margin: 0 auto;
    padding: 0 1rem 2rem;
    text-align: center;
}

.donation-after-rating__btn-monthly,
.donation-after-rating__btn-once,
.donation-after-rating__btn-qr {
    width: fit-content;
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
}

.donation-after-rating__btn-monthly {
    margin-top: 1rem;
}

.donation-after-rating__btn-monthly :deep(.app-button__label) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    line-height: 1.25;
    white-space: normal;
}

.donation-after-rating__btn-label {
    display: block;
}

.donation-after-rating__btn-hint {
    display: block;
    font-size: 0.85em;
    font-weight: var(--ds-font-weight-normal, 400);
    line-height: 1.2;
}

.donation-after-rating__once {
    margin-top: 9rem;
    text-align: center;
}

.donation-after-rating__once-intro {
    margin: 0 0 1rem;
    color: var(--ds-text-primary);
    font-size: 1.05rem;
    line-height: 1.45;
}

.donation-after-rating__once :deep(.donation-amount-picker) {
    margin-bottom: 1rem;
}

.donation-after-rating__btn-once {
    margin-top: 0;
}

.donation-after-rating__btn-qr {
    margin-top: 0.75rem;
}

.qr-payment-panel {
    margin-top: 1.25rem;
}

.qr-image-wrap {
    margin: 1em 0;
}

.qr-image {
    max-width: 256px;
    height: auto;
}

.qr-instruction {
    font-weight: bold;
    color: #333;
}

.qr-expiry {
    color: #666;
}

.donation-after-rating__btn-once.app-button--secondary {
    background: transparent;
    border: 2px solid var(--ds-header-donate-bg);
    color: var(--ds-text-primary);
}

.donation-after-rating__btn-once.app-button--secondary:hover:not(:disabled):not([aria-disabled='true']) {
    background: rgba(92, 184, 92, 0.08);
    border-color: var(--ds-header-donate-border);
    color: var(--ds-text-primary);
}

.donation-after-rating__alternatives {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-top: 9rem;
    margin-bottom: calc(52px + constant(safe-area-inset-bottom, 0px));
    margin-bottom: calc(52px + env(safe-area-inset-bottom, 0px));
    text-align: left;
}

.donation-after-rating__alt-copy {
    margin: 0;
    color: var(--ds-text-primary);
    font-size: 1.05rem;
    line-height: 1.45;
}

.donation-after-rating__alt-copy:last-child {
    margin-bottom: 0;
}

.donation-after-rating__alt-copy :deep(a) {
    color: var(--ds-text-primary);
    text-decoration: underline;
}

.donation-after-rating__word-of-mouth {
    margin: 0.75rem 0 0;
    padding-inline-start: 1.5rem;
    list-style: disc;
}

.donation-after-rating__word-of-mouth > li + li {
    margin-top: 0.5rem;
}

.donation-after-rating__sign-off > p + p {
    margin-top: 0.25rem;
}

.donation-after-rating__btn-skip {
    align-self: center;
    width: fit-content;
    max-width: 100%;
}

.donation-after-rating__btn-skip.app-button--secondary {
    background: transparent;
    border: 2px solid var(--ds-text-secondary, #404040);
    color: var(--ds-text-primary);
}

.donation-after-rating__btn-skip.app-button--secondary:hover:not(:disabled):not([aria-disabled='true']) {
    background: rgba(64, 64, 64, 0.08);
    border-color: var(--ds-text-secondary, #404040);
    color: var(--ds-text-primary);
}

@media (min-width: 768px) {
    .donation-after-rating__cta {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }

    .donation-after-rating__donation {
        padding-left: 0;
        padding-right: 0;
    }
}

@media (min-width: 992px) {
    .donation-after-rating__page {
        width: 80vw;
        max-width: 80vw;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
