<template>
    <section class="donation-after-rating-hero donation-after-rating-hero--full-width">
        <div class="donation-after-rating-hero__copy">
            <h1 class="donation-after-rating-hero__title">
                <span
                    class="donation-after-rating-hero__title-line donation-after-rating-hero__title-line--primary"
                >
                    {{ $t('donationAfterRatingHeroTitlePrimary') }}
                </span>
                <span
                    class="donation-after-rating-hero__title-line donation-after-rating-hero__title-line--accent"
                >
                    {{ $t('donationAfterRatingHeroTitleAccent') }}
                </span>
            </h1>
            <div class="donation-after-rating-hero__mission">
                <p class="donation-after-rating-hero__mission-lead">
                    <span
                        class="donation-after-rating-hero__mission-org"
                        v-html="$t('donationAfterRatingMissionOrg')"
                    ></span>
                    <span class="donation-after-rating-hero__mission-lead-emphasis">
                        {{ $t('donationAfterRatingMissionLead') }}
                    </span>
                </p>
                <p
                    class="donation-after-rating-hero__mission-body"
                    v-html="$t('donationAfterRatingMissionBody')"
                ></p>
            </div>
        </div>
        <div class="donation-after-rating-hero__media">
            <div class="donation-after-rating-hero__image-frame">
                <div
                    class="donation-after-rating-hero__image-backdrop"
                    aria-hidden="true"
                ></div>
                <img
                    class="donation-after-rating-hero__image"
                    :src="heroImageUrl"
                    alt=""
                />
            </div>
        </div>
    </section>
</template>

<script>
import { getDonationAfterRatingHeroImageUrl } from '../../utils/donationAfterRatingHero.js';

export default {
    name: 'DonationAfterRatingHero',
    computed: {
        heroImageUrl() {
            return getDonationAfterRatingHeroImageUrl();
        }
    }
};
</script>

<style scoped>
.donation-after-rating-hero--full-width {
    width: 100%;
    max-width: 100vw;
    box-sizing: border-box;
}

.donation-after-rating-hero {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
}

.donation-after-rating-hero__copy {
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;
    container-type: inline-size;
    text-align: center;
}

.donation-after-rating-hero__title {
    margin: 0;
    width: 100%;
    font-family: 'Dela Gothic One', var(--ds-font-family);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.02em;
}

.donation-after-rating-hero__title-line {
    display: block;
    width: 100%;
    max-width: 100%;
    font-size: clamp(1.75rem, 9.5cqw, 4.5rem);
    text-transform: uppercase;
}

.donation-after-rating-hero__title-line--primary {
    color: var(--ds-text-secondary);
}

.donation-after-rating-hero__title-line--accent {
    color: var(--ds-header-donate-bg);
}

.donation-after-rating-hero__mission {
    display: none;
    margin: 1.25rem 0 0;
    color: var(--ds-text-secondary);
    font-family: var(--ds-font-family);
    font-size: 1.4rem;
    line-height: 1.45;
    text-align: left;
}

.donation-after-rating-hero__mission-lead {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    font-weight: var(--ds-font-weight-normal, 400);
}

.donation-after-rating-hero__mission-lead-emphasis,
.donation-after-rating-hero__mission-lead :deep(strong) {
    font-weight: var(--ds-font-weight-bold, 700);
}

.donation-after-rating-hero__mission-body {
    margin: 0.75rem 0 0;
    font-size: inherit;
    line-height: inherit;
    font-weight: var(--ds-font-weight-normal, 400);
}

.donation-after-rating-hero__mission-body :deep(strong) {
    font-weight: var(--ds-font-weight-bold, 700);
}

.donation-after-rating-hero__media {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
}

.donation-after-rating-hero__image-frame {
    position: relative;
    width: 85vw;
    max-width: 85vw;
    min-width: 0;
    margin: 0 auto;
    aspect-ratio: 4 / 3;
}

.donation-after-rating-hero__image-backdrop,
.donation-after-rating-hero__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 1.25rem;
}

.donation-after-rating-hero__image-backdrop {
    background: var(--ds-header-donate-bg);
}

.donation-after-rating-hero__image {
    object-fit: cover;
    transform: rotate(-4deg);
    z-index: 1;
}

@media (min-width: 768px) {
    .donation-after-rating-hero {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        align-items: center;
        gap: 4rem;
        padding: 0 2.5rem;
        margin-top: 2rem;
    }

    .donation-after-rating-hero__copy {
        padding: 0;
        text-align: left;
    }

    .donation-after-rating-hero__title-line {
        font-size: clamp(2.75rem, 4.2vw, 5.5rem);
    }

    .donation-after-rating-hero__media {
        justify-self: stretch;
        padding: 1.5rem 0 1.5rem 1.5rem;
    }

    .donation-after-rating-hero__image-frame {
        width: 100%;
        max-width: 100%;
    }
}

@media (min-width: 992px) {
    .donation-after-rating-hero__mission {
        display: block;
    }

    .donation-after-rating-hero__image-frame {
        width: 30vw;
        max-width: 30vw;
        margin-left: auto;
        margin-right: 0;
    }
}
</style>
