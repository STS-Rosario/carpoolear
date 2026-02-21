<template>
    <div
        :class="
            config.module_coordinate_by_message
                ? 'module--coordinate-by-message'
                : ''
        "
    >
        <CoordinateTrip v-show="isMobile"></CoordinateTrip>
        <div
            class="conversation-component container"
            :class="config.enable_footer ? 'with-footer' : 'without-footer'"
        >
            <div class="row">
                <div class="col-sm-8 col-md-8" :class="{ 'hidden-xs': hide }">
                    <div class="conversation_list">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <div class="input-group">
                                    <input
                                        v-jump:click="'btn-search'"
                                        v-model="textSearch"
                                        v-debounceInput="onSearchUser"
                                        type="text"
                                        class="form-control"
                                        :placeholder="t('escribeUnNombreYPresionaBuscar')"
                                    />
                                    <span class="input-group-btn">
                                        <button
                                            v-jump
                                            id="btn-search"
                                            class="btn btn-default"
                                            type="button"
                                            @click="onSearchUser"
                                        >
                                            <i
                                                class="fa fa-search"
                                                aria-hidden="true"
                                            ></i>
                                        </button>
                                    </span>
                                </div>
                            </li>
                            <template v-if="textSearch.length == 0">
                                <Loading
                                    class="conversation_chat--chats"
                                    :data="conversations"
                                >
                                    <li
                                        v-for="conversation in conversations"
                                        class="list-group-item conversation_header"
                                        @click="
                                            onChangeConversation(conversation)
                                        "
                                        :class="{
                                            unread: conversation.unread,
                                            active:
                                                selectedId != null &&
                                                conversation.id === selectedId
                                        }"
                                        :key="conversation.id"
                                    >
                                        <div class="media">
                                            <div class="media-left">
                                                <div
                                                    class="conversation_image circle-box"
                                                    v-imgSrc:conversation="
                                                        conversation.image
                                                    "
                                                ></div>
                                            </div>
                                            <div class="media-body">
                                                <h4 class="media-heading">
                                                    <span
                                                        class="conversation-title"
                                                    >
                                                        <UserNameWithBadge
                                                            :name="conversation.title"
                                                            :showBadge="!!conversation.other_user_identity_validated_at"
                                                        />
                                                    </span>
                                                </h4>
                                                <span
                                                    class="conversation-lastmessage"
                                                    v-if="
                                                        conversation.last_message
                                                    "
                                                >
                                                    {{
                                                        conversation
                                                            .last_message.text
                                                            ? conversation.last_message.text.substring(
                                                                  0,
                                                                  conversation
                                                                      .last_message
                                                                      .text
                                                                      .length <
                                                                      50
                                                                      ? conversation
                                                                            .last_message
                                                                            .text
                                                                            .length
                                                                      : 50
                                                              ) +
                                                              (conversation
                                                                  .last_message
                                                                  .text.length <
                                                              50
                                                                  ? ''
                                                                  : ' ...')
                                                            : ''
                                                    }}
                                                </span>
                                                <span
                                                    class="conversation-timestamp"
                                                    v-if="false"
                                                >
                                                    {{
                                                        formatDate(conversation.updated_at, 'h:mm a')
                                                    }}
                                                </span>
                                            </div>
                                            <div
                                                class="media-right"
                                                v-if="conversation.last_message"
                                            >
                                                {{
                                                    $moment(
                                                        conversation
                                                            .last_message
                                                            .created_at
                                                    ).fromNow()
                                                }}
                                            </div>
                                        </div>
                                    </li>
                                    <li
                                        v-if="moreConversations"
                                        class="list-group-item"
                                    >
                                        <button
                                            class="btn btn-primary btn-block"
                                            @click="nextPage"
                                        >
                                            {{ t('masResultados') }}
                                        </button>
                                    </li>
                                    <template #no-data>
                                        <li
                                            class="list-group-item alert alert-warning"
                                            role="alert"
                                        >
                                            {{ t('noTienesConversaciones') }}
                                        </li>
                                    </template>
                                    <template #loading>
                                        <li
                                            class="list-group-item alert alert-info"
                                            role="alert"
                                        >
                                            <img
                                                src="https://carpoolear.com.ar/static/img/loader.gif"
                                                alt=""
                                                class="ajax-loader"
                                            />
                                            {{ t('cargandoConversaciones') }}
                                        </li>
                                    </template>
                                </Loading>
                            </template>
                            <template v-else>
                                <Loading
                                    class="conversation_chat--search"
                                    :data="users"
                                >
                                    <li
                                        v-for="u in users"
                                        class="list-group-item"
                                        @click="createConversationHandler(u)"
                                        v-bind:key="u.id"
                                    >
                                        <div
                                            class="conversation_image circle-box"
                                            v-imgSrc:profile="u.image"
                                        ></div>
                                        <UserNameWithBadge :user="u" />
                                    </li>
                                    <template #no-data>
                                        <li
                                            class="list-group-item alert alert-warning"
                                            role="alert"
                                        >
                                            {{ t('noHayConcidiencias') }}
                                        </li>
                                    </template>
                                    <template #loading>
                                        <li
                                            class="list-group-item alert alert-info"
                                            role="alert"
                                        >
                                            {{ t('tipeaUnNombreYBusca') }}
                                        </li>
                                    </template>
                                </Loading>
                            </template>
                        </ul>
                    </div>
                </div>
                <div class="col-xs-24 col-sm-16 col-md-16">
                    <div class="conversation-container">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConversationsStore } from '@/stores/conversations';
