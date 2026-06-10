<template>
    <div
        class="message-wrapper"
        :class="wrapperClasses"
    >
        <div class="message media">
            <div class="media-left" v-if="showAuthorMeta">
                <div
                    class="conversation_image circle-box media-object"
                    v-imgSrc:profile="author.image"
                ></div>
            </div>
            <div class="media-body">
                <div class="message_author" v-if="showAuthorMeta">
                    <strong><UserNameWithBadge :user="author" /></strong>
                </div>
                <div
                    class="message_text message_text--markdown"
                    v-html="messageTextHtml"
                ></div>
                <div class="message_meta" v-if="!isSystemMessage">
                    <span class="message_time">{{ date }}</span>
                    <span
                        class="message_seen"
                        v-if="message.no_of_read - 1 > 0"
                        :title="$t('mensajeVistoPorElUsuario')"
                    >
                        <i class="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import dayjs from '../dayjs';
import UserNameWithBadge from './elements/UserNameWithBadge.vue';
import { markdownToHtml } from '../services/markdown';

export default {
    components: {
        UserNameWithBadge
    },
    data() {
        return {};
    },
    computed: {
        messageTextHtml() {
            return markdownToHtml(this.message.text || '');
        },
        author() {
            let user = this.users.find(
                (item) => this.message.user_id === item.id
            );
            return user || {};
        },
        date() {
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            if (dayjs(this.message.created_at).toDate() < today) {
                return dayjs(this.message.created_at).format(
                    'DD/MM/YYYY HH:mm'
                );
            }
            return dayjs(this.message.created_at).format('LT');
        },
        isSystemMessage() {
            return !!this.message.is_system;
        },
        showAuthorMeta() {
            return (
                this.isGroupChat &&
                !this.isSystemMessage &&
                this.author.id &&
                this.author.id !== this.user.id
            );
        },
        wrapperClasses() {
            const classes = [];
            if (this.author.id == this.user.id) {
                classes.push('message-wrapper-me');
            }
            if (this.isSystemMessage) {
                classes.push('message-wrapper--system');
            }
            return classes;
        }
    },
    props: {
        users: {
            type: Array,
            default: () => []
        },
        message: {
            type: Object,
            required: true
        },
        user: {
            type: Object,
            required: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style scoped>
.message_text--markdown >>> p {
    margin: 0 0 0.5em;
}
.message_text--markdown >>> p:last-child {
    margin-bottom: 0;
}
.message_text--markdown >>> strong {
    font-weight: 700;
}
.message_text--markdown >>> em {
    font-style: italic;
}
.message_text--markdown >>> del,
.message_text--markdown >>> s {
    text-decoration: line-through;
}
.message_text--markdown >>> code {
    background: rgba(0, 0, 0, 0.06);
    padding: 0.15em 0.35em;
    border-radius: 3px;
    font-size: 0.9em;
}
.message_text--markdown >>> a {
    color: inherit;
    text-decoration: underline;
}
.message_text--markdown >>> ul,
.message_text--markdown >>> ol {
    margin: 0.25em 0;
    padding-left: 1.25em;
}
.message-wrapper--system {
    text-align: center;
    margin: 0.75em 0;
}
.message-wrapper--system .message_text {
    display: inline-block;
    padding: 0.35em 0.75em;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.06);
    color: #666;
    font-size: 0.9em;
}
</style>
