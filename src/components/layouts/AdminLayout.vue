<template>
    <div class="admin-layout">
        <aside class="admin-layout__sidebar">
            <admin-nav></admin-nav>
        </aside>
        <div class="admin-layout-content">
            <slot></slot>
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
.admin-layout {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-top: 16px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0 12px 24px;
}

.admin-layout__sidebar {
    flex: 0 0 240px;
    width: 240px;
    max-width: 240px;
    min-width: 0;
}

.admin-layout-content {
    flex: 1;
    min-width: 0;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.admin-layout-content :deep(.container) {
    width: 100%;
    max-width: none;
    padding-left: 0;
    padding-right: 0;
    margin-left: 0;
    margin-right: 0;
}

.admin-layout-content :deep([class*='col-md-offset']) {
    margin-left: 0;
}

.admin-layout-content :deep(.row > [class*='col-md-22']),
.admin-layout-content :deep(.row > [class*='col-md-20']),
.admin-layout-content :deep(.container > .row > [class*='col-md-']) {
    float: none;
    width: 100%;
}

@media (max-width: 767px) {
    .admin-layout {
        flex-direction: column;
        gap: 0;
        margin-top: 8px;
        padding: 0 8px 24px;
    }

    .admin-layout__sidebar {
        flex: none;
        width: 100%;
        max-width: none;
    }
}
</style>
