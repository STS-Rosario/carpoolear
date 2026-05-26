<template>
    <div class="profile-rates-component container">
        <div class="clearfix">
            <h2>{{ $t('calificaciones') }}</h2>
            <Loading :data="rates">
                <div class="list-group">
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col1"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col2"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col3"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                </div>
                <!--
                <div v-if="morePages">
                    <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                </div>
                -->

                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noCalificaciones') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoNotificaciones') }}
                </p></template>
            </Loading>
        </div>

        <template v-if="config && config.module_references">
            <div class="clearfix">
                <h2>{{ $t('referencias') }}</h2>
                <div
                    class="edit-action edit-action-reference"
                    v-if="canWriteReference"
                >
                    <button
                        v-if="!sendReferenceFormVisibility"
                        class="btn btn-primary"
                        tag="button"
                        @click="showReferenceConfirmation"
                    >
                        {{ $t('enviarReferencia') }}
                    </button>
                    <modal
                        v-if="referenceConfirmationVisibility"
                        name="reference-confirmation-modal"
                        @close="hideReferenceConfirmation"
                    >
                        <template #header>
                            <h3>{{ $t('confirmarReferenciaUsuarioTitulo') }}</h3>
                        </template>
                        <template #body>
                            <p>
                                {{
                                    $t('confirmarReferenciaUsuarioMensaje', {
                                        userName: profile.name
                                    })
                                }}
                            </p>
                        </template>
                        <template #footer>
                            <button
                                class="btn btn-secondary"
                                @click="hideReferenceConfirmation"
                            >
                                {{ $t('cancelar') }}
                            </button>
                            <button
                                class="btn btn-primary"
                                @click="confirmReferenceWriting"
                            >
                                {{ $t('continuar') }}
                            </button>
                        </template>
                    </modal>
                    <div v-else-if="sendReferenceFormVisibility" class="reply-box">
                        <label for="reference" class="label label-reply">
                            {{ $t('escribeUnaReferenciaSobreElUsuario') }}
                        </label>
                        <textarea
                            ref="reference"
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
                                <template v-else>{{ $t('comentar') }}</template>
                            </button>
                            <button
                                class="btn btn-primary"
                                @click="sendReferenceFormVisibility = false"
                            >
                                {{ $t('cancelar') }}
                            </button>
                        </div>
                    </div>
                </div>
                <Loading :data="references">
                    <div class="list-group">
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col1"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col2"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                        <div class="column-rating">
                            <div
                                class="list-group-item clearfix"
                                v-for="reference in referencesCol.col3"
                            >
                                <RateItem
                                    :notReply="true"
                                    :user="user"
                                    :id="id"
                                    :rate="reference"
                                ></RateItem>
                            </div>
                        </div>
                    </div>
                    <!--
                    <div v-if="morePages">
                        <button class="btn btn-primary" @click="nextPage">Más resultados</button>
                    </div>
                    -->
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noReferences') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoNotificaciones') }}
                    </p></template>
                </Loading>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useProfileStore } from '../../stores/profile';
import { useDeviceStore } from '../../stores/device';
import Loading from '../Loading.vue';
import RateItem from '../RateItem';
import Spinner from '../Spinner.vue';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';

let emptyCols = {
    col1: [],
    col2: [],
    col3: []
};

export default {
    data() {
        return {
            rating: {},
            referencesCol: {},
            sendReferenceFormVisibility: false,
            referenceConfirmationVisibility: false,
            referenceComment: '',
            sending: false
        };
    },
    methods: {
        ...mapActions(useProfileStore, {
            makeReference: 'makeReference'
        }),
        cleanCols(array) {
            this[array] = JSON.parse(JSON.stringify(emptyCols));
        },
        makeRows(arrayToCheck, arrayToPush) {
            if (this[arrayToCheck]) {
                this.cleanCols(arrayToPush);
                if (this.isMobile) {
                    this[arrayToPush].col1 = this[arrayToCheck].slice(0);
                } else {
                    let i, j;
                    let rows = this.isTablet ? 2 : 3;
                    for (j = 0; j < rows; j++) {
                        i = j;
                        for (i; i < this[arrayToCheck].length; i += rows) {
                            this[arrayToPush][`col${j + 1}`].push(
                                this[arrayToCheck][i]
                            );
                        }
                    }
                }
            }
        },
        showReferenceConfirmation() {
            this.referenceConfirmationVisibility = true;
        },
        hideReferenceConfirmation() {
            this.referenceConfirmationVisibility = false;
        },
        confirmReferenceWriting() {
            this.referenceConfirmationVisibility = false;
            this.showReferenceForm();
        },
        showReferenceForm() {
            this.sendReferenceFormVisibility = true;
            this.$nextTick(() => {
                this.$refs.reference.focus();
            });
        },
        sendReference() {
            this.sending = true;
            this.makeReference({
                user_id_to: this.profile.id,
                comment: this.referenceComment
            })
                .then(() => {
                    dialogs.message(this.$t('referenciaExitosa'));
                    this.sendReferenceFormVisibility = false;
                })
                .catch((error) => {
                    let errorMessage = this.$t('referenciaError');
                    if (this.$checkError(error, 'reference_exist')) {
                        errorMessage = this.$t('referenciaExist');
                    } else if (this.$checkError(error, 'reference_same_user')) {
                        errorMessage = this.$t('referenciaSameUser');
                    } else if (this.$checkError(error, 'user_doesnt_exist')) {
                        errorMessage = this.$t('userDoesntExist');
                    }
                    dialogs.message(errorMessage, { estado: 'error' });
                })
                .finally(() => {
                    this.sending = false;
                });
        }
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useProfileStore, {
            profile: 'user',
            rates: 'rates',
            references: 'references'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile',
            isTablet: 'isTablet',
            isDesktop: 'isDesktop'
        }),
        canWriteReference() {
            return (
                this.config &&
                this.config.module_references &&
                this.profile &&
                this.user &&
                this.profile.id !== this.user.id &&
                !this.userReferenceWritten
            );
        },
        userReferenceWritten() {
            return (
                this.profile.references_data &&
                    this.profile.references_data.length &&
                    this.profile.references_data.findIndex(
                        (item) => item.user_id_from === this.user.id
                    ) >= 0
            );
        }
    },
    watch: {
        rates: {
            handler: function (val, oldVal) {
                this.makeRows('rates', 'rating');
            }
        },
        references: {
            handler: function (val, oldVal) {
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isMobile: {
            handler: function (val, oldVal) {
                console.log('isMobileChange');
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isDesktop: {
            handler: function (val, oldVal) {
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        }
    },
    components: {
        Loading,
        RateItem,
        Spinner,
        modal
    },
    props: ['id']
};
</script>
<style scoped>
.profile-rates-component {
    padding-bottom: 6em;
}
</style>
