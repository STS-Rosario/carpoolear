<template>
    <div class="panel panel-default admin-user-ratings__item admin-rating-card">
        <div class="panel-body" :class="{ 'panel-body--compact': !editing }">
            <div v-if="!editing" class="admin-rating-card__row">
                <span class="text-muted admin-rating-card__id">
                    #{{ rate.id }}
                </span>
                <span class="admin-rating-card__sep" aria-hidden="true">·</span>
                <span class="admin-rating-pill" :class="pillClass">
                    {{ pillLabel }}
                </span>
                <template v-if="rate.trip">
                    <span class="admin-rating-card__sep" aria-hidden="true">·</span>
                    <router-link
                        class="admin-rating-card__trip"
                        :to="{
                            name: 'detail_trip',
                            params: { id: rate.trip.id }
                        }"
                    >
                        {{ rate.trip.from_town }} → {{ rate.trip.to_town }}
                    </router-link>
                </template>
                <template v-if="counterparty">
                    <span class="admin-rating-card__sep" aria-hidden="true">·</span>
                    <router-link
                        class="admin-rating-card__user"
                        :to="getAdminUserProfileRoute(counterparty.id)"
                    >
                        {{ counterparty.name }}
                    </router-link>
                </template>
                <template v-if="rate.comment">
                    <span class="admin-rating-card__sep" aria-hidden="true">·</span>
                    <span class="admin-rating-card__comment">{{ rate.comment }}</span>
                </template>
                <template v-if="rate.reply_comment">
                    <span class="admin-rating-card__sep" aria-hidden="true">·</span>
                    <span class="admin-rating-card__reply">
                        <em>{{ $t('adminUsuariosRespuesta') }}:</em>
                        {{ rate.reply_comment }}
                    </span>
                </template>
                <button
                    type="button"
                    class="btn btn-default btn-sm admin-rating-card__edit"
                    @click="$emit('edit')"
                >
                    {{ $t('adminUsuariosEditarFila') }}
                </button>
            </div>
            <template v-else-if="editing">
                <div class="form-group">
                    <label>{{ $t('adminUsuariosCalificacion') }}</label>
                    <select
                        :value="editForm.rating"
                        class="form-control"
                        @input="
                            $emit('update:editForm', {
                                ...editForm,
                                rating: Number($event.target.value)
                            })
                        "
                    >
                        <option :value="1">{{ $t('rateItemPositiva') }}</option>
                        <option :value="0">{{ $t('rateItemNegativa') }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>{{ $t('adminUsuariosComentario') }}</label>
                    <textarea
                        :value="editForm.comment"
                        class="form-control"
                        rows="3"
                        @input="
                            $emit('update:editForm', {
                                ...editForm,
                                comment: $event.target.value
                            })
                        "
                    ></textarea>
                </div>
                <div class="form-group">
                    <label>{{ $t('adminUsuariosRespuesta') }}</label>
                    <textarea
                        :value="editForm.reply_comment"
                        class="form-control"
                        rows="2"
                        @input="
                            $emit('update:editForm', {
                                ...editForm,
                                reply_comment: $event.target.value
                            })
                        "
                    ></textarea>
                </div>
                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="saving"
                    @click="$emit('save')"
                >
                    {{ $t('adminUsuariosGuardar') }}
                </button>
                <button
                    type="button"
                    class="btn btn-default"
                    :disabled="saving"
                    @click="$emit('cancel')"
                >
                    {{ $t('adminUsuariosCancelar') }}
                </button>
            </template>
        </div>
    </div>
</template>

<script>
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';

export default {
    name: 'admin-rating-card',
    props: {
        rate: {
            type: Object,
            required: true
        },
        counterparty: {
            type: Object,
            default: null
        },
        editing: {
            type: Boolean,
            default: false
        },
        editForm: {
            type: Object,
            default: () => ({
                rating: 1,
                comment: '',
                reply_comment: ''
            })
        },
        saving: {
            type: Boolean,
            default: false
        }
    },
    emits: ['edit', 'save', 'cancel', 'update:editForm'],
    methods: {
        getAdminUserProfileRoute
    },
    computed: {
        pillClass() {
            return Number(this.rate.rating) === 1
                ? 'admin-rating-pill--positive'
                : 'admin-rating-pill--negative';
        },
        pillLabel() {
            return Number(this.rate.rating) === 1
                ? this.$t('rateItemPositiva')
                : this.$t('rateItemNegativa');
        }
    }
};
</script>

<style scoped>
.panel-body--compact {
    padding: 8px 12px;
}

.admin-rating-card__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 6px;
    font-size: 14px;
    line-height: 1.4;
}

.admin-rating-card__sep {
    color: #bbb;
    user-select: none;
}

.admin-rating-card__id {
    flex-shrink: 0;
    white-space: nowrap;
}

.admin-rating-card__trip,
.admin-rating-card__user {
    white-space: nowrap;
}

.admin-rating-card__comment,
.admin-rating-card__reply {
    flex: 1 1 120px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.admin-rating-card__reply em {
    font-style: normal;
    color: #777;
}

.admin-rating-card__edit {
    flex-shrink: 0;
    margin-left: auto;
}

.admin-rating-pill {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

.admin-rating-pill--positive {
    background-color: #5cb85c;
    color: #fff;
}

.admin-rating-pill--negative {
    background-color: #d9534f;
    color: #fff;
}
</style>
