<template>
    <div class="incoming-friend-request-card">
        <router-link
            class="incoming-friend-request-card__avatar"
            :to="profileRoute"
        >
            <div
                class="incoming-friend-request-card__photo circle-box"
                v-imgSrc:profile="user.image"
            ></div>
        </router-link>
        <div class="incoming-friend-request-card__body">
            <router-link
                class="incoming-friend-request-card__name"
                :to="profileRoute"
            >
                {{ user.name }}
            </router-link>
            <p class="incoming-friend-request-card__hint">
                {{ $t('deseaSerTuAmigo') }}
            </p>
            <div class="incoming-friend-request-card__actions">
                <button
                    type="button"
                    class="btn btn-accept-request"
                    :disabled="isRequesting"
                    @click="$emit('accept', user)"
                >
                    <span v-if="!isRequesting">{{ $t('aceptar') }}</span>
                    <span v-else>{{ $t('enProceso') }}</span>
                </button>
                <button
                    type="button"
                    class="btn btn-reject-request"
                    :disabled="isRequesting"
                    @click="$emit('reject', user)"
                >
                    {{ $t('rechazar') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'incoming-friend-request-card',

    props: {
        user: {
            type: Object,
            required: true
        },
        idRequesting: {
            type: Number,
            default: 0
        }
    },

    emits: ['accept', 'reject'],

    computed: {
        isRequesting() {
            return this.idRequesting === this.user.id;
        },
        profileRoute() {
            return {
                name: 'profile',
                params: {
                    id: this.user.id,
                    userProfile: this.user,
                    activeTab: 1
                }
            };
        }
    }
};
</script>

<style scoped>
.incoming-friend-request-card {
    display: flex;
    align-items: flex-start;
    align-self: flex-start;
    gap: 1rem;
    width: fit-content;
    max-width: 100%;
    margin: 0;
    padding: 1rem 1.1rem;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 0 4px 1px #ccc;
}

.incoming-friend-request-card__avatar {
    flex-shrink: 0;
    text-decoration: none;
}

.incoming-friend-request-card__photo {
    width: 50px;
    height: 50px;
    max-width: 50px;
    max-height: 50px;
}

.incoming-friend-request-card__body {
    flex: 0 1 auto;
}

.incoming-friend-request-card__name {
    display: inline-block;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.25;
    color: inherit;
    text-decoration: none;
}

.incoming-friend-request-card__name:hover,
.incoming-friend-request-card__name:focus {
    text-decoration: underline;
}

.incoming-friend-request-card__hint {
    margin: 0.35rem 0 0.85rem;
    font-size: 0.95rem;
    line-height: 1.35;
    color: #555;
}

.incoming-friend-request-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
}

.incoming-friend-request-card__actions .btn {
    min-width: 7.5rem;
    padding: 0.75rem 1.2rem;
    border-radius: 4px;
    border: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
}

.btn-reject-request {
    color: #fff;
    background-color: #d72521;
}

.btn-reject-request:hover:not(:disabled),
.btn-reject-request:focus:not(:disabled) {
    color: #fff;
    background-color: #b81f1c;
}

.btn-reject-request:disabled {
    opacity: 0.7;
}
</style>
