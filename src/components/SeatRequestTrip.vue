<template>
    <div class="seat-request-trip" :class="tripCardCountClass">
        <div class="seat-request-trip__card">
            <Trip
                :trip="trip"
                :user="user"
                :clickModal="false"
                :embeddedInSeatRequest="true"
            />
            <div
                v-if="statusClass && statusLabelKey"
                class="seat-request-status"
                :class="statusClass"
            >
                {{ $t(statusLabelKey) }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import Trip from './sections/Trip.vue';
import { useAuthStore } from '../stores/auth';
import {
    getSeatRequestStatusClass,
    getSeatRequestStatusLabelKey
} from '../utils/seatRequestStatus.js';

export default {
    name: 'seat-request-trip',
    components: {
        Trip
    },
    props: {
        trip: {
            type: Object,
            required: true
        },
        requestState: {
            type: Number,
            required: true
        },
        user: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig'
        }),
        tripCardCountClass() {
            if (this.config && this.config.max_cards_per_row === 3) {
                return 'col-lg-8 col-md-12 col-sm-12';
            }
            return 'col-lg-6 col-md-8 col-sm-12';
        },
        statusClass() {
            return getSeatRequestStatusClass(this.requestState);
        },
        statusLabelKey() {
            return getSeatRequestStatusLabelKey(this.requestState);
        }
    }
};
</script>

<style scoped>
.seat-request-trip__card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 0.4em;
    box-shadow: 0 0 4px 1px #ccc;
}

.seat-request-trip__card :deep(.card-trip) {
    flex: 1 1 auto;
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 0;
}

.seat-request-trip__card :deep(.card-trip .card_heading) {
    border-radius: 0.4em 0.4em 0.5em 0.5em;
}

.seat-request-status {
    flex: 0 0 auto;
    padding: 0.75rem 1rem;
    color: #fff;
    font-weight: 600;
    text-align: center;
}

.seat-request-status--pending {
    background: #e67e22;
}

.seat-request-status--rejected {
    background: #c0392b;
}

.seat-request-status--accepted {
    background: #27ae60;
}
</style>
