<template>
    <AdminLayout>
        <h3>{{ $t('adminCarModels') }}</h3>
        <form class="admin-car-model-form" @submit.prevent="createModel">
            <div class="row">
                <div class="col-sm-8">
                    <AppInput
                        v-model="form.name"
                        :placeholder="$t('modelo')"
                        required
                    />
                </div>
                <div class="col-sm-4">
                    <AppButton type="submit" variant="primary">
                        {{ $t('agregar') }}
                    </AppButton>
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
                        <AppButton
                            variant="danger"
                            size="sm"
                            @click="removeModel(row.id)"
                        >
                            {{ $t('accionEliminar') }}
                        </AppButton>
                    </td>
                </tr>
            </tbody>
        </table>
    </AdminLayout>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import AdminLayout from '../layouts/AdminLayout.vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import { useAdminCarCatalogStore } from '../../stores/adminCarCatalog';

export default {
    name: 'admin-car-models',
    components: { AdminLayout, AppButton, AppInput },
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
