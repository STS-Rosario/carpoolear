<template>
    <div class="friends-component">
        <h1 class="friends-page-heading">{{ $t('amigos') }}</h1>
        <div class="clearfix">
            <Loading :data="pendings" :hideOnEmpty="true">
                <template #title
                    ><h2 class="friends-section-heading">{{
                        $t('solicitudesDeAmistad')
                    }}</h2></template
                >
                <div id="incoming-friend-requests-list" class="incoming-friend-requests-list">
                    <IncomingFriendRequestCard
                        v-for="user in pendings"
                        :key="user.id"
                        :user="user"
                        :id-requesting="idRequesting"
                        @accept="onAcceptClick"
                        @reject="onRejectClick"
                    />
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHaySolicitudesNuevas') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoSolicitudes') }}
                </p></template>
            </Loading>
        </div>

        <div class="clearfix">
            <Loading :data="sentPendings" :hideOnEmpty="true">
                <template #title
                    ><h2 class="friends-section-heading">{{
                        $t('solicitudesDeAmigoPendientes')
                    }}</h2></template
                >
                <div id="sent-pending-list" class="sent-pending-list">
                    <div
                        v-for="user in sentPendings"
                        :key="user.id"
                        class="sent-pending-chip"
                    >
                        <router-link
                            class="sent-pending-chip__name"
                            :to="{
                                name: 'profile',
                                params: {
                                    id: user.id,
                                    userProfile: user,
                                    activeTab: 1
                                }
                            }"
                        >
                            {{ user.name }}
                        </router-link>
                        <button
                            type="button"
                            class="sent-pending-chip__remove"
                            :aria-label="$t('quitarSolicitudAmigo')"
                            :disabled="idRequesting == user.id"
                            @click="onCancelRequestClick(user)"
                        >
                            <i
                                v-if="idRequesting != user.id"
                                class="fa fa-times"
                                aria-hidden="true"
                            ></i>
                            <span v-else>{{ $t('enProceso') }}</span>
                        </button>
                    </div>
                </div>
                <template #loading
                    ><p class="alert alert-info" role="alert">
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoSolicitudes') }}
                    </p></template
                >
            </Loading>
        </div>
        <h2 class="friends-section-heading">{{ $t('misAmigos') }}</h2>
        <div class="friends-toolbar form-inline-with-margin">
            <div class="friend-form form-inline">
                <div class="form-group">
                    <label for="input-name">{{ $t('filtrarPorNombre') }}</label>
                    <input
                        v-on:input="onTextChange"
                        v-model="text"
                        type="text"
                        class="form-control"
                        id="input-name"
                        :placeholder="$t('ingresarNombre')"
                    />
                </div>
            </div>
            <router-link
                :to="{ name: 'friends_search' }"
                tag="button"
                class="btn btn-primary search-more"
            >
                {{ $t('buscarNuevosAmigos') }}
            </router-link>
        </div>
        <Loading :data="friends">
            <div id="friends-list" class="friends-list">
                <FriendRequestCard
                    v-for="user in friends"
                    :key="user.id"
                    :user="user"
                    :id-requesting="idRequesting"
                    @delete="onDeleteClick"
                />
            </div>
            <template #no-data><p class="alert alert-warning" role="alert">
                {{ noResult }}
            </p></template>
            <template #loading><p class="alert alert-info" role="alert">
                <img
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoAmigos') }}
            </p></template>
        </Loading>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useFriendsStore } from '../../stores/friends';
import Loading from '../Loading.vue';
import IncomingFriendRequestCard from './IncomingFriendRequestCard.vue';
import FriendRequestCard from './FriendRequestCard';

