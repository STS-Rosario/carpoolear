<template>
    <AdminLayout>
        <h3>{{ $t('adminCarBrands') }}</h3>
        <div class="admin-car-sync-panel">
            <button
                type="button"
                class="btn btn-primary"
                :disabled="syncRunning"
                @click="syncNow"
            >
                {{ $t('adminCarCatalogSyncNow') }}
            </button>
            <p v-if="syncRunning">{{ $t('adminCarCatalogSyncRunning') }}</p>
            <p v-else-if="lastSyncSummary">
                {{ $t('adminCarCatalogSyncLastRun') }}:
                {{ lastSyncSummary }}
            </p>
        </div>
        <form class="admin-car-brand-form" @submit.prevent="createBrand">
            <div class="row">
                <div class="col-sm-8">
                    <input
                        v-model="form.name"
                        class="form-control"
                        :placeholder="$t('marca')"
                        required
                    />
                </div>
                <div class="col-sm-4">
                    <button type="submit" class="btn btn-primary">
                        {{ $t('agregar') }}
                    </button>
                </div>
            </div>
        </form>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>{{ $t('marca') }}</th>
                    <th>{{ $t('plantillaAcciones') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in brands" :key="row.id">
                    <td>{{ row.name }}</td>
                    <td>
                        <router-link
                            class="btn btn-xs btn-default"
                            :to="{
                                name: 'admin-car-models',
                                params: { brandId: row.id }
                            }"
                        >
                            {{ $t('adminCarModels') }}
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useAdminCarCatalogStore } from '../../stores/adminCarCatalog';

export default {
    name: 'admin-car-brands',
    components: { AdminLayout },
    data() {
        return {
            form: { name: '' },
            syncRunning: false,
            pollTimer: null
        };
    },
    computed: {
        ...mapState(useAdminCarCatalogStore, ['brands', 'syncStatus']),
        lastSyncSummary() {
            const last = this.syncStatus && this.syncStatus.last_run;
            if (!last) {
                return '';
            }

            return [
                last.models_created != null
                    ? `models: ${last.models_created}`
                    : null,
                last.brands_created != null
                    ? `brands: ${last.brands_created}`
                    : null
            ]
                .filter(Boolean)
                .join(', ');
        }
    },
    mounted() {
        this.fetchBrands();
        this.fetchSyncStatus();
    },
    beforeUnmount() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
    },
    methods: {
        ...mapActions(useAdminCarCatalogStore, {
            fetchBrands: 'fetchBrands',
            createBrandAction: 'createBrand',
            triggerSync: 'triggerSync',
            fetchSyncStatus: 'fetchSyncStatus'
        }),
        createBrand() {
            this.createBrandAction({ name: this.form.name }).then(() => {
                this.form.name = '';
            });
        },
        syncNow() {
            this.triggerSync().then(() => {
                this.syncRunning = true;
                this.pollTimer = setInterval(() => {
                    this.fetchSyncStatus().then((status) => {
                        if (!status.running) {
                            this.syncRunning = false;
                            clearInterval(this.pollTimer);
                            this.pollTimer = null;
                            this.fetchBrands();
                        }
                    });
                }, 3000);
            });
        }
    }
};
</script>

<style scoped>
.admin-car-sync-panel {
    margin-bottom: 16px;
}

.admin-car-brand-form {
    margin-bottom: 16px;
}
</style>
