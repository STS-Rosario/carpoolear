<template>
    <div class="profile-info-component" v-if="profile">
        <div class="list-group">
            <div class="pic-info col-sm-6">
                <div
                    class="circle-box profile"
                    v-imgSrc:profile="profile.image"
                ></div>
                <div class="profile-info">
                    <div class="profile-info--name mobile">
                        <UserNameWithBadge :user="profile" />
                    </div>
                    <div class="profile-info--ratings">
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                        <span>{{ profile.positive_ratings }}</span>
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                        <span>{{ profile.negative_ratings }}</span>
                    </div>
                </div>
                <div v-if="badges.length" class="profile-badges">
                    <img
                        v-for="badge in badges"
                        :key="badge.id"
                        :src="badgeImageUrl(badge.image_path)"
                        :alt="badge.title"
                        :title="badge.description || badge.title"
                        class="profile-badge"
                    />
                </div>
                <div class="profile-social-accounts">
                    <div v-for="account in profile.accounts" class="row">
                        <div class="col-xs-24">
                            <a
                                :href="
                                    'https://www.facebook.com/search/top/?q=' +
                                    encodeURIComponent(profile.name)
                                "
                                target="_blank"
                                class="btn-primary btn-search"
                                style="border: 0"
                                :title="t('cambioFacebook')"
                            >
                                <span class="">{{ t('buscarFacebook') }}</span>
                            </a>
                            <!-- app_scoped_user_id -->
                        </div>
                    </div>
                    <div
                        class="row"
                        v-if="profile.accounts && profile.accounts.length"
                    >
                        <div class="col-xs-24">
                            <small>{{ t('cambioFacebook') }}</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-info col-sm-offset-2 col-sm-16 col-md-offset-1">
                <div class="profile-info--name desktop"><UserNameWithBadge :user="profile" /></div>
                <div class="list-container">
                    <div class="list-group-item" v-if="profile.description">
                        <i class="fa fa-quote-left" aria-hidden="true"></i>
                        <div class="list-group-item--content italic">
                            {{ profile.description }}
                        </div>
                    </div>

                    <div class="list-group-item" v-if="profile.email">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <div class="list-group-item--content">
                            {{ profile.email }}
                        </div>
                    </div>
                    <div class="list-group-item">
                        <i class="fa fa-id-card" aria-hidden="true"></i>
                        <div class="list-group-item--content">
                            {{ formattedNroDoc }}
                        </div>
                    </div>

                    <div class="list-group-item" v-if="profile.mobile_phone">
                        <i class="fa fa-mobile bigger" aria-hidden="true"></i>
                        <div class="list-group-item--content">
                            {{ profile.mobile_phone }}
                        </div>
                    </div>

                    <div
                        class="list-group-item"
                        v-if="profile.cars && profile.cars.length"
                    >
                        <i class="fa fa-car" aria-hidden="true"></i>
                        <div class="list-group-item--content">
                            {{ profile.cars[0].patente }}
                        </div>
                    </div>
                </div>
                <div
                    class="edit-action"
                    v-if="user.is_admin && profile.id !== user.id"
                >
                    <button
                        class="btn btn-primary btn-circle"
                        v-on:click="messageUser()"
                    >
                        {{ t('enviarMensaje') }}
                    </button>
                </div>
                <div class="edit-action" v-if="profile.id === user.id">
                    <router-link
                        class="btn btn-primary"
                        :to="{ name: 'profile_update' }"
                        custom
                        v-slot="{ navigate }"
                    >
                        <button class="btn btn-primary" @click="navigate">{{ t('editarPerfil') }}</button>
                    </router-link>
                    <router-link
                        class="btn btn-primary"
                        :to="{ name: 'friends_setting' }"
                        custom
                        v-slot="{ navigate }"
                    >
                        <button class="btn btn-primary" @click="navigate">{{ t('verAmigos') }}</button>
                    </router-link>
                    <router-link
                        v-if="config && config.module_trip_seats_payment"
                        class="btn btn-primary"
                        :to="{ name: 'transacciones' }"
                        custom
                        v-slot="{ navigate }"
                    >
                        <button class="btn btn-primary" @click="navigate">{{ t('transacciones') }}</button>
                    </router-link>
                </div>
                <div
                    class="edit-action edit-action-reference"
                    v-else-if="
                        config &&
                        config.module_references &&
                        !userReferenceWritten
                    "
                >
                    <button
                        v-if="!sendReferenceFormVisibility"
                        class="btn btn-primary"
                        tag="button"
                        @click="showReferenceForm"
                    >
                        {{ t('enviarReferencia') }}
                    </button>
                    <div v-else class="reply-box">
                        <label for="reply" class="label label-reply">
                            {{ t('escribeUnaReferenciaSobreElUsuario') }}
                        </label>
                        <textarea
                            ref="referenceEl"
                            maxlength="260"
                            v-model="referenceComment"
                            id="reference"
                        ></textarea>
                        <div class="reply-btns">
                            <button
                                class="btn btn-primary"
                                @click="sendReference"
                                :disabled="sending"
                            >
                                <template v-if="sending">
                                    <spinner class="blue"></spinner>
                                </template>
                                <template v-else>{{ t('comentar') }}</template>
                            </button>
                            <button
                                class="btn btn-primary"
                                @click="sendReferenceFormVisibility = false"
                            >
                                {{ t('cancelar') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useConversationsStore } from '@/stores/conversations';
import Spinner from '../Spinner.vue';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import dialogs from '../../services/dialogs.js';
import { formatId } from '../../services/utility';
import { checkError } from '../../../utils/helpers';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const conversationsStore = useConversationsStore();

const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';

const referenceEl = ref(null);
const sendReferenceFormVisibility = ref(false);
const referenceComment = ref('');
const sending = ref(false);

const user = computed(() => authStore.user);
const profile = computed(() => profileStore.user);
const badges = computed(() => profileStore.badges);
const config = computed(() => authStore.appConfig);

const userReferenceWritten = computed(() => {
    return (
        profile.value.references_data &&
            profile.value.references_data.length &&
            profile.value.references_data.findIndex(
                (item) => item.user_id_from === user.value.id
            ) >= 0
    );
});

const formattedNroDoc = computed(() => {
    return formatId(profile.value.nro_doc, config.value.profile_id_format);
});

function messageUser() {
    console.log('messageUser profileInfo', profile.value);
    conversationsStore.createConversation(profile.value).then((conversation) => {
        router.push({
            name: 'conversation-chat',
            params: { id: conversation.id }
        });
    });
}

function sendReference() {
    sending.value = true;
    profileStore.makeReference({
        user_id_to: profile.value.id,
        comment: referenceComment.value
    })
        .then(() => {
            dialogs.message(t('referenciaExitosa'));
            sendReferenceFormVisibility.value = false;
        })
        .catch((error) => {
            let errorMessage = t('referenciaError');
            if (checkError(error, 'reference_exist')) {
                errorMessage = t('referenciaExist');
            } else if (checkError(error, 'reference_same_user')) {
                errorMessage = t('referenciaSameUser');
            } else if (checkError(error, 'user_doesnt_exist')) {
                errorMessage = t('userDoesntExist');
            }
            dialogs.message(errorMessage, { estado: 'error' });
        })
        .finally(() => {
            sending.value = false;
        });
}

function showReferenceForm() {
    sendReferenceFormVisibility.value = true;
    nextTick(() => {
        referenceEl.value.focus();
    });
}

function badgeImageUrl(imagePath) {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    const base = ROUTE_BASE + 'static/img';
    return base + (base && !imagePath.startsWith('/') ? '/' : '') + imagePath;
}
</script>
<style scoped>
.profile-badges {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 12px;
}

.profile-badge {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

.btn-primary {
    display: inline-block;
}
.label-reply {
    display: block;
    padding: 0;
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.5em;
    color: #333;
    text-align: left;
    border-radius: 0;
}
.reply-btns button {
    min-width: 7rem;
}
</style>
