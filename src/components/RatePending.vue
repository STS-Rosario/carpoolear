<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link
                    :to="{
                        name: 'profile',
                        params: { id: to.id, userProfile: to, activeTab: 1 }
                    }"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="to.image"
                    ></div>
                </router-link>
            </div>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    {{ $t('ratePendingComoCalificariasA') }}
                    <strong>{{ to.name }}</strong>
                    {{ $t('como') }}
                    <span v-if="rate.user_to_type === DRIVER">{{ $t('ratePendingConductor') }}</span>
                    <span v-if="rate.user_to_type === PASSENGER">{{ $t('ratePendingPasajero') }}</span>
                    {{ $t('ratePendingEnElViajeHacia') }}
                    <strong>{{
                        trip.points[trip.points.length - 1].json_address.ciudad
                    }}</strong>
                    {{ $t('ratePendingElDia') }}
                    <strong>{{
                        formatDate(trip.trip_date, 'dddd DD [de] MMMM')
                    }}</strong>
                    ?
                </div>
            </div>
            <div class="float-margin">
                <div class="rate-buttons">
                    <button
                        class="btn rate-positive"
                        @click="setRate(1)"
                        :class="{ active: vote === 1 }"
                    >
                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                    </button>
                    <button
                        class="btn rate-negative"
                        @click="setRate(0)"
                        :class="{ active: vote === 0 }"
                    >
                        <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="rate--comment-box" v-show="expanded">
                <textarea
                    maxlength="600"
                    class="rate_comment"
                    v-model="comment"
                    :placeholder="$t('ratePendingIncluyaUnComentario')"
                ></textarea>
                <button
                    class="btn btn-primary"
                    @click="makeVote"
                    :disabled="sending"
                >
                    {{ $t('ratePendingCalificar') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useRatesStore } from '@/stores/rates';
import dialogs from '../services/dialogs.js';
import { formatDate } from '@/composables/useFormatters';

const { t } = useI18n();
const authStore = useAuthStore();
const ratesStore = useRatesStore();

const props = defineProps({
    rate: {
        required: true
    }
});

const emitEvent = defineEmits(['rated']);

const ACCEPTED = 1;
const CANCELED = 3;
const DRIVER = 0;
const PASSENGER = 1;

const vote = ref(null);
const expanded = ref(false);
const comment = ref('');
const sending = ref(false);

const user = computed(() => authStore.user);

const to = computed(() => {
    return props.rate.to;
});

const trip = computed(() => {
    return props.rate.trip;
});

function setRate(value) {
    if (vote.value === value) {
        vote.value = null;
        expanded.value = false;
    } else {
        vote.value = value;
        expanded.value = true;
    }
}

function makeVote() {
    sending.value = true;
    let data = {
        id: props.rate.id,
        trip_id: trip.value.id,
        user_id: to.value.id,
        trip: props.rate.trip,
        comment: comment.value,
        rating: vote.value
    };
    let ok = false;
    if (!vote.value) {
        if (!comment.value) {
            // Voto negativo y comentario vacio
            dialogs.message(
                t('ratePendingComentarioNoPuedeEstarVacio'),
                { duration: 10, estado: 'error' }
            );
        } else {
            ok = true;
        }
    } else {
        ok = true;
    }
    if (ok) {
        console.log('emit rated');
        emitEvent('rated', data);
        ratesStore.vote(data)
            .then(() => {
                comment.value = '';
                sending.value = false;
            })
            .catch(() => {
                sending.value = false;
            });
    } else {
        sending.value = false;
    }
}
</script>
