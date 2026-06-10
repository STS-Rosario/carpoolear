<template>
    <AdminLayout>
        <h3>{{ $t('adminCarColors') }}</h3>
        <form class="admin-car-color-form" @submit.prevent="createColor">
            <div class="row">
                <div class="col-sm-4">
                    <input
                        v-model="form.name"
                        class="form-control"
                        :placeholder="$t('color')"
                        required
                    />
                </div>
                <div class="col-sm-3">
                    <input
                        v-model="form.hex"
                        class="form-control"
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
                    <button type="submit" class="btn btn-primary">
                        {{ $t('agregar') }}
                    </button>
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
                        <button
                            type="button"
                            class="btn btn-xs btn-danger"
                            @click="removeColor(row.id)"
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
    name: 'admin-car-colors',
    components: { AdminLayout },
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
