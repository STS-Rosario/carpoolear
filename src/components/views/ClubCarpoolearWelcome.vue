<template>
    <div class="donation-after-rating">
        <div class="donation-after-rating__page">
            <DonationAfterRatingHero
                title-primary-key="clubCarpoolearWelcomeHeroTitlePrimary"
                title-accent-key="clubCarpoolearWelcomeHeroTitleAccent"
                :show-mission="false"
            />
            <section class="donation-after-rating__cta">
                <p
                    v-if="resultMessageKey"
                    class="club-carpoolear-welcome__result"
                    role="status"
                >
                    {{ $t(resultMessageKey) }}
                </p>
                <p
                    v-if="showBenefits"
                    class="donation-after-rating__cta-intro"
                    v-html="$t('donationAfterRatingMonthlyBenefitsIntro')"
                ></p>
                <ul
                    v-if="showBenefits"
                    class="donation-after-rating__benefits"
                >
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
                    <section class="donation-after-rating__alternatives club-carpoolear-welcome__sign-off">
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
                        <AppButton
                            class="club-carpoolear-welcome__trips-btn"
                            variant="header-donate"
                            @click="goToTrips"
                        >
                            {{ $t('clubCarpoolearWelcomeGoToTrips') }}
                        </AppButton>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import DonationAfterRatingHero from '../sections/DonationAfterRatingHero.vue';
import AppButton from '../ui/AppButton.vue';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from '../../utils/donationAfterRatingBenefits.js';
import { normalizeClubCarpoolearWelcomeResult } from '../../utils/clubCarpoolearWelcomeResult.js';

export default {
    name: 'ClubCarpoolearWelcome',
    components: {
        DonationAfterRatingHero,
        AppButton
    },
    data() {
        return {
            benefitKeys: DONATION_AFTER_RATING_BENEFIT_KEYS
        };
    },
    computed: {
        welcomeResult() {
            return normalizeClubCarpoolearWelcomeResult(this.$route?.query?.result);
        },
        showBenefits() {
            return this.welcomeResult === 'success';
        },
        resultMessageKey() {
            if (this.welcomeResult === 'failed') {
                return 'clubCarpoolearWelcomeResultFailed';
            }
            if (this.welcomeResult === 'pending') {
                return 'clubCarpoolearWelcomeResultPending';
            }

            return null;
        }
    },
    mounted() {
        if (this.welcomeResult === 'success') {
            this.fetchUser().catch(() => {});
        }
    },
    methods: {
        ...mapActions(useAuthStore, {
            fetchUser: 'fetchUser'
        }),
        goToTrips() {
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

.club-carpoolear-welcome__result {
    margin: 0 0 1.25rem;
    color: var(--ds-text-primary);
    font-size: 1.1rem;
    line-height: 1.45;
}

.donation-after-rating__alternatives {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-top: 4rem;
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

.donation-after-rating__sign-off > p + p {
    margin-top: 0.25rem;
}

.club-carpoolear-welcome__trips-btn {
    align-self: center;
    width: fit-content;
    max-width: 100%;
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

@media (min-width: 768px) {
    .donation-after-rating__cta {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
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
