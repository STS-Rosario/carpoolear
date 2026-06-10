<template>
    <div class="admin-nav-wrapper">
        <div class="admin-nav-mobile-header visible-xs">
            <button
                type="button"
                class="btn btn-default admin-nav-mobile-toggle"
                @click="toggleMobile"
                :aria-label="$t('navegacionAdministracion')"
            >
                <i class="fa fa-bars" aria-hidden="true"></i>
            </button>
            <span class="admin-nav-mobile-title">{{ $t('navegacionAdministracion') }}</span>
        </div>

        <div class="admin-nav-sidebar" :class="{ 'is-mobile-open': mobileOpen }">
            <ul class="admin-nav-list">
                <li>
                    <router-link :to="{ name: 'admin-page' }">{{ $t('adminNavGraficos') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-maintenance' }">{{ $t('adminNavMaintenance') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-users' }">{{ $t('adminNavUsuarios') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-user-migrations' }">{{ $t('migrarUsuarios') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-users-delete-list' }">{{ $t('pedidosDeEliminacionDeCuenta') }}</router-link>
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
                <li>
                    <router-link :to="{ name: 'admin-support-tickets' }">{{ $t('soporte') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-changelogs' }">{{ $t('adminNavChangelog') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-car-brands' }">{{ $t('adminNavCarCatalog') }}</router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'admin-car-colors' }">{{ $t('adminCarColors') }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'admin-nav',
    data() {
        return {
            mobileOpen: false
        };
    },
    watch: {
        $route() {
            this.mobileOpen = false;
        }
    },
    methods: {
        toggleMobile() {
            this.mobileOpen = !this.mobileOpen;
        }
    }
};
</script>

<style scoped>
.admin-nav-wrapper {
    margin-bottom: 16px;
    margin-top: 72px;
}

.admin-nav-sidebar {
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    padding: 12px;
}

.admin-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.admin-nav-list li + li {
    margin-top: 6px;
}

.admin-nav-list a {
    display: block;
    padding: 8px 10px;
    border-radius: 4px;
    color: #333;
    text-decoration: none;
}

.admin-nav-list a.router-link-active {
    background: #f0f6ff;
    color: #0f4fa8;
    font-weight: 600;
}

.admin-nav-mobile-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.admin-nav-mobile-toggle {
    padding: 6px 10px;
}

.admin-nav-mobile-title {
    font-weight: 600;
}

@media (max-width: 767px) {
    .admin-nav-wrapper {
        margin-top: 92px;
    }

    .admin-nav-sidebar {
        display: none;
    }

    .admin-nav-sidebar.is-mobile-open {
        display: block;
    }
}

@media (min-width: 768px) {
    .admin-nav-mobile-header {
        display: none;
    }
}
</style>
