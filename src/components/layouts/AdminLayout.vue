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
import { log343bb5 } from '../../debug/session343bb5Log';

export default {
    name: 'admin-layout',
    components: {
        adminNav
    },
    mounted() {
        log343bb5('H-C,H-E', 'AdminLayout.vue:mounted', 'admin-layout-mounted', {});
    },
    errorCaptured(err, _instance, info) {
        // #region agent log
        log343bb5('H12', 'AdminLayout.vue:errorCaptured', 'admin-layout-error-captured', {
            info: info || 'unknown',
            errName: err && err.name ? err.name : 'unknown',
            errMessage: err && err.message ? String(err.message).slice(0, 220) : 'unknown'
        });
        // #endregion
        return false;
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