export default {
    name: 'friends_setting',
    data() {
        return {
            text: '',
            idRequesting: 0
        };
    },
    computed: {
        ...mapState(useFriendsStore, {
            friends: 'friends',
            pendings: 'pendings',
            sentPendings: 'sentPendings'
        }),

        noResult() {
            if (this.text.length) {
                return this.$t('noHayResultados');
            } else {
                return this.$t('noTienesNingunAmigoAun');
            }
        }
    },
    methods: {
        ...mapActions(useFriendsStore, {
            search: 'friendsSearch',
            lookPeginds: 'pending',
            loadSentPendings: 'sentPending',
            accept: 'accept',
            reject: 'reject',
            cancelRequest: 'cancelRequest',
            delete: 'delete'
        }),

        onTextChange() {
            this.search({ value: this.text });
        },

        refreshFriendsData() {
            this.lookPeginds();
            return this.search({}).then(() => this.loadSentPendings());
        },

        onAcceptClick(user) {
            this.idRequesting = user.id;
            this.accept(user.id).then(
                () => {
                    this.idRequesting = 0;
                },
                () => {
                    this.idRequesting = 0;
                }
            );
        },

        onRejectClick(user) {
            this.idRequesting = user.id;
            this.reject(user.id).then(
                () => {
                    this.idRequesting = 0;
                },
                () => {
                    this.idRequesting = 0;
                }
            );
        },

        onCancelRequestClick(user) {
            this.idRequesting = user.id;
            this.cancelRequest(user.id).then(
                () => {
                    this.idRequesting = 0;
                },
                () => {
                    this.idRequesting = 0;
                }
            );
        },

        onDeleteClick(user) {
            this.idRequesting = user.id;
            this.delete(user.id).then(
                () => {
                    this.idRequesting = 0;
                },
                () => {
                    this.idRequesting = 0;
                }
            );
        }
    },

    mounted() {
        this.refreshFriendsData();
    },

    activated() {
        this.refreshFriendsData();
    },
    components: {
        Loading,
        IncomingFriendRequestCard,
        FriendRequestCard
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-primary {
    padding: 0.8em;
}
h1,
h2 {
    margin-top: 0;
    margin-bottom: 0;
}
.form-group {
    margin-bottom: 15px;
}
.form-group {
    margin-bottom: 0;
}
.request-list div.rate-pending_component,
.friend-card {
    /* margin: 1.1em auto; */
    margin: 0;
}
label {
    margin-right: 1em;
}
h1,
h2 {
    margin-bottom: 0.4em;
}
.friends-page-heading {
    color: #036686;
    font-weight: 700;
    font-size: 1.625rem;
    line-height: 1.2;
}
.friends-section-heading {
    color: #036686;
    font-weight: 400;
    font-size: 1.375rem;
    line-height: 1.25;
}
.incoming-friend-requests-list,
.friends-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 1rem;
    margin-bottom: 1.25rem;
}
.friends-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
}
.search-more {
    margin-bottom: 0;
    margin-left: auto;
    flex-shrink: 0;
}
.friend-form {
    margin-bottom: 0;
    flex: 1 1 auto;
    min-width: 0;
}
.alert {
    margin-top: 1em;
}
.sent-pending-list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 0.4rem;
    margin-bottom: 1.2rem;
}
.sent-pending-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.35rem 0.4rem 0.35rem 0.85rem;
    border: 1px solid var(--primary-color, #0070b8);
    border-radius: 999px;
    background-color: #f3f5f7;
}
.sent-pending-chip__name {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.2;
    color: inherit;
    text-decoration: none;
}
.sent-pending-chip__name:hover,
.sent-pending-chip__name:focus {
    text-decoration: underline;
}
.sent-pending-chip__remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.65rem;
    height: 1.65rem;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1;
    cursor: pointer;
}
.sent-pending-chip__remove:hover:not(:disabled),
.sent-pending-chip__remove:focus:not(:disabled) {
    background-color: #e8ecf0;
    color: #374151;
}
.sent-pending-chip__remove:disabled {
    cursor: default;
    opacity: 0.7;
}
@media only screen and (max-width: 768px) {
    .friends-component {
        padding: 1em;
    }
    .friend-card {
        margin: 0;
    }
}
@media only screen and (min-width: 767px) {
    .friends-page-heading {
        font-size: 2rem;
    }
    .friends-section-heading {
        font-size: 1.625rem;
    }
    .friends-toolbar {
        flex-wrap: nowrap;
    }
}
</style>
