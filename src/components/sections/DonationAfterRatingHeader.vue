<template>
    <div class="donation-after-rating-app-header">
        <div class="donation-after-rating-app-header__brand">
            <img
                :src="header_logo"
                alt=""
                class="donation-after-rating-app-header__logo"
            />
            <div class="donation-after-rating-app-header__project">
                <span class="donation-after-rating-app-header__project-text">
                    {{ $t('proyectoDe') }}
                </span>
                <img
                    :src="$publicImg('logo_sts_nuevo_color.png')"
                    alt="STS Rosario"
                    class="donation-after-rating-app-header__sts-logo"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DonationAfterRatingHeader',
    data() {
        return {
            header_logo: process.env.ROUTE_BASE + 'img/logo2.svg'
        };
    }
};
</script>

<style scoped>
.donation-after-rating-app-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: calc(
        var(--ds-header-desktop-padding-y, 0.75rem) +
            constant(safe-area-inset-top, 0px)
    );
    padding-top: calc(
        var(--ds-header-desktop-padding-y, 0.75rem) +
            env(safe-area-inset-top, 0px)
    );
    padding-bottom: var(--ds-header-desktop-padding-y, 0.75rem);
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}

.donation-after-rating-app-header__brand {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 0.5rem 0.65rem;
    max-width: 100%;
}

.donation-after-rating-app-header__logo {
    display: block;
    flex: 0 1 auto;
    height: 1.85rem;
    width: auto;
    max-width: 9.5rem;
}

.donation-after-rating-app-header__project {
    display: inline-flex;
    align-items: center;
    flex: 0 1 auto;
    min-width: 0;
    gap: 0.35rem;
    color: #fff;
    font-size: 0.7rem;
    line-height: 1.1;
}

.donation-after-rating-app-header__project-text {
    color: #fff;
    white-space: nowrap;
}

.donation-after-rating-app-header__sts-logo {
    display: block;
    flex: 0 1 auto;
    height: 1.15rem;
    width: auto;
    max-width: 5.5rem;
    filter: brightness(0) invert(1);
}

@media (min-width: 768px) {
    .donation-after-rating-app-header {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .donation-after-rating-app-header__logo {
        height: 2.35rem;
        max-width: 12rem;
    }

    .donation-after-rating-app-header__project {
        font-size: 0.85rem;
        gap: 0.45rem;
    }

    .donation-after-rating-app-header__sts-logo {
        height: 1.5rem;
        max-width: 7rem;
    }
}
</style>
