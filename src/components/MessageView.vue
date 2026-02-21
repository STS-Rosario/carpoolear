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
                <div class="message_text">
                    {{ message.text }}
                </div>
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
<script setup>
import { computed } from 'vue';
import moment from 'moment';
import UserNameWithBadge from './elements/UserNameWithBadge.vue';

const props = defineProps({
    users: {
        required: true
    },
    message: {
        required: true
    },
    user: {
        required: true
    }
});

const author = computed(() => {
    let u = props.users.find(
        (item) => props.message.user_id === item.id
    );
    return u || {};
});

const date = computed(() => {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    if (moment(props.message.created_at)._d < today) {
        return moment(props.message.created_at).format(
            'DD/MM/YYYY HH:mm'
        );
    }
    return moment(props.message.created_at).format('LT');
});

const grupalChat = computed(() => {
    return false;
});
</script>
