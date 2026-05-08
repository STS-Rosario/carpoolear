<template>
    <AdminLayout>
        <h3>{{ $t('adminMaintenanceTitle') }}</h3>
        <p v-if="loading" class="alert alert-info">Cargando…</p>
        <p v-else-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</p>

        <div class="panel panel-default admin-maint-panel">
            <div class="panel-heading">
                <strong>Estado manual</strong>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="checkbox-inline">
                        <input v-model="manualForm.active" type="checkbox" />
                        Mantenimiento activo (manual)
                    </label>
                </div>
                <div v-if="manualForm.active" class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                            <label>Modo</label>
                            <select v-model="manualForm.mode" class="form-control">
                                <option value="strict">Estricto</option>
                                <option value="flexible">Flexible (solo admins)</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                            <label>Mensaje</label>
                            <textarea
                                v-model="manualForm.message"
                                class="form-control"
                                rows="2"
                            ></textarea>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="form-group">
                            <label>Fin opcional (hora local)</label>
                            <input
                                v-model="manualForm.endsAtLocal"
                                class="form-control"
                                type="datetime-local"
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="loading"
                    @click="saveManual"
                >
                    Guardar estado
                </button>
                <div
                    v-if="serverState"
                    class="admin-maint-live-status well well-sm"
                >
                    <p class="admin-maint-live-status__title">
                        <strong>{{ $t('adminMaintenanceLiveStatusTitle') }}</strong>
                    </p>
                    <p class="admin-maint-live-status__help text-muted">
                        {{ $t('adminMaintenanceLiveStatusHelp') }}
                    </p>
                    <dl class="admin-maint-live-status__dl">
                        <dt>{{ $t('adminMaintenanceFieldActiveLabel') }}</dt>
                        <dd>{{ liveActiveDescription }}</dd>
                        <template v-if="serverState.is_active">
                            <dt>{{ $t('adminMaintenanceFieldModeLabel') }}</dt>
                            <dd>{{ liveModeDescription }}</dd>
                            <dt>{{ $t('adminMaintenanceFieldSourceLabel') }}</dt>
                            <dd>{{ liveSourceDescription }}</dd>
                        </template>
                    </dl>
                </div>
            </div>
        </div>

        <div class="panel panel-default admin-maint-panel">
            <div class="panel-heading">
                <strong>Ventanas programadas</strong>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Inicio (local)</label>
                            <input
                                v-model="newSchedule.startsAtLocal"
                                class="form-control"
                                type="datetime-local"
                            />
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Fin (opcional)</label>
                            <input
                                v-model="newSchedule.endsAtLocal"
                                class="form-control"
                                type="datetime-local"
                            />
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>Modo</label>
                            <select v-model="newSchedule.mode" class="form-control">
                                <option value="strict">Estricto</option>
                                <option value="flexible">Flexible</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-9">
                        <div class="form-group">
                            <label>Mensaje</label>
                            <input
                                v-model="newSchedule.message"
                                class="form-control"
                                type="text"
                            />
                        </div>
                    </div>
                    <div class="col-sm-3">
                        <div class="form-group">
                            <label>&nbsp;</label>
                            <button
                                type="button"
                                class="btn btn-default btn-block"
                                :disabled="loading"
                                @click="createSchedule"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="!schedules.length" class="alert alert-warning">
                    No hay ventanas pendientes.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-striped table-condensed">
                        <thead>
                            <tr>
                                <th>Inicio (UTC)</th>
                                <th>Fin (UTC)</th>
                                <th>Modo</th>
                                <th>Mensaje</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in schedules" :key="row.id">
                                <td>{{ row.starts_at }}</td>
                                <td>{{ row.ends_at || '—' }}</td>
                                <td>{{ row.mode }}</td>
                                <td>{{ row.message }}</td>
                                <td class="text-right">
                                    <button
                                        type="button"
                                        class="btn btn-xs btn-danger"
                                        :disabled="loading"
                                        @click="cancelSchedule(row)"
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="panel panel-default admin-maint-panel">
            <div class="panel-heading">
                <strong>Registro de acciones (últimos 100)</strong>
            </div>
            <div class="panel-body">
                <div v-if="!auditLogs.length" class="text-muted">
                    Sin entradas.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-condensed">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Acción</th>
                                <th>Fecha</th>
                                <th>Meta</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="log in auditLogs" :key="log.id">
                                <td>{{ log.id }}</td>
                                <td>{{ log.user_id }}</td>
                                <td>{{ log.action }}</td>
                                <td>{{ log.created_at }}</td>
                                <td><pre class="admin-maint-meta">{{ formatMeta(log.meta) }}</pre></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminApi from '../../services/api/Admin';
import dayjs from '../../dayjs';

