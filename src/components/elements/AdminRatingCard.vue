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
                <AppButton
                    variant="secondary"
                    size="sm"
                    class="admin-rating-card__edit"
                    @click="$emit('edit')"
                >
                    {{ $t('adminUsuariosEditarFila') }}
                </AppButton>
            </div>
            <template v-else-if="editing">
                <AppField :label="$t('adminUsuariosCalificacion')">
                    <select
                        :value="editForm.rating"
                        class="admin-rating-card__select"
                        @input="
                            $emit('update:editForm', {
                                ...editForm,
                                rating: Number($event.target.value)
                            })
                        "
                    >
                        <option :value="1">{{ $t('rateItemPositiva') }}</option>
                        <option :value="2">{{ $t('rateItemNeutral') }}</option>
                        <option :value="0">{{ $t('rateItemNegativa') }}</option>
                    </select>
                </AppField>
                <AppTextarea
                    :label="$t('adminUsuariosComentario')"
                    :model-value="editForm.comment"
                    :rows="3"
                    @update:model-value="
                        $emit('update:editForm', {
                            ...editForm,
                            comment: $event
                        })
                    "
                />
                <AppTextarea
                    :label="$t('adminUsuariosRespuesta')"
                    :model-value="editForm.reply_comment"
                    :rows="2"
                    @update:model-value="
                        $emit('update:editForm', {
                            ...editForm,
                            reply_comment: $event
                        })
                    "
                />
                <AppButton
                    variant="primary"
                    :disabled="saving"
                    @click="$emit('save')"
                >
                    {{ $t('adminUsuariosGuardar') }}
                </AppButton>
                <AppButton
                    variant="secondary"
                    :disabled="saving"
                    @click="$emit('cancel')"
                >
                    {{ $t('adminUsuariosCancelar') }}
                </AppButton>
            </template>
        </div>
    </div>
</template>

<script>
import AppButton from '../ui/AppButton.vue';
import AppField from '../ui/AppField.vue';
import AppTextarea from '../ui/AppTextarea.vue';
import { getAdminUserProfileRoute } from '../../utils/adminProfileRoute';
import {
    isNegativeRating,
    isNeutralRating,
    isPositiveRating
} from '../../utils/tripRating';

export default {
    name: 'admin-rating-card',
    components: {
        AppButton,
        AppField,
        AppTextarea
    },
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
            if (isPositiveRating(this.rate.rating)) {
                return 'admin-rating-pill--positive';
            }
            if (isNeutralRating(this.rate.rating)) {
                return 'admin-rating-pill--neutral';
            }
            return 'admin-rating-pill--negative';
        },
        pillLabel() {
            if (isPositiveRating(this.rate.rating)) {
                return this.$t('rateItemPositiva');
            }
            if (isNeutralRating(this.rate.rating)) {
                return this.$t('rateItemNeutral');
            }
            return this.$t('rateItemNegativa');
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

.admin-rating-card__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.admin-rating-card__select:focus {
    outline: none;
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

.admin-rating-pill--neutral {
    background-color: #999;
    color: #fff;
}

.admin-rating-pill--negative {
    background-color: #d9534f;
    color: #fff;
}
</style>
