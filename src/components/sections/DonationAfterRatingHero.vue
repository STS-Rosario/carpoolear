<template>
    <section class="donation-after-rating-hero donation-after-rating-hero--full-width">
        <div class="donation-after-rating-hero__copy">
            <h1 class="donation-after-rating-hero__title">
                <span
                    class="donation-after-rating-hero__title-line donation-after-rating-hero__title-line--primary"
                >
                    NECESITAMOS
                </span>
                <span
                    class="donation-after-rating-hero__title-line donation-after-rating-hero__title-line--accent"
                >
                    TU APORTE
                </span>
            </h1>
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
    margin-bottom: 2rem;
}

.donation-after-rating-hero__copy {
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;
    container-type: inline-size;
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
}

.donation-after-rating-hero__title-line--primary {
    color: var(--ds-text-primary);
}

.donation-after-rating-hero__title-line--accent {
    color: var(--ds-header-donate-bg);
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
    width: 100%;
    max-width: 100%;
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
        align-items: start;
        gap: 4rem;
        padding: 0 2.5rem;
    }

    .donation-after-rating-hero__copy {
        padding: 0;
    }

    .donation-after-rating-hero__title-line {
        font-size: clamp(2.75rem, 4.2vw, 5.5rem);
    }

    .donation-after-rating-hero__media {
        justify-self: stretch;
        padding: 1.5rem 0 1.5rem 1.5rem;
    }

    .donation-after-rating-hero__image-frame {
        margin: 0;
    }
}
</style>
