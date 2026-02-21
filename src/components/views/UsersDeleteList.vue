<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ t('pedidosDeEliminacionDeCuenta') }}</h2>
                <Loading :data="deleteRequests">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">{{ t('id') }}</th>
                                <th scope="col">{{ t('usuario') }}</th>
                                <th scope="col">{{ t('email') }}</th>
                                <th scope="col">{{ t('fechaDeSolicitud') }}</th>
                                <th scope="col">{{ t('estado') }}</th>
                                <th scope="col">{{ t('fechaDeAccion') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="request in deleteRequests"
                                :key="request.id"
                                v-on:click="openModal(request)"
                                class="table-row-clickable"
                            >
                                <th scope="row">{{ request.id }}</th>
                                <td>{{ request.user ? request.user.name : t('na') }}</td>
                                <td>{{ request.user ? request.user.email : t('na') }}</td>
                                <td>{{ formatDateLocal(request.date_requested) }}</td>
                                <td>
                                    <span
                                        :class="getActionTakenBadgeClass(request.action_taken)"
                                    >
                                        {{ getActionTakenLabel(request.action_taken) }}
                                    </span>
                                </td>
                                <td>
                                    {{
                                        request.action_taken_date
                                            ? formatDateLocal(request.action_taken_date)
                                            : '-'
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <template #no-data>
                        <div class="text-center" style="margin-top: 20px;">
                            <div class="alert alert-info">
                                {{ t('noHayPedidosEliminacion') }}
                            </div>
                        </div>
                    </template>
                    <template #loading>
                        <div class="text-center" style="margin-top: 20px;">
                            <img
                                src="https://carpoolear.com.ar/static/img/loader.gif"
                                alt=""
                                class="ajax-loader"
                            />
                            <p>{{ t('cargandoPedidos') }}</p>
                        </div>
                    </template>
                </Loading>

                <modal
                    :name="'modal-edit-delete-request'"
                    v-if="showModal"
                    @close="closeModal"
                    :body="'Body'"
                >
                    <template #header>
                        <h3>
                            <span>{{ t('editarPedidoEliminacion') }}</span>
                            <i
                                v-on:click="closeModal"
                                class="fa fa-times float-right-close"
                            ></i>
                        </h3>
                    </template>
                    <template #body>
                        <div class="text-left color-black">
                            <div class="form-group" v-if="currentRequest">
                                <label><strong>{{ t('idLabel') }}:</strong> {{ currentRequest.id }}</label>
                            </div>
                            <div class="form-group" v-if="currentRequest && currentRequest.user">
                                <label>{{ t('usuarioLabel') }} {{ currentRequest.user.name }}</label>
                                <div style="margin-top: 8px;">
                                    <router-link
                                        :to="{ name: 'profile', params: { id: currentRequest.user.id } }"
                                        target="_blank"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ t('verPerfilPublico') }}
                                    </router-link>
                                    <router-link
                                        :to="{ name: 'admin-users', query: { userId: currentRequest.user.id } }"
                                        class="btn btn-link btn-sm"
                                    >
                                        {{ t('editarEnAdmin') }}
                                    </router-link>
                                </div>
                            </div>
                            <div class="form-group" v-if="currentRequest && currentRequest.user">
                                <label>{{ t('emailLabel') }} {{ currentRequest.user.email }}</label>
                            </div>
                            <div class="form-group" v-if="currentRequest">
                                <label
                                    >{{ t('fechaDeSolicitudLabel') }}
                                    {{ formatDateLocal(currentRequest.date_requested) }}</label
                                >
                            </div>
                            <div class="form-group">
                                <label for="action-taken">{{ t('accionTomada') }}</label>
                                <select
                                    v-model="editForm.action_taken"
                                    id="action-taken"
                                    class="form-control"
                                >
                                    <option :value="0">{{ t('solicitado') }}</option>
                                    <option :value="1">{{ t('eliminado') }}</option>
                                    <option :value="2">{{ t('rechazado') }}</option>
                                </select>
                            </div>
                            <div class="text-center" style="margin-top: 1.5em;">
                                <button
                                    class="btn btn-primary"
                                    @click="submitUpdate"
                                    :disabled="loading"
                                >
                                    <span v-if="!loading">{{ t('guardar') }}</span>
                                    <spinner class="blue" v-if="loading"></spinner>
                                </button>
                            </div>
                        </div>
                    </template>
                </modal>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import adminNav from '../sections/adminNav';
import Loading from '../Loading.vue';
import modal from '../Modal';
import Spinner from '../Spinner.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';

const { t } = useI18n();

const deleteRequests = ref(null);
const showModal = ref(false);
const currentRequest = ref(null);
const editForm = reactive({
    id: null,
    action_taken: 0
});
const loading = ref(false);
let adminApi = null;

const formatDateLocal = (dateString) => {
    if (!dateString) return '-';
    return moment(dateString).format('DD/MM/YYYY HH:mm');
};

const getActionTakenLabel = (actionTaken) => {
    if (actionTaken === 0) return t('solicitado');
    if (actionTaken === 1) return t('eliminado');
    if (actionTaken === 2) return t('rechazado');
    return t('desconocido');
};

const getActionTakenBadgeClass = (actionTaken) => {
    const classes = {
        0: 'badge badge-warning',
        1: 'badge badge-danger',
        2: 'badge badge-secondary'
    };
    return classes[actionTaken] || 'badge badge-default';
};

const openModal = (request) => {
    currentRequest.value = request;
    editForm.id = request.id;
    editForm.action_taken = request.action_taken;
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    currentRequest.value = null;
    editForm.id = null;
    editForm.action_taken = 0;
};

const submitUpdate = () => {
    loading.value = true;
    adminApi
        .updateAccountDelete(editForm)
        .then(() => {
            loading.value = false;
            closeModal();
            dialogs.message(t('pedidoEliminacionActualizadoExitosamente'), {
                duration: 5,
                estado: 'success'
            });
            loadDeleteRequests();
        })
        .catch((error) => {
            loading.value = false;
            console.error('Error updating delete request:', error);
            dialogs.message(t('errorActualizarPedidoEliminacion'), {
                duration: 5,
                estado: 'error'
            });
        });
};

const loadDeleteRequests = () => {
    deleteRequests.value = null;
    adminApi
        .getAccountDeleteList()
        .then((response) => {
            deleteRequests.value = response.data || [];
        })
        .catch((error) => {
            console.error('Error loading delete requests:', error);
            deleteRequests.value = [];
            dialogs.message(t('errorCargarPedidosEliminacion'), {
                duration: 5,
                estado: 'error'
            });
        });
};

onMounted(() => {
    adminApi = new AdminApi();
    loadDeleteRequests();
});
</script>

<style scoped>
.table {
    margin-top: 20px;
    background-color: #fff;
}
.table thead th {
    background-color: #f8f9fa;
    color: #333;
    font-weight: bold;
    border-bottom: 2px solid #dee2e6;
}
.table tbody tr {
    background-color: #fff;
    color: #333;
}
.table tbody tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
}
.table tbody td,
.table tbody th {
    border-color: #dee2e6;
    padding: 12px 8px;
    vertical-align: middle;
}
.table thead th {
    padding: 12px 8px;
    vertical-align: middle;
}
.table-row-clickable {
    transition: background-color 0.2s ease;
}
.table-row-clickable:hover {
    background-color: #f5f5f5 !important;
}
.badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
}
.badge-warning {
    background-color: #ffc107;
    color: #000;
}
.badge-danger {
    background-color: #dc3545;
    color: #fff;
}
.badge-secondary {
    background-color: #6c757d;
    color: #fff;
}
.ajax-loader {
    margin: 20px auto;
    display: block;
}
</style>
