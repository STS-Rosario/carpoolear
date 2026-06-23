<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('validacionesManuales') }}</h2>
                <div class="show-resolved-toggle">
                    <label>
                        <input v-model="showResolved" type="checkbox" />
                        {{ $t('mostrarResueltos') }}
                    </label>
                </div>
                <Loading :data="displayedList">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th
                                    v-for="column in sortableColumns"
                                    :key="column.key"
                                    scope="col"
                                    class="admin-manual-th-sort"
                                    @click="toggleSort(column.key)"
                                >
                                    {{ $t(column.labelKey) }}
                                    <span
                                        v-if="sortKey === column.key"
                                        class="admin-manual-sort-hint"
                                    >{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
                                </th>
                                <th scope="col">{{ $t('acciones') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in displayedList" :key="item.id">
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user_name || $t('na') }}</td>
                                <td>{{ item.paid_at ? formatDate(item.paid_at) : '-' }}</td>
                                <td>{{ item.submitted_at ? formatDate(item.submitted_at) : '-' }}</td>
                                <td>{{ formatWaitingTime(item) }}</td>
                                <td>{{ item.paid ? $t('si') : $t('no') }}</td>
                                <td>
                                    <span :class="getStatusBadgeClass(item)">
                                        {{ getStatusLabel(item) }}
                                    </span>
                                    <span
                                        v-if="isApprovedWithImagesPending(item)"
                                        class="label label-danger pending-images-pill"
                                        :title="$t('faltaBorrarImagenes')"
                                    >
                                        {{ $t('faltaBorrarImagenes') }}
                                    </span>
                                </td>
                                <td>
                                    <router-link
                                        v-if="item.user_id"
                                        :to="getAdminUserProfileRoute(item.user_id)"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ $t('verPerfil') }}
                                    </router-link>
                                    <router-link
                                        :to="{ name: 'admin-manual-identity-validation-review', params: { id: item.id } }"
                                        class="btn btn-primary-blue btn-sm"
                                    >
                                        {{ $t('revisarSolicitud') }}
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <template #no-data><div class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">{{ $t('noHayValidacionesManuales') }}</div>
                    </div></template>
                    <template #loading><div class="text-center" style="margin-top: 20px;">
                        <img :src="$publicImg('loader.gif')" alt="" class="ajax-loader" />
                        <p>{{ $t('cargando') }}</p>
                    </div></template>
                </Loading>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import Loading from '../Loading';
import { AdminApi } from '../../services/api';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import {
    filterManualIdentityValidationsList,
    getNextManualIdentityValidationSortState,
    getShowResolvedManualIdentityValidations,
    MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS,
    saveShowResolvedManualIdentityValidations,
    sortManualIdentityValidationsList
} from '../../utils/adminManualIdentityValidationsList';
import {
    formatManualIdentityValidationWaitingTime,
    getManualIdentityValidationStatusBadgeClass,
    getManualIdentityValidationStatusLabel
} from '../../utils/adminManualIdentityValidationDisplay';

export default {
    name: 'AdminManualIdentityValidations',
    data() {
        return {
            list: null,
            showResolved: getShowResolvedManualIdentityValidations(),
            sortKey: null,
            sortDir: 'asc',
            sortableColumns: MANUAL_IDENTITY_VALIDATION_SORT_COLUMNS
        };
    },
    computed: {
        displayedList() {
            if (!Array.isArray(this.list)) {
                return this.list;
            }

            const filtered = filterManualIdentityValidationsList(this.list, this.showResolved);

            return sortManualIdentityValidationsList(filtered, this.sortKey, this.sortDir);
        }
    },
    watch: {
        showResolved(value) {
            saveShowResolvedManualIdentityValidations(value);
        }
    },
    methods: {
        getAdminUserProfileRoute,
        formatDate(value) {
            if (!value) return '-';
            return new Date(value).toLocaleString();
        },
        formatWaitingTime(item) {
            return formatManualIdentityValidationWaitingTime(item, (key) => this.$t(key));
        },
        getStatusLabel(item) {
            return getManualIdentityValidationStatusLabel(item, (key) => this.$t(key));
        },
        getStatusBadgeClass(item) {
            return getManualIdentityValidationStatusBadgeClass(item);
        },
        isApprovedWithImagesPending(item) {
            const status = item.review_status;
            const approved = status === 'approved' || status === 'approve';
            return approved && item.has_images === true;
        },
        toggleSort(column) {
            const next = getNextManualIdentityValidationSortState(
                this.sortKey,
                this.sortDir,
                column
            );

            this.sortKey = next.sortKey;
            this.sortDir = next.sortDir;
        },
        fetchList() {
            const api = new AdminApi();
            return api.getManualIdentityValidations().then((res) => {
                const data = res.data || res;
                this.list = Array.isArray(data) ? data : (data.data || []);
            }).catch(() => {
                this.list = [];
            });
        }
    },
    mounted() {
        this.fetchList();
    },
    components: {
        AdminLayout,
        Loading
    }
};
</script>
<style scoped>
.show-resolved-toggle {
    margin-bottom: 16px;
}

.pending-images-pill {
    margin-left: 6px;
}

.admin-manual-th-sort {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.admin-manual-th-sort:hover {
    background: #f5f5f5;
}

.admin-manual-sort-hint {
    color: #666;
    margin-left: 4px;
    font-size: 12px;
}
</style>
