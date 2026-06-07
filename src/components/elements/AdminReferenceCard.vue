<template>
    <div class="panel panel-default admin-user-recommendations__item admin-reference-card">
        <div class="panel-body" :class="{ 'panel-body--compact': !editing }">
            <div v-if="!editing" class="admin-reference-card__row">
                <span class="text-muted admin-reference-card__id">
                    #{{ reference.id }}
                </span>
                <span class="admin-reference-card__sep" aria-hidden="true">·</span>
                <router-link
                    v-if="author"
                    class="admin-reference-card__user"
                    :to="getAdminUserProfileRoute(author.id)"
                >
                    {{ author.name }}
                </router-link>
                <span
                    v-else-if="reference.user_id_from"
                    class="admin-reference-card__user"
                >
                    #{{ reference.user_id_from }}
                </span>
                <template v-if="reference.comment">
                    <span class="admin-reference-card__sep" aria-hidden="true">·</span>
                    <span
                        class="admin-reference-card__comment"
                        :title="reference.comment"
                    >
                        {{ reference.comment }}
                    </span>
                </template>
                <button
                    type="button"
                    class="btn btn-default btn-sm admin-reference-card__edit"
                    @click="$emit('edit')"
                >
                    {{ $t('adminUsuariosEditarFila') }}
                </button>
            </div>
            <template v-else>
                <div class="form-group">
                    <label>{{ $t('adminUsuariosComentario') }}</label>
                    <textarea
                        :value="editComment"
                        class="form-control"
                        rows="4"
                        @input="$emit('update:editComment', $event.target.value)"
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
    name: 'admin-reference-card',
    props: {
        reference: {
            type: Object,
            required: true
        },
        author: {
            type: Object,
            default: null
        },
        editing: {
            type: Boolean,
            default: false
        },
        editComment: {
            type: String,
            default: ''
        },
        saving: {
            type: Boolean,
            default: false
        }
    },
    emits: ['edit', 'save', 'cancel', 'update:editComment'],
    methods: {
        getAdminUserProfileRoute
    }
};
</script>

<style scoped>
.panel-body--compact {
    padding: 8px 12px;
}

.admin-reference-card__row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px 6px;
    font-size: 14px;
    line-height: 1.4;
}

.admin-reference-card__sep {
    color: #bbb;
    user-select: none;
}

.admin-reference-card__id {
    flex-shrink: 0;
    white-space: nowrap;
}

.admin-reference-card__user {
    white-space: nowrap;
}

.admin-reference-card__comment {
    flex: 1 1 120px;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.admin-reference-card__edit {
    flex-shrink: 0;
    margin-left: auto;
}
</style>
