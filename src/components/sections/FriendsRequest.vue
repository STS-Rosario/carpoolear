<template>
    <div class="friends-component">
        <div class="clearfix">
            <h2>{{ $t('buscarContacto') }}</h2>
            <div class="friends-request__search">
                <AppInput
                    id="input-name"
                    class="friends-request__search-input"
                    v-model="text"
                    :placeholder="$t('buscarPersonas')"
                    @update:modelValue="onSearchInput"
                />
                <AppButton
                    variant="secondary"
                    icon-left="fa fa-search"
                    icon-only
                    :aria-label="$t('buscarPersonas')"
                    @click="onTextChange"
                />
            </div>
            <template v-if="text.length > 0">
                <Loading class="conversation_chat--chats" :data="users">
                    <li
                        v-for="user in users"
                        :key="user.id"
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
                                            : 'btn-friend-request-sent'
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
                                        {{ $t('agregar') }}
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
                                    <span v-if="user.state != 'none'">{{
                                        $t('solicitudAmistadEnviada')
                                    }}</span>
                                </button>
                            </div>
                        </div>
                    </li>
                    <template #no-data><li
                        class="list-group-item alert alert-warning"
                        role="alert"
                    >
                        {{ $t('noSeEncontraronContactos') }}
                    </li></template>
                    <template #loading><li
                        class="list-group-item alert alert-info"
                        role="alert"
                    >
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('buscandoContactos') }}
                    </li></template>
                </Loading>
            </template>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useFriendsStore } from '../../stores/friends';
import Loading from '../Loading.vue';
import FriendCard from './FriendCard';
import bus from '../../services/bus-event.js';
import spinner from '../Spinner.vue';
import AppButton from '../ui/AppButton.vue';
import AppInput from '../ui/AppInput.vue';
import { debounce } from '../../services/utility';

export default {
    name: 'friends_request',
    data() {
        return {
            text: '',
            idRequesting: {},
            searchingRequest: null,
            debouncedSearch: null
        };
    },
    computed: {
        ...mapState(useFriendsStore, {
            users: 'users'
        })
    },
    created() {
        this.debouncedSearch = debounce(() => {
            this.onTextChange();
        }, 800);
    },
    methods: {
        ...mapActions(useFriendsStore, {
            search: 'searchUsers',
            request: 'request',
            clearUserSearch: 'clearUserSearch'
        }),
        onSearchInput() {
            if (this.debouncedSearch) {
                this.debouncedSearch();
            }
        },
        onTextChange() {
            this.search(this.text);
        },

        onAddClick(user) {
            this.idRequesting[user.id] = true;
            this.request(user.id).then(
                () => {
                    this.idRequesting[user.id] = false;
                },
                () => {
                    this.idRequesting[user.id] = false;
                }
            );
        },
        onBackClick() {
            this.$router.back();
        }
    },

    mounted() {
        this.clearUserSearch();
        bus.on('back-click', this.onBackClick);
    },

    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    },
    components: {
        Loading,
        FriendCard,
        spinner,
        AppButton,
        AppInput
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.friends-request__search {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    margin-bottom: 1rem;
}
.friends-request__search-input {
    flex: 1;
    min-width: 0;
}
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
.btn-friend-request-sent {
    border-radius: 3px;
    font-size: 12px;
    padding: 0.8em 1.8em;
    background-color: #e67e22;
    border-color: #e67e22;
    color: #fff;
}
.btn-friend-request-sent:disabled {
    background-color: #e67e22;
    border-color: #e67e22;
    color: #fff;
    opacity: 1;
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
