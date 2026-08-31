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
                    v-html="$t(benefitKey)"
                ></li>
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
                    </section>

                    <section class="donation-after-rating__alternatives">
                        <p
                            class="donation-after-rating__alt-copy"
                            v-html="volunteerParagraphHtml"
                        ></p>
                        <p
                            class="donation-after-rating__alt-copy"
                            v-html="instagramParagraphHtml"
                        ></p>
                        <p class="donation-after-rating__alt-copy">
                            <a
                                href="/trips"
                                class="donation-after-rating__skip-link"
                                @click.prevent="onContinueWithoutDonating"
                            >
                                {{ $t('donationAfterRatingCannotContributeLink') }}
                            </a>{{ $t('donationAfterRatingCannotContributeSuffix') }}
                        </p>
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
import DonationAmountPicker from '../elements/DonationAmountPicker.vue';
import DonationAfterRatingHero from '../sections/DonationAfterRatingHero.vue';
import AppButton from '../ui/AppButton.vue';
import { startDonationCheckout } from '../../utils/donationCheckout.js';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from '../../utils/donationAfterRatingBenefits.js';
import {
    CARPOOLEAR_COLLABORATE_URL,
    CARPOOLEAR_INSTAGRAM_URL
} from '../../utils/carpoolearSocialUrls.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default {
    name: 'donation-after-rating',
    components: {
        DonationAmountPicker,
        DonationAfterRatingHero,
        AppButton
    },
    props: {
        tripId: {
            type: [String, Number],
            required: true
        },
        preview: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            donateValue: 0,
            benefitKeys: DONATION_AFTER_RATING_BENEFIT_KEYS
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            appConfig: 'appConfig'
        }),
        volunteerParagraphHtml() {
            const link = `<a href="${CARPOOLEAR_COLLABORATE_URL}" target="_blank" rel="noopener noreferrer">${this.$t('donationAfterRatingVolunteerLink')}</a>`;
            return this.$t('donationAfterRatingVolunteerParagraph', { link });
        },
        instagramParagraphHtml() {
            const link = `<a href="${CARPOOLEAR_INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer">${this.$t('donationAfterRatingInstagramLink')}</a>`;
            return this.$t('donationAfterRatingInstagramParagraph', { link });
        }
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
                        source: 'after_rating',
                        tripId: this.tripId,
                        userId: this.user && this.user.id,
                        appConfig: this.appConfig
                    });
                    await this.openExternalBrowser(url);
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
                        source: 'after_rating',
                        tripId: this.tripId,
                        userId: this.user && this.user.id,
                        appConfig: this.appConfig
                    });
                    await this.openExternalBrowser(url);
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

.donation-after-rating__cta-intro :deep(strong) {
    font-weight: var(--ds-font-weight-bold, 700);
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

.donation-after-rating__benefits-item :deep(strong) {
    font-weight: var(--ds-font-weight-bold, 700);
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
.donation-after-rating__btn-once {
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
    font-weight: var(--ds-font-weight-bold, 700);
    text-decoration: underline;
}

.donation-after-rating__skip-link {
    color: var(--ds-text-primary);
    font-weight: var(--ds-font-weight-normal, 400);
    text-decoration: underline;
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
