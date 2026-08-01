<template>
    <AccountSettingsLayout :page-title-key="settingsIdentityPageTitleKey">
        <router-view></router-view>
    </AccountSettingsLayout>
</template>
<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';

export default {
    name: 'settings',
    computed: {
        settingsIdentityPageTitleKey() {
            const n = this.$route.name;
            if (n === 'profile_update') return 'editarPerfil';
            if (n === 'friends_setting') return 'misAmigos';
            if (n === 'identity_validation') return 'validarIdentidad';
            if (n === 'identity_validation_manual') return 'validacionManual';
            if (n === 'profile_password') return 'cambiarPassword';
            return null;
        }
    },
    components: {
        AccountSettingsLayout
    }
};
</script>