export default {
    name: 'admin-maintenance',
    components: { AdminLayout },
    data() {
        return {
            adminApi: null,
            loading: false,
            errorMsg: '',
            schedules: [],
            serverState: null,
            auditLogs: [],
            manualForm: {
                active: false,
                mode: 'flexible',
                message: '',
                endsAtLocal: ''
            },
            newSchedule: {
                startsAtLocal: '',
                endsAtLocal: '',
                message: '',
                mode: 'flexible'
            }
        };
    },
    created() {
        this.adminApi = new AdminApi();
    },
    mounted() {
        this.refreshAll();
    },
    computed: {
        liveActiveDescription() {
            if (!this.serverState) {
                return '';
            }
            return this.serverState.is_active
                ? this.$t('adminMaintenanceActiveYes')
                : this.$t('adminMaintenanceActiveNo');
        },
        liveModeDescription() {
            if (!this.serverState || !this.serverState.is_active) {
                return '';
            }
            const m = this.serverState.mode;
            if (m === 'strict') {
                return this.$t('adminMaintenanceModeStrictFull');
            }
            if (m === 'flexible') {
                return this.$t('adminMaintenanceModeFlexibleFull');
            }
            return this.$t('adminMaintenanceModeUnknownFull');
        },
        liveSourceDescription() {
            if (!this.serverState || !this.serverState.is_active) {
                return '';
            }
            const s = this.serverState.source;
            if (s === 'manual') {
                return this.$t('adminMaintenanceSourceManualFull');
            }
            if (s === 'schedule') {
                return this.$t('adminMaintenanceSourceScheduleFull');
            }
            return this.$t('adminMaintenanceSourceUnknownFull');
        }
    },
    methods: {
        formatMeta(meta) {
            if (!meta) {
                return '';
            }
            try {
                return JSON.stringify(meta, null, 2);
            } catch (e) {
                return String(meta);
            }
        },
        toIsoMaybe(localStr) {
            if (!localStr) {
                return null;
            }
            const d = dayjs(localStr);
            return d.isValid() ? d.toISOString() : null;
        },
        firstValidationMessage(errors) {
            if (!errors || typeof errors !== 'object') {
                return '';
            }
            const keys = Object.keys(errors);
            if (!keys.length) {
                return '';
            }
            const arr = errors[keys[0]];
            return Array.isArray(arr) && arr.length ? arr[0] : '';
        },
        refreshAll() {
            this.loading = true;
            this.errorMsg = '';
            Promise.all([
                this.adminApi.getMaintenanceSchedules(),
                this.adminApi.getMaintenanceState(),
                this.adminApi.getMaintenanceAuditLogs()
            ])
                .then(([schedRes, stateRes, auditRes]) => {
                    this.schedules = (schedRes && schedRes.data) || [];
                    this.serverState = (stateRes && stateRes.data) || null;
                    this.auditLogs = (auditRes && auditRes.data) || [];
                    if (this.serverState) {
                        this.manualForm.active = !!this.serverState.is_active;
                        this.manualForm.mode =
                            this.serverState.mode || 'flexible';
                        this.manualForm.message =
                            this.serverState.message || '';
                        if (this.serverState.ends_at) {
                            this.manualForm.endsAtLocal = dayjs(
                                this.serverState.ends_at
                            ).format('YYYY-MM-DDTHH:mm');
                        } else {
                            this.manualForm.endsAtLocal = '';
                        }
                    }
                })
                .catch(({ data }) => {
                    this.errorMsg =
                        (data && data.message) ||
                        'No se pudo cargar mantenimiento.';
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        saveManual() {
            this.loading = true;
            this.errorMsg = '';
            const endsIso = this.manualForm.active
                ? this.toIsoMaybe(this.manualForm.endsAtLocal)
                : null;
            const payload = this.manualForm.active
                ? {
                      active: true,
                      mode: this.manualForm.mode,
                      message: this.manualForm.message,
                      ends_at: endsIso
                  }
                : { active: false };
            this.adminApi
                .putMaintenanceState(payload)
                .then(() => this.refreshAll())
                .catch(({ data }) => {
                    const msg =
                        this.firstValidationMessage(data && data.errors) ||
                        (data && data.message) ||
                        'Error guardando estado.';
                    this.errorMsg = msg;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        createSchedule() {
            this.loading = true;
            this.errorMsg = '';
            const startsIso = this.toIsoMaybe(this.newSchedule.startsAtLocal);
            if (!startsIso) {
                this.errorMsg = 'Indicá fecha y hora de inicio.';
                this.loading = false;
                return;
            }
            const endsIso = this.toIsoMaybe(this.newSchedule.endsAtLocal);
            const payload = {
                starts_at: startsIso,
                ends_at: endsIso,
                message: this.newSchedule.message,
                mode: this.newSchedule.mode
            };
            this.adminApi
                .createMaintenanceSchedule(payload)
                .then(() => {
                    this.newSchedule = {
                        startsAtLocal: '',
                        endsAtLocal: '',
                        message: '',
                        mode: 'flexible'
                    };
                    return this.refreshAll();
                })
                .catch(({ data }) => {
                    const msg =
                        this.firstValidationMessage(data && data.errors) ||
                        (data && data.message) ||
                        'Error creando ventana.';
                    this.errorMsg = msg;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        cancelSchedule(row) {
            if (
                !window.confirm(
                    '¿Cancelar esta ventana programada? No volverá a aplicarse.'
                )
            ) {
                return;
            }
            this.loading = true;
            this.errorMsg = '';
            this.adminApi
                .cancelMaintenanceSchedule(row.id)
                .then(() => this.refreshAll())
                .catch(({ data }) => {
                    this.errorMsg =
                        (data && data.message) ||
                        'Error cancelando ventana.';
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }
};
</script>

<style scoped>
.admin-maint-panel {
    margin-bottom: 18px;
}

.admin-maint-meta {
    font-size: 11px;
    margin: 0;
    white-space: pre-wrap;
    max-width: 280px;
}

.admin-maint-live-status {
    margin-top: 16px;
    margin-bottom: 0;
}

.admin-maint-live-status__title {
    margin-bottom: 6px;
}

.admin-maint-live-status__help {
    margin-bottom: 12px;
    font-size: 13px;
}

.admin-maint-live-status__dl {
    margin-bottom: 0;
}

.admin-maint-live-status__dl dt {
    margin-top: 10px;
    font-weight: 600;
    color: #555;
}

.admin-maint-live-status__dl dd {
    margin-left: 0;
    margin-bottom: 4px;
}
</style>
