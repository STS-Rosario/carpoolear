<template>
    <div class="friends-component">
        <div class="clearfix">
            <h2>Buscar contacto</h2>
            <li class="list-group-item">
                <div class="input-group">
                    <input
                        v-model="text"
                        v-debounceInput="onTextChange"
                        type="text"
                        class="form-control"
                        id="input-name"
                        placeholder="Buscar personas"
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
                                        Agregar
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
                                        >Solicitud enviada</span
                                    >
                                </button>
                            </div>
                        </div>
                    </li>
                    <li
                        slot="no-data"
                        class="list-group-item alert alert-warning"
                        role="alert"
                    >
                        No se encontraron contactos.
                    </li>
                    <li
                        slot="loading"
                        class="list-group-item alert alert-info"
                        role="alert"
                    >
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        Buscando contactos..
                    </li>
                </Loading>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import Loading from '../Loading.vue';
import FriendCard from './FriendCard';
import bus from '../../services/bus-event.js';
import spinner from '../Spinner.vue';

export default {
    name: 'friends_request',
    data() {
        return {
            text: '',
            idRequesting: {},
            searchingRequest: null
        };
    },
    computed: {
        ...mapGetters({
            users: 'friends/users'
        })
    },
    methods: {
        ...mapActions({
            search: 'friends/searchUsers',
            request: 'friends/request'
        }),
        onTextChange() {
            this.search(this.text);
        },

        onAddClick(user) {
            this.$set(this.idRequesting, user.id, true);
            this.request(user.id).then(
                () => {
                    this.$set(this.idRequesting, user.id, false);
                },
                () => {
                    this.$set(this.idRequesting, user.id, false);
                }
            );
        },
        onBackClick() {
            this.$router.back();
        }
    },

    mounted() {
        bus.on('back-click', this.onBackClick);
    },

    beforeDestroy() {
        bus.off('back-click', this.onBackClick);
    },
    components: {
        Loading,
        FriendCard,
        spinner
    }
};
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
