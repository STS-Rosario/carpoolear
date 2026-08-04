<template>
    <div class="col-md-24">
        <div class="row admin-layout-row">
            <div class="col-md-4">
                <admin-nav></admin-nav>
            </div>
            <div class="col-md-20 admin-layout-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import adminNav from '../sections/adminNav';

export default {
    name: 'admin-layout',
    components: {
        adminNav
    }
};
</script>

<style scoped>
.admin-layout-row {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    /* Fill the viewport below .view-container padding, minus desktop footer
       margin-top (1em) so the page does not grow a spurious scrollbar. */
    min-height: calc(100vh - 5.6rem - 1em);
}

.admin-layout-content {
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

@media (max-width: 767px) {
    .admin-layout-row {
        /* Mobile footer/actionbar spacing differs; keep header offset only. */
        min-height: calc(100vh - var(--app-header-offset, 51px) - 1em);
    }
}
</style>
