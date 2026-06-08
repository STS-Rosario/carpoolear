<template>
    <div class="seat-request-trip">
        <Trip :trip="trip" :user="user" :clickModal="false" />
        <div
            v-if="statusClass && statusLabelKey"
            class="seat-request-status"
            :class="statusClass"
        >
            {{ $t(statusLabelKey) }}
        </div>
    </div>
</template>

<script>
import Trip from './sections/Trip.vue';
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
.seat-request-trip {
    position: relative;
}

.seat-request-status {
    margin-top: -0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 0 0 0.5rem 0.5rem;
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
