<template>
    <div class="friends-component friends-page">
        <div class="friends-page__card">
            <h1 class="friends-page__heading">{{ $t('misAmigos') }}</h1>
            <tabset
                ref="tabs"
                keytabset="friends"
                :rememberTab="true"
            >
            <tab :header="$t('amigos')">
                <div class="friends-toolbar form-inline-with-margin">
                    <div class="friend-form form-inline">
                        <div class="form-group">
                            <label for="input-name">{{
                                $t('filtrarPorNombre')
                            }}</label>
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
                    <AppButton
                        class="search-more"
                        variant="primary"
                        :to="{ name: 'friends_search' }"
                    >
                        {{ $t('buscarNuevosAmigos') }}
                    </AppButton>
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
                    <template #no-data
                        ><p class="alert alert-warning" role="alert">
                            {{ noResult }}
                        </p></template
                    >
                    <template #loading
                        ><p class="alert alert-info" role="alert">
                            <img
                                :src="$publicImg('loader.gif')"
                                alt=""
                                class="ajax-loader"
                            />
                            {{ $t('cargandoAmigos') }}
                        </p></template
                    >
                </Loading>
            </tab>
            <tab :header="$t('solicitudes')">
                <FilterChips
                    v-model="requestsFilter"
                    :options="requestFilterOptions"
                />
                <div v-if="requestsFilter === 'recibidas'" class="clearfix">
                    <Loading :data="pendings">
                        <div
                            id="incoming-friend-requests-list"
                            class="incoming-friend-requests-list"
                        >
                            <IncomingFriendRequestCard
                                v-for="user in pendings"
                                :key="user.id"
                                :user="user"
                                :id-requesting="idRequesting"
                                @accept="onAcceptClick"
                                @reject="onRejectClick"
                            />
                        </div>
                        <template #no-data
                            ><p class="alert alert-warning" role="alert">
                                {{ $t('noHaySolicitudesNuevas') }}
                            </p></template
                        >
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
                <div v-else class="clearfix">
                    <Loading :data="sentPendings">
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
                        <template #no-data
                            ><p class="alert alert-warning" role="alert">
                                {{ $t('noHaySolicitudesNuevas') }}
                            </p></template
                        >
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
            </tab>
        </tabset>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useFriendsStore } from '../../stores/friends';
import Loading from '../Loading.vue';
import IncomingFriendRequestCard from './IncomingFriendRequestCard.vue';
import FriendRequestCard from './FriendRequestCard';
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import FilterChips from '../elements/FilterChips.vue';
import AppButton from '../ui/AppButton.vue';

export default {
    name: 'friends_setting',
    data() {
        return {
            text: '',
            idRequesting: 0,
            requestsFilter: 'recibidas'
        };
    },
    computed: {
        ...mapState(useFriendsStore, {
            friends: 'friends',
            pendings: 'pendings',
            sentPendings: 'sentPendings'
        }),

        requestFilterOptions() {
            const receivedCount = Array.isArray(this.pendings)
                ? this.pendings.length
                : 0;
            const sentCount = Array.isArray(this.sentPendings)
                ? this.sentPendings.length
                : 0;
            return [
                {
                    id: 'recibidas',
                    label: `${this.$t('filtroSolicitudesRecibidas')} ${receivedCount}`
                },
                {
                    id: 'enviadas',
                    label: `${this.$t('filtroSolicitudesEnviadas')} ${sentCount}`
                }
            ];
        },

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
        FriendRequestCard,
        Tab,
        Tabset,
        FilterChips,
        AppButton
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.friends-page__card {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--profile-card-bg, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.friends-page__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
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
.friends-section-heading {
    color: #036686;
    font-weight: 400;
    font-size: 1.375rem;
    line-height: 1.25;
}
.incoming-friend-requests-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0;
    margin-bottom: 1.25rem;
}
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
    .friends-section-heading {
        font-size: 1.625rem;
    }
    .friends-toolbar {
        flex-wrap: nowrap;
    }
}
</style>
