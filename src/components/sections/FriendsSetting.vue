<template>
    <div class="friends-component">
        <div class="clearfix">
            <Loading :data="pendings" :hideOnEmpty="true">
                <template #title><h2>{{ t('solicitudesDeAmistad') }}</h2></template>
                <div id="friends-list">
                    <FriendCard
                        v-for="user in pendings"
                        v-bind:key="user.id"
                        :user="user"
                    >
                        <template #default>
                            <span>{{ t('deseaSerTuAmigo') }}</span>
                            <div class="pending-buttons">
                                <button
                                    @click="onAcceptClick(user)"
                                    class="btn btn-accept-request"
                                >
                                    <i
                                        class="fa fa-check"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                                <button
                                    @click="onRejectClick(user)"
                                    class="btn btn-primary"
                                >
                                    <i
                                        class="fa fa-times"
                                        aria-hidden="true"
                                    ></i>
                                </button>
                                <span v-if="idRequesting == user.id"
                                    >{{ t('enProceso') }}</span
                                >
                            </div>
                        </template>
                    </FriendCard>
                </div>
                <template #no-data>
                    <p class="alert alert-warning" role="alert">
                        {{ t('noHaySolicitudesNuevas') }}
                    </p>
                </template>
                <template #loading>
                    <p class="alert alert-info" role="alert">
                        <img
                            src="https://carpoolear.com.ar/static/img/loader.gif"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ t('cargandoSolicitudes') }}
                    </p>
                </template>
            </Loading>
        </div>

        <h2>{{ t('amigos') }}</h2>
        <router-link
            :to="{ name: 'friends_search' }"
            custom
            v-slot="{ navigate }"
        >
            <button
                class="btn btn-primary search-more"
                @click="navigate"
            >
                {{ t('buscarNuevosAmigos') }}
            </button>
        </router-link>
        <h2>{{ t('misAmigos') }}</h2>
        <div class="friend-form form-inline form-inline-with-margin">
            <div class="form-group">
                <label for="input-name">{{ t('filtrarPorNombre') }}</label>
                <input
                    v-on:input="onTextChange"
                    v-model="text"
                    type="text"
                    class="form-control"
                    id="input-name"
                    :placeholder="t('ingresarNombre')"
                />
            </div>
        </div>
        <Loading :data="friends">
            <div id="friends-list">
                <FriendRequestCard
                    v-for="user in friends"
                    v-bind:key="user.id"
                    :user="user"
                >
                    <template #default>
                        <div>
                            <div
                                @click="onDeleteClick(user)"
                                class="delete-friend"
                            >
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </div>
                            <span v-if="idRequesting == user.id"
                                >{{ t('enProceso') }}</span
                            >
                        </div>
                    </template>
                </FriendRequestCard>
            </div>
            <template #no-data>
                <p class="alert alert-warning" role="alert">
                    {{ noResult }}
                </p>
            </template>
            <template #loading>
                <p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ t('cargandoAmigos') }}
                </p>
            </template>
        </Loading>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFriendsStore } from '@/stores/friends';
import Loading from '../Loading.vue';
import FriendCard from './FriendCard';
import FriendRequestCard from './FriendRequestCard';

const { t } = useI18n();
const friendsStore = useFriendsStore();

const text = ref('');
const idRequesting = ref(0);

const friends = computed(() => friendsStore.friends);
const pendings = computed(() => friendsStore.pendings);

const noResult = computed(() => {
    if (text.value.length) {
        return t('noHayResultados');
    } else {
        return t('noTienesNingunAmigoAun');
    }
});

function onTextChange() {
    friendsStore.friendsSearch({ value: text.value });
}

function onAcceptClick(user) {
    idRequesting.value = user.id;
    friendsStore.accept(user.id).then(
        () => {
            idRequesting.value = 0;
        },
        () => {
            idRequesting.value = 0;
        }
    );
}

function onRejectClick(user) {
    idRequesting.value = user.id;
    friendsStore.reject(user.id).then(
        () => {
            idRequesting.value = 0;
        },
        () => {
            idRequesting.value = 0;
        }
    );
}

function onDeleteClick(user) {
    idRequesting.value = user.id;
    friendsStore.delete(user.id).then(
        () => {
            idRequesting.value = 0;
        },
        () => {
            idRequesting.value = 0;
        }
    );
}

onMounted(() => {
    friendsStore.friendsSearch({});
    friendsStore.pending();
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-primary {
    padding: 0.8em;
}
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
h2 {
    margin-bottom: 0.4em;
}
.search-more {
    margin-bottom: 1em;
}
.friend-form {
    margin-bottom: 0;
}
.alert {
    margin-top: 1em;
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
    .friend-form {
        margin-top: 1.6em;
    }
}
</style>
