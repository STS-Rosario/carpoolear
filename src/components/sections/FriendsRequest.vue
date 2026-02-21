<template>
    <div class="friends-component">
        <div class="clearfix">
            <h2>{{ t('buscarContacto') }}</h2>
            <li class="list-group-item">
                <div class="input-group">
                    <input
                        v-model="text"
                        v-debounceInput="onTextChange"
                        type="text"
                        class="form-control"
                        id="input-name"
                        :placeholder="t('buscarPersonas')"
                    />
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
            </li>
            <template>
                <Loading class="conversation_chat--chats" :data="users">
                    <li
                        v-for="user in users"
                        class="list-group-item conversation_header"
                    >
                        <div class="media">
                            <div class="media-left">
                                <router-link
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            id: user.id,
                                            userProfile: user,
                                            activeTab: 1
                                        }
                                    }"
                                >
                                    <div
                                        class="conversation_image circle-box"
                                        v-imgSrc:profile="user.image"
                                    ></div>
                                </router-link>
                            </div>
                            <div class="media-body">
                                <h4 class="media-heading">
                                    <span class="conversation-title">{{
                                        user.name
                                    }}</span>
                                </h4>
                            </div>
                            <div class="media-right">
                                <button
                                    @click="onAddClick(user)"
                                    :class="
                                        user.state === 'none'
                                            ? 'btn-primary'
                                            : ''
                                    "
                                    class="btn"
                                    :disabled="user.state != 'none'"
                                >
                                    <span
                                        v-if="
                                            user.state == 'none' &&
                                            !idRequesting[user.id]
                                        "
                                    >
                                        {{ t('agregar') }}
                                        <i
                                            class="fa fa-plus"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                    <span
                                        v-if="
                                            idRequesting[user.id] &&
                                            idRequesting[user.id] === true
                                        "
                                    >
                                        <spinner class="blue"></spinner>
                                    </span>
                                    <span v-if="user.state != 'none'"
                                        >{{ t('solicitudEnviada') }}</span
                                    >
                                </button>
                            </div>
                        </div>
                    </li>
                    <template #no-data>
                        <li
                            class="list-group-item alert alert-warning"
                            role="alert"
                        >
                            {{ t('noSeEncontraronContactos') }}
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
                            {{ t('buscandoContactos') }}
                        </li>
                    </template>
                </Loading>
            </template>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useFriendsStore } from '@/stores/friends';
import Loading from '../Loading.vue';
import FriendCard from './FriendCard';
import bus from '../../services/bus-event.js';
import spinner from '../Spinner.vue';

const { t } = useI18n();
const router = useRouter();
const friendsStore = useFriendsStore();

const text = ref('');
const idRequesting = reactive({});
const searchingRequest = ref(null);

const users = computed(() => friendsStore.users);

function onTextChange() {
    friendsStore.searchUsers(text.value);
}

function onAddClick(user) {
    idRequesting[user.id] = true;
    friendsStore.request(user.id).then(
        () => {
            idRequesting[user.id] = false;
        },
        () => {
            idRequesting[user.id] = false;
        }
    );
}

function onBackClick() {
    router.back();
}

onMounted(() => {
    bus.on('back-click', onBackClick);
});

onBeforeUnmount(() => {
    bus.off('back-click', onBackClick);
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
    border: solid 2px #fff;
    width: 132px;
    height: 42px;
    padding: 6px 12px;
    border-radius: 1px;
}
h2 {
    padding-top: 0;
}
.media-body {
    vertical-align: middle;
}
.conversation-title {
    font-size: 15px;
}
.media-right {
    position: absolute;
    right: 5px;
    top: 12px;
    line-height: 52px;
    vertical-align: middle;
}
.btn-primary {
    border-radius: 3px;
    font-size: 12px;
    padding: 0.8em 1.8em;
}
i {
    padding-left: 0.4em;
    vertical-align: 0;
}
@media only screen and (max-width: 768px) {
    .friends-component {
        padding: 0;
    }
}
@media only screen and (max-width: 400px) {
    .input-group-btn:last-child > .btn,
    .input-group-btn:last-child > .btn-group {
        height: 26px;
    }
    .form-control {
        padding: 0.3em 0.8em;
        font-size: 12px;
    }
    .friends-component {
        padding: 0;
    }
    .btn {
        font-size: 10px;
        width: 100px;
    }
    .media-left {
        padding-right: 0;
    }
    .conversation-title {
        font-size: 13px;
    }
    .conversation_image {
        width: 36px;
        height: 36px;
    }
    .media-right[data-v-9c187428] {
        top: 2px;
    }
    .input-group-btn .btn {
        width: 50px;
    }
    .alert {
        font-size: 12px;
    }
}
@media only screen and (min-width: 768px) {
    h2 {
        margin-top: 0;
    }
}
</style>
