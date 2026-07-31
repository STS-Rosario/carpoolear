<template>
    <div class="profile-rates-component container profile-rates-list">
        <div class="clearfix">
            <div class="profile-filter-chips" role="tablist">
                <button
                    v-for="chip in ratingFilterChips"
                    :key="chip.id"
                    type="button"
                    class="profile-filter-chip"
                    :class="{ 'profile-filter-chip--active': ratingFilter === chip.id }"
                    @click="ratingFilter = chip.id"
                >
                    <i
                        v-if="ratingFilter === chip.id"
                        class="fa fa-check profile-filter-chip__check"
                        aria-hidden="true"
                    ></i>
                    {{ chip.label }}
                </button>
            </div>
            <Loading :data="filteredRates">
                <div class="list-group">
                    <div class="column-rating">
                        <div
                            class="list-group-item clearfix"
                            v-for="rate in rating.col1"
                            :key="rate.id || rate.trip_id"
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
                            :key="rate.id || rate.trip_id"
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
                            :key="rate.id || rate.trip_id"
                        >
                            <RateItem
                                :user="user"
                                :id="id"
                                :rate="rate"
                            ></RateItem>
                        </div>
                    </div>
                </div>
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
                <p class="referencias-section-description">
                    {{ $t('referenciasDescripcion') }}
                </p>
                <div
                    class="edit-action edit-action-reference"
                    v-if="canWriteReference"
                >
                    <button
                        v-if="!sendReferenceFormVisibility"
                        class="btn btn-primary"
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
                                    $t('confirmarReferenciaUsuarioMensajeReferencia', {
                                        userName: referenceRecipientName
                                    })
                                }}
                            </p>
                            <p>
                                {{
                                    $t('confirmarReferenciaUsuarioMensajeCalificacion')
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
                                :key="reference.id"
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
                                :key="reference.id"
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
                                :key="reference.id"
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
import {
    isNegativeRating,
    isNeutralRating,
    isPositiveRating
} from '../../utils/tripRating';

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
            ratingFilter: 'all',
            sendReferenceFormVisibility: false,
            referenceConfirmationVisibility: false,
            referenceComment: '',
            sending: false
        };
    },
    props: {
        id: {
            required: false
        }
    },
    methods: {
        ...mapActions(useProfileStore, {
            makeReference: 'makeReference'
        }),
        cleanCols(array) {
            this[array] = JSON.parse(JSON.stringify(emptyCols));
        },
        makeRowsFromList(list, arrayToPush) {
            this.cleanCols(arrayToPush);
            if (!list || !list.length) {
                return;
            }
            if (this.isMobile) {
                this[arrayToPush].col1 = list.slice(0);
            } else {
                let i, j;
                let rows = this.isTablet ? 2 : 3;
                for (j = 0; j < rows; j++) {
                    i = j;
                    for (i; i < list.length; i += rows) {
                        this[arrayToPush][`col${j + 1}`].push(list[i]);
                    }
                }
            }
        },
        makeRows(arrayToCheck, arrayToPush) {
            if (arrayToCheck === 'rates') {
                this.makeRowsFromList(this.filteredRates, arrayToPush);
                return;
            }
            if (this[arrayToCheck]) {
                this.makeRowsFromList(this[arrayToCheck], arrayToPush);
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
        filteredRates() {
            if (!Array.isArray(this.rates)) {
                return this.rates;
            }
            const list = this.rates;
            if (this.ratingFilter === 'positive') {
                return list.filter((rate) => isPositiveRating(rate.rating));
            }
            if (this.ratingFilter === 'neutral') {
                return list.filter((rate) => isNeutralRating(rate.rating));
            }
            if (this.ratingFilter === 'negative') {
                return list.filter((rate) => isNegativeRating(rate.rating));
            }
            return list;
        },
        ratingCounts() {
            const list = Array.isArray(this.rates) ? this.rates : [];
            return {
                all: list.length,
                positive: list.filter((rate) => isPositiveRating(rate.rating))
                    .length,
                neutral: list.filter((rate) => isNeutralRating(rate.rating))
                    .length,
                negative: list.filter((rate) => isNegativeRating(rate.rating))
                    .length
            };
        },
        ratingFilterChips() {
            return [
                {
                    id: 'all',
                    label: `${this.$t('filtroCalificacionesTodas')} ${this.ratingCounts.all}`
                },
                {
                    id: 'positive',
                    label: `${this.$t('filtroCalificacionesPositivas')} ${this.ratingCounts.positive}`
                },
                {
                    id: 'neutral',
                    label: `${this.$t('filtroCalificacionesNeutras')} ${this.ratingCounts.neutral}`
                },
                {
                    id: 'negative',
                    label: `${this.$t('filtroCalificacionesNegativas')} ${this.ratingCounts.negative}`
                }
            ];
        },
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
        referenceRecipientName() {
            return this.profile ? this.profile.name : '';
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
            handler: function () {
                this.makeRows('rates', 'rating');
            }
        },
        ratingFilter: {
            handler: function () {
                this.makeRows('rates', 'rating');
            }
        },
        references: {
            handler: function () {
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isMobile: {
            handler: function () {
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        },
        isTablet: {
            handler: function () {
                this.makeRows('rates', 'rating');
                if (this.config && this.config.module_references) {
                    this.makeRows('references', 'referencesCol');
                }
            }
        }
    },
    mounted() {
        this.makeRows('rates', 'rating');
        if (this.config && this.config.module_references) {
            this.makeRows('references', 'referencesCol');
        }
    },
    components: {
        Loading,
        RateItem,
        Spinner,
        modal
    }
};
</script>

<style scoped>
.edit-action-reference {
    margin-bottom: 1rem;
}
.label-reply {
    display: block;
    padding: 0;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.5em;
    color: #333;
    text-align: left;
    border-radius: 0;
}
.reply-btns button {
    min-width: 7rem;
}
.profile-rates-component :deep(.rate-neutral-icon) {
    margin-left: 0.6em;
}
.referencias-section-description {
    margin-bottom: 1rem;
    color: #666;
}
</style>
