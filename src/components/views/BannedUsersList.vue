<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <h2>{{ $t('usuariosBloqueados') }}</h2>
                <Loading :data="bannedUsers">
                    <table class="table table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">{{ $t('id') }}</th>
                                <th scope="col">{{ $t('usuario') }}</th>
                                <th scope="col">DNI</th>
                                <th scope="col">{{ $t('fechaDeAccion') }}</th>
                                <th scope="col">{{ $t('bloqueadoPor') }}</th>
                                <th scope="col">{{ $t('nota') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="item in bannedUsers"
                                :key="item.id"
                                class="table-row"
                            >
                                <th scope="row">{{ item.id }}</th>
                                <td>{{ item.user ? item.user.name : $t('usuarioAnonimo') }}</td>
                                <td>{{ item.nro_doc || '-' }}</td>
                                <td>{{ formatDate(item.banned_at) }}</td>
                                <td>{{ getBannedByLabel(item.banned_by) }}</td>
                                <td>{{ item.note || '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div slot="no-data" class="text-center" style="margin-top: 20px;">
                        <div class="alert alert-info">
                            {{ $t('noHayUsuariosBloqueados') }}
                        </div>
                    </div>
                    <div slot="loading" class="text-center" style="margin-top: 20px;">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        <p>{{ $t('cargandoPedidos') }}</p>
                    </div>
                </Loading>
            </div>
        </div>
    </div>
</template>
<script>
import adminNav from '../sections/adminNav';
import Loading from '../Loading.vue';
import { AdminApi } from '../../services/api';
import dialogs from '../../services/dialogs.js';
import moment from 'moment';

export default {
    name: 'admin-banned-users-list',
    data() {
        return {
            bannedUsers: null,
            adminApi: null,
            bannedByNames: {}
        };
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return '-';
            return moment(dateString).format('DD/MM/YYYY HH:mm');
        },
        getBannedByLabel(bannedBy) {
            if (bannedBy === 0) return this.$t('sistema');
            return this.bannedByNames[bannedBy] || this.$t('usuario') + ' #' + bannedBy;
        },
        loadBannedUsers() {
            this.bannedUsers = null;
            this.adminApi
                .getBannedUsersList({ per_page: 50 })
                .then((response) => {
                    const data = response.data;
                    this.bannedUsers = data.data || data || [];
                })
                .catch((error) => {
                    console.error('Error loading banned users:', error);
                    this.bannedUsers = [];
                    dialogs.message(this.$t('errorCargarPedidosEliminacion'), {
                        duration: 5,
                        estado: 'error'
                    });
                });
        }
    },
    components: {
        adminNav,
        Loading
    },
    mounted() {
        this.adminApi = new AdminApi();
        this.loadBannedUsers();
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
}
.table tbody td,
.table tbody th {
    padding: 12px 8px;
}
.ajax-loader {
    margin: 20px auto;
    display: block;
}
</style>
