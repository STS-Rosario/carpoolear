<template>
    <AdminLayout>
        <h3>{{ $t('adminCarModels') }}</h3>
        <form class="admin-car-model-form" @submit.prevent="createModel">
            <div class="row">
                <div class="col-sm-8">
                    <input
                        v-model="form.name"
                        class="form-control"
                        :placeholder="$t('modelo')"
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
                    <th>{{ $t('modelo') }}</th>
                    <th>{{ $t('plantillaAcciones') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in models" :key="row.id">
                    <td>{{ row.name }}</td>
                    <td>
                        <button
                            type="button"
                            class="btn btn-xs btn-danger"
                            @click="removeModel(row.id)"
                        >
                            {{ $t('accionEliminar') }}
                        </button>
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
    name: 'admin-car-models',
    components: { AdminLayout },
    props: {
        brandId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            form: { name: '' }
        };
    },
    computed: {
        ...mapState(useAdminCarCatalogStore, ['models'])
    },
    mounted() {
        this.fetchModels(this.brandId);
    },
    methods: {
        ...mapActions(useAdminCarCatalogStore, {
            fetchModels: 'fetchModels',
            createModelAction: 'createModel',
            deleteModel: 'deleteModel'
        }),
        createModel() {
            this.createModelAction(this.brandId, { name: this.form.name }).then(
                () => {
                    this.form.name = '';
                }
            );
        },
        removeModel(modelId) {
            this.deleteModel(this.brandId, modelId);
        }
    }
};
</script>

<style scoped>
.admin-car-model-form {
    margin-bottom: 16px;
}
</style>
