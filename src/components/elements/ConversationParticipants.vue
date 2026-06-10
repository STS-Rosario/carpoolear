<template>
    <div class="conversation-participants" v-if="users.length">
        <button
            type="button"
            class="trip_actions-description-toggle conversation-participants__toggle"
            :aria-expanded="expanded ? 'true' : 'false'"
            @click="expanded = !expanded"
        >
            {{
                expanded
                    ? $t('groupChatHideParticipants')
                    : $t('groupChatViewParticipants')
            }}
            <span aria-hidden="true">{{ expanded ? '∨' : '∧' }}</span>
        </button>
        <div v-show="expanded" class="conversation-participants__list">
            <div
                v-for="participant in users"
                :key="participant.id"
                class="conversation-participants__item"
            >
                <router-link
                    :to="{ name: 'profile', params: { id: participant.id } }"
                    class="conversation-participants__profile"
                >
                    <span
                        class="conversation_image circle-box conversation-participants__photo"
                        v-imgSrc:profile="participant.image"
                    ></span>
                    <span class="conversation-participants__name">
                        <UserNameWithBadge
                            :name="participant.name"
                            :showBadge="!!participant.identity_validated_at"
                        />
                    </span>
                </router-link>
                <UserRatingsCounts
                    :ratings="{
                        positive: participant.positive_ratings,
                        negative: participant.negative_ratings
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script>
import UserNameWithBadge from './UserNameWithBadge.vue';
import UserRatingsCounts from './UserRatingsCounts.vue';

export default {
    name: 'ConversationParticipants',
    components: {
        UserNameWithBadge,
        UserRatingsCounts
    },
    props: {
        users: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            expanded: false
        };
    }
};
</script>

<style scoped>
.conversation-participants {
    margin-bottom: 0.75rem;
}
.conversation-participants__toggle {
    background: none;
    border: 0;
    padding: 0;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
}
.conversation-participants__list {
    margin-top: 0.75rem;
}
.conversation-participants__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}
.conversation-participants__profile {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
}
.conversation-participants__photo {
    width: 32px;
    height: 32px;
}
.conversation-participants__name {
    font-weight: 600;
}
</style>
