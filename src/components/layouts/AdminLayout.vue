<template>
    <div class="col-md-24">
        <div class="row">
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
.admin-layout-content {
    margin-top: 72px;
}

@media (max-width: 767px) {
    .admin-layout-content {
        margin-top: 24px;
    }
}
</style>
