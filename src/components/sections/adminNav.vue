<template>
    <div class="col-md-20 col-md-offset-2">
        <div class="nav nav-tabs">
            <li>
                <router-link :to="{ name: 'admin-page' }">{{ $t('adminNavGraficos') }}</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'admin-users' }"
                    >{{ $t('adminNavUsuarios') }}</router-link
                >
            </li>
            <li>
                <router-link :to="{ name: 'admin-trips' }">{{ $t('adminNavViajes') }}</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'admin-banned-users' }">{{ $t('usuariosBloqueados') }}</router-link>
                </li>
            <li>
                <router-link :to="{ name: 'admin-manual-identity-validations' }">{{ $t('validacionesManuales') }}</router-link>
            </li>
            <li>
                <router-link :to="{ name: 'admin-mp-rejected-validations' }">{{ $t('rechazosMercadoPago') }}</router-link>
            </li>
        </div>
    </div>
</template>
<script>
export default {
    name: 'admin-nav',
    data() {
        return {
            selected: ''
        };
    },
    mounted() {}
};
</script>

<style scoped>
.nav-pills {
    font-size: 1.5em;
}
</style>
