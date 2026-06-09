<template>
    <div class="friend-list-card" v-if="user">
        <router-link class="friend-list-card__avatar" :to="profileRoute">
            <div
                class="friend-list-card__photo circle-box"
                v-imgSrc:profile="user.image"
            ></div>
        </router-link>
        <div class="friend-list-card__body">
            <router-link class="friend-list-card__name" :to="profileRoute">
                {{ user.name }}
            </router-link>
        </div>
        <button
            type="button"
            class="friend-list-card__remove"
            :aria-label="$t('quitarAmigo')"
            :disabled="isRemoving"
            @click="$emit('delete', user)"
        >
            <i
                v-if="!isRemoving"
                class="fa fa-times"
                aria-hidden="true"
            ></i>
            <span v-else>{{ $t('enProceso') }}</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'friend_list_card',

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

    emits: ['delete'],

    computed: {
        isRemoving() {
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
.friend-list-card {
    display: flex;
    align-items: center;
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

.friend-list-card__avatar {
    flex-shrink: 0;
    text-decoration: none;
}

.friend-list-card__photo {
    width: 50px;
    height: 50px;
    max-width: 50px;
    max-height: 50px;
}

.friend-list-card__body {
    flex: 0 1 auto;
    min-width: 0;
}

.friend-list-card__name {
    display: inline-block;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.25;
    color: inherit;
    text-decoration: none;
}

.friend-list-card__name:hover,
.friend-list-card__name:focus {
    text-decoration: underline;
}

.friend-list-card__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1;
    cursor: pointer;
    flex-shrink: 0;
}

.friend-list-card__remove:hover:not(:disabled),
.friend-list-card__remove:focus:not(:disabled) {
    background-color: #e8ecf0;
    color: #374151;
}

.friend-list-card__remove:disabled {
    cursor: default;
    opacity: 0.7;
}
</style>
