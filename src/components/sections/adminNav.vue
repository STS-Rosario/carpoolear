<template>
    <div class="admin-nav-wrapper">
        <div class="admin-nav-mobile-header visible-xs">
            <AppButton
                type="button"
                variant="secondary"
                icon-only
                icon-left="fa fa-bars"
                class="admin-nav-mobile-toggle"
                :aria-label="$t('navegacionAdministracion')"
                @click="toggleMobile"
            />
            <span class="admin-nav-mobile-title">{{ $t('navegacionAdministracion') }}</span>
        </div>

        <div class="admin-nav-sidebar" :class="{ 'is-mobile-open': mobileOpen }">
            <ul class="admin-nav-list">
                <li v-for="item in navItems" :key="item.name">
                    <router-link :to="{ name: item.name }">{{ $t(item.labelKey) }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import AppButton from '../ui/AppButton.vue';
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { visibleAdminNavItems } from '../../utils/adminPermissions';

export default {
    name: 'admin-nav',
    components: {
        AppButton
    },
    data() {
        return {
            mobileOpen: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            authUser: 'user'
        }),
        navItems() {
            return visibleAdminNavItems(this.authUser);
        }
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
    margin-top: 0;
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
        margin-top: 8px;
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
