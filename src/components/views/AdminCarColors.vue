<template>
    <AdminLayout>
        <h3>{{ $t('adminCarColors') }}</h3>
        <form class="admin-car-color-form" @submit.prevent="createColor">
            <div class="row">
                <div class="col-sm-4">
                    <AppInput
                        v-model="form.name"
                        :placeholder="$t('color')"
                        required
                    />
                </div>
                <div class="col-sm-3">
                    <AppInput
                        v-model="form.hex"
                        :placeholder="$t('colorHexPlaceholder')"
                    />
                </div>
                <div class="col-sm-2">
                    <input
                        v-model="form.hex"
                        type="color"
                        class="admin-car-color-form__picker"
                    />
                </div>
                <div class="col-sm-3">
                    <AppButton type="submit" variant="primary">
                        {{ $t('agregar') }}
                    </AppButton>
                </div>
            </div>
        </form>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>{{ $t('color') }}</th>
                    <th>{{ $t('colorHex') }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in colors" :key="row.id">
                    <td>
                        <span
                            v-if="row.hex"
                            class="admin-car-color-swatch"
                            :style="{ backgroundColor: row.hex }"
                        ></span>
                        {{ row.name }}
                    </td>
                    <td>{{ row.hex || '-' }}</td>
                    <td>
                        <AppButton
                            variant="danger"
                            size="sm"
                            @click="removeColor(row.id)"
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
    name: 'admin-car-colors',
    components: { AdminLayout, AppButton, AppInput },
    data() {
        return {
            form: {
                name: '',
                hex: '#FFFFFF',
                sort_order: 0
            }
        };
    },
    computed: {
        ...mapState(useAdminCarCatalogStore, ['colors'])
    },
    mounted() {
        this.fetchColors();
    },
    methods: {
        ...mapActions(useAdminCarCatalogStore, {
            fetchColors: 'fetchColors',
            createColorAction: 'createColor',
            deleteColor: 'deleteColor'
        }),
        createColor() {
            this.createColorAction({ ...this.form }).then(() => {
                this.form.name = '';
                this.form.hex = '#FFFFFF';
            });
        },
        removeColor(id) {
            this.deleteColor(id);
        }
    }
};
</script>

<style scoped>
.admin-car-color-swatch {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #ccc;
    margin-right: 8px;
    vertical-align: middle;
}

.admin-car-color-form {
    margin-bottom: 16px;
}

.admin-car-color-form__picker {
    width: 100%;
    height: 38px;
    padding: 2px;
}
</style>
