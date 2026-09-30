<template>
    <AdminLayout>
        <div class="admin-identity-verification-report">
            <h2>{{ $t('adminNavReporteVerificaciones') }}</h2>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';

export default {
    name: 'admin-identity-verification-report',
    components: {
        AdminLayout
    }
};
</script>