import { useDeviceStore } from '@/stores/device';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/composables/useFormatters';
import { Thread } from '../../classes/Threads.js';
import Loading from '../Loading.vue';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import CoordinateTrip from '../elements/CoordinateTrip';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const conversationsStore = useConversationsStore();
const deviceStore = useDeviceStore();
const authStore = useAuthStore();

const textSearch = ref('');
let thread = null;

const conversations = computed(() => conversationsStore.list);
const moreConversations = computed(() => conversationsStore.listMorePage);
const users = computed(() => conversationsStore.users);
const selectedId = computed(() => conversationsStore.selectedId);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

const hide = computed(() => {
    return route.meta.hide;
});

const nextPage = () => {
    conversationsStore.listSearch({ next: true });
};

const onSearchUser = () => {
    conversationsStore.getUserList(textSearch.value);
};

const createConversationHandler = (user) => {
    conversationsStore.createConversation(user)
        .then((c) => {
            textSearch.value = '';
            conversationsStore.clearUserList();
            router.push({
                name: 'conversation-chat',
                params: { id: c.id }
            });
        })
        .catch(() => {});
};

const onChangeConversation = (conversation) => {
    router.push({
        name: 'conversation-chat',
        params: { id: conversation.id }
    });
};

onBeforeUnmount(() => {
    if (thread) {
        thread.stop();
    }
    conversationsStore.select(null);
});

watch(() => route.fullPath, () => {
    if (!route.meta.hide) {
        conversationsStore.select(null);
    }
});

watch(isMobile, () => {
    if (!isMobile.value) {
        router.push({ name: 'conversation-chat' });
    }
});

watch(textSearch, (newValue, oldValue) => {
    if (oldValue.length === 0 && newValue.length > 0) {
        conversationsStore.clearUserList();
    }
});

onMounted(() => {
    conversationsStore.listSearch();
    if (!config.value.web_push_notification || window.Notification.permission !== 'granted') {
        thread = new Thread(() => {
            conversationsStore.getUnreaded();
        });
        thread.run(20000);
    }

    if (!isMobile.value) {
        router.push({ name: 'conversation-chat' });
    }
});
</script>

<style>
.app-container.white {
    background-color: #fff;
}
.conversation-component.container {
    width: auto;
}
.conversation_chat p,
.message_text {
    font-size: 13px;
}
.conversation_chat h2 {
    font-size: 25px;
    margin-top: 0.2em;
    margin-bottom: 0;
}
.chat_last_connection {
    margin: 0.4rem 0;
}

.btn-full-width {
    width: 100%;
    margin: 0 0 0.8em 0;
}

.message-wrapper {
    text-align: left;
    margin-bottom: 0.4em;
}
.conversation-component.container {
    margin-bottom: 3rem;
}
.conversation_chat--search > li {
    color: #009ce1;
    cursor: pointer;
}
.conversation_chat--search > li:hover {
    background-color: #eee;
}
.conversation_chat--search li.list-group-item:last-child {
    border-bottom-width: 1px;
}
.conversation-title {
    font-size: 14px;
}
.list-group-item {
    font-size: 14px;
}
.list-group-item.unread,
.list-group-item.unread:hover,
.list-group-item.unread:focus {
    background: rgba(254, 153, 0, 0.25);
}

@media only screen and (min-width: 768px) {
    .conversation-title {
        font-size: 18px;
    }
    .conversation_chat p,
    .message_text {
        font-size: 14px;
    }
    .conversation_chat h2 {
        font-size: 22px;
    }
    .conversation_chat p.chat_last_connection {
        font-size: 13px;
        margin: 0;
    }
    .app-container {
        background-color: transparent;
    }
    .conversation_chat,
    .conversation_chat > div,
    .conversation-component.container .row,
    .conversation-component > .row > div,
    .conversation-container,
    .conversation_list,
    .conversation_list .list-group {
        height: 100%;
    }
    .conversation_list {
        height: 85%;
    }
    .conversation_chat .list-group-item:nth-child(2) {
        height: calc(100% - 99px);
        overflow-y: auto;
    }
    .conversation-component.container {
        padding-left: 10px;
        padding-right: 10px;
        overflow-y: hidden;
        height: calc(100vh - 150px);
    }
    .without-footer.conversation-component.container {
        height: calc(100vh - 15px);
    }
    .conversation-component > .row {
        padding-left: 20px;
        padding-right: 20px;
    }
    .conversation_chat--search {
        height: calc(100% - 66px);
        overflow-y: auto;
        border-bottom: 1px solid #ddd;
    }
}
.media-right {
    font-size: 10px;
}
</style>
