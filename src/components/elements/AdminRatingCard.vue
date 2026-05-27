<template>
    <div class="panel panel-default admin-user-ratings__item admin-rating-card">
        <div class="panel-body">
            <p class="admin-rating-card__meta">
                <span class="text-muted admin-rating-card__id">
                    #{{ rate.id }}
                </span>
                <span
                    class="admin-rating-pill"
                    :class="pillClass"
                >
                    {{ pillLabel }}
                </span>
            </p>
            <p v-if="rate.trip" class="admin-rating-card__trip">
                <router-link
                    :to="{
                        name: 'detail_trip',
                        params: { id: rate.trip.id }
                    }"
                >
                    {{ rate.trip.from_town }} → {{ rate.trip.to_town }}
                </router-link>
            </p>
            <p v-if="counterparty" class="admin-rating-card__user">
                <router-link
                    :to="{
                        name: 'profile',
                        params: { id: counterparty.id }
                    }"
                >
                    {{ counterparty.name }}
                </router-link>
            </p>
            <p v-if="rate.comment" class="admin-rating-card__comment">
                {{ rate.comment }}
            </p>
            <p v-if="rate.reply_comment" class="admin-rating-card__reply">
                <em>{{ $t('adminUsuariosRespuesta') }}:</em>
                {{ rate.reply_comment }}
            </p>
            <template v-if="editing">
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
            <button
                v-else
                type="button"
                class="btn btn-default btn-sm"
                @click="$emit('edit')"
            >
                {{ $t('adminUsuariosEditarFila') }}
            </button>
        </div>
    </div>
</template>

<script>
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
.admin-rating-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
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

.admin-rating-card__comment {
    margin-top: 8px;
    white-space: pre-wrap;
}
</style>
