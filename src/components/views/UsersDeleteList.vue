<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>Pedidos de eliminación de cuenta</h2>
                <Loading :data="deleteRequests">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Usuario</th>
                                <th scope="col">Email</th>
                                <th scope="col">Fecha de solicitud</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Fecha de acción</th>
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
                                <td>{{ request.user ? request.user.name : 'N/A' }}</td>
                                <td>{{ request.user ? request.user.email : 'N/A' }}</td>
                                <td>{{ formatDate(request.date_requested) }}</td>
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
                                            ? formatDate(request.action_taken_date)
                                            : '-'
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div slot="no-data" class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">
                            No hay pedidos de eliminación de cuenta
                        </div>
                    </div>
                    <div slot="loading" class="text-center" style="margin-top: 20px;">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        <p>Cargando pedidos...</p>
                    </div>
                </Loading>

                <modal
                    :name="'modal-edit-delete-request'"
                    v-if="showModal"
                    @close="closeModal"
                    :body="'Body'"
                >
                    <h3 slot="header">
                        <span>Editar pedido de eliminación de cuenta</span>
                        <i
                            v-on:click="closeModal"
                            class="fa fa-times float-right-close"
                        ></i>
                    </h3>
                    <div slot="body">
                        <div class="text-left color-black">
                            <div class="form-group" v-if="currentRequest">
                                <label><strong>ID:</strong> {{ currentRequest.id }}</label>
                            </div>
                            <div class="form-group" v-if="currentRequest && currentRequest.user">
                                <label><strong>Usuario:</strong> {{ currentRequest.user.name }}</label>
                            </div>
                            <div class="form-group" v-if="currentRequest && currentRequest.user">
                                <label><strong>Email:</strong> {{ currentRequest.user.email }}</label>
                            </div>
                            <div class="form-group" v-if="currentRequest">
                                <label
                                    ><strong>Fecha de solicitud:</strong>
                                    {{ formatDate(currentRequest.date_requested) }}</label
                                >
                            </div>
                            <div class="form-group">
                                <label for="action-taken">Acción tomada:</label>
                                <select
                                    v-model="editForm.action_taken"
                                    id="action-taken"
                                    class="form-control"
                                >
                                    <option :value="0">Solicitado</option>
                                    <option :value="1">Eliminado</option>
                                    <option :value="2">Rechazado</option>
                                </select>
                            </div>
                            <div class="text-center" style="margin-top: 1.5em;">
                                <button
                                    class="btn btn-primary"
                                    @click="submitUpdate"
                                    :disabled="loading"
                                >
                                    <span v-if="!loading">Guardar</span>
                                    <spinner class="blue" v-if="loading"></spinner>
                                </button>
                            </div>
                        </div>
                    </div>
                </modal>
            </div>
        </div>
    </div>
</template>
<script>
import adminNav from '../sections/adminNav';
import Loading from '../Loading.vue';
import modal from '../Modal';
import Spinner from '../Spinner.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';

export default {
    name: 'admin-users-delete-list',
    data() {
        return {
            deleteRequests: null,
            showModal: false,
            currentRequest: null,
            editForm: {
                id: null,
                action_taken: 0
            },
            loading: false,
            adminApi: null
        };
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '-';
            return moment(dateString).format('DD/MM/YYYY HH:mm');
        },
        getActionTakenLabel(actionTaken) {
            const labels = {
                0: 'Solicitado',
                1: 'Eliminado',
                2: 'Rechazado'
            };
            return labels[actionTaken] || 'Desconocido';
        },
        getActionTakenBadgeClass(actionTaken) {
            const classes = {
                0: 'badge badge-warning',
                1: 'badge badge-danger',
                2: 'badge badge-secondary'
            };
            return classes[actionTaken] || 'badge badge-default';
        },
        openModal(request) {
            this.currentRequest = request;
            this.editForm = {
                id: request.id,
                action_taken: request.action_taken
            };
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.currentRequest = null;
            this.editForm = {
                id: null,
                action_taken: 0
            };
        },
        submitUpdate() {
            this.loading = true;
            this.adminApi
                .updateAccountDelete(this.editForm)
                .then(() => {
                    this.loading = false;
                    this.closeModal();
                    dialogs.message('Pedido de eliminación de cuenta actualizado exitosamente', {
                        duration: 5,
                        estado: 'success'
                    });
                    this.loadDeleteRequests();
                })
                .catch((error) => {
                    this.loading = false;
                    console.error('Error updating delete request:', error);
                    dialogs.message('Error al actualizar el pedido de eliminación de cuenta', {
                        duration: 5,
                        estado: 'error'
                    });
                });
        },
        loadDeleteRequests() {
            this.deleteRequests = null;
            this.adminApi
                .getAccountDeleteList()
                .then((response) => {
                    this.deleteRequests = response.data || [];
                })
                .catch((error) => {
                    console.error('Error loading delete requests:', error);
                    this.deleteRequests = [];
                    dialogs.message('Error al cargar los pedidos de eliminación de cuenta', {
                        duration: 5,
                        estado: 'error'
                    });
                });
        }
    },
    components: {
        adminNav,
        Loading,
        modal,
        Spinner
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.loadDeleteRequests();
    }
};
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

