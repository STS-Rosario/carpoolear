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
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
</style>
