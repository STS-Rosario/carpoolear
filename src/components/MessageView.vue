<template>
    <div
        class="message-wrapper"
        v-bind:class="[author.id == user.id ? 'message-wrapper-me' : '']"
    >
        <div class="message media">
            <div class="media-left" v-if="grupalChat">
                <div
                    class="conversation_image circle-box media-object"
                    v-imgSrc:profile="user.image"
                    v-if="author.id != user.id"
                ></div>
            </div>
            <div class="media-body">
                <div
                    class="message_author"
                    v-if="author.id != user.id && grupalChat"
                >
                    <strong><UserNameWithBadge :user="author" /></strong>
                </div>
                <div
                    class="message_text message_text--markdown"
                    v-html="messageTextHtml"
                ></div>
                <div class="message_meta">
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
import moment from 'moment';
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
            if (moment(this.message.created_at)._d < today) {
                return moment(this.message.created_at).format(
                    'DD/MM/YYYY HH:mm'
                );
            }
            return moment(this.message.created_at).format('LT');
        },
        grupalChat() {
            return false;
        }
    },
    props: ['users', 'message', 'user']
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
</style>
