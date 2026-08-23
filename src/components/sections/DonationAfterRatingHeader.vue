<template>
    <div class="donation-after-rating-app-header">
        <img
            :src="header_logo"
            alt=""
            class="donation-after-rating-app-header__logo"
        />
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
    padding-left: 1rem;
    padding-right: 1rem;
}

.donation-after-rating-app-header__logo {
    display: block;
    height: 2.75rem;
    width: auto;
    max-width: min(100%, 16rem);
}

@media (min-width: 768px) {
    .donation-after-rating-app-header__logo {
        height: 3.5rem;
    }
}
</style>
