<template>
    <div class="weekly-schedule-wrapper" :class="{ 'edit-mode': !readonly }">
        <div class="weekly-days-container">
            <div class="weekly-days">
                <!-- Display mode -->
                <template v-if="readonly">   
                    <div v-for="day in weeklyDays" :key="day.key" 
                        class="weekly-day-box" :class="{ 'active': isDaySelected(day.bit) }">
                        <span class="day-name">{{ $t(day.key) }}</span>
                    </div>
                </template>

                <!-- Edit mode -->
                <template v-else>
                    <div v-for="day in weeklyDays" :key="day.key" 
                        class="weekly-day-checkbox">
                        <input type="checkbox" 
                            :id="dayId(day.key)" 
                            :checked="isDaySelected(day.bit)"
                            @change="toggleDay(day.bit)" />
                        <label :for="dayId(day.key)" class="checkbox-label">
                            {{ $t(day.key) }}
                        </label>
                    </div>
                </template>
            </div>
        </div>
        
        <!-- Time display/input -->
        <div class="weekly-schedule-time-container">
            <span v-if="readonly" class="weekly-schedule-time">
                {{ formattedTime }} {{ $t('horas') }}
            </span>
            <input v-else 
                   type="time" 
                   v-model="localTime"
                   v-mask="'##:##'"
                   class="form-control form-control-with-icon form-control-time"
                   :class="{ 'has-error': hasError }" />
        </div>
    </div>
</template>

<script>
import moment from 'moment';

// Defines the days of the week with their corresponding bitmask values
const WEEKLY_DAYS = [
    { key: 'domingo', bit: 64 },
    { key: 'lunes', bit: 1 },
    { key: 'martes', bit: 2 },
    { key: 'miercoles', bit: 4 },
    { key: 'jueves', bit: 8 },
    { key: 'viernes', bit: 16 },
    { key: 'sabado', bit: 32 }
];

function isDaySelected(weeklySchedule, bitValue) {
    if (!weeklySchedule) {
        return false;
    }
    return (weeklySchedule & bitValue) !== 0;
}

export default {
    name: 'WeeklySchedule',
    props: {
        // Weekly schedule bitmask (e.g., 127 for all days, 0 for none)
        weeklySchedule: {
            type: Number,
            default: 0
        },

        weeklyScheduleTime: {
            type: String,
            default: '12:00'
        },

        readonly: {
            type: Boolean,
            default: false
        },
        theme: {
            type: String,
            default: 'default'
        },
        idPrefix: {
            type: String,
            default: 'ws'
        },
        hasError: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            localTime: this.weeklyScheduleTime,
            localBitmask: this.weeklySchedule,
            localDays: {}
        };
    },
    computed: {
        weeklyDays() {
            return WEEKLY_DAYS;
        },
        formattedTime() {
            if (!this.localTime) return '';
            return moment(this.localTime, 'HH:mm').format('HH:mm');
        }
    },
    watch: {
        weeklyScheduleTime(newVal) {
            this.localTime = newVal;
        },
        localTime(newVal) {
            this.$emit('update:weeklyScheduleTime', newVal);
        },
        weeklySchedule(newVal) {
            this.localBitmask = newVal;
            this.syncLocalDays();
        },
        localBitmask(newVal) {
            this.$emit('update:weeklySchedule', newVal);
            this.syncLocalDays();
        }
    },
    methods: {
        isDaySelected(bitValue) {
            return isDaySelected(this.localBitmask, bitValue);
        },
        toggleDay(bitValue) {
            if (this.localBitmask & bitValue) {
                // Day is currently selected, deselect it
                this.localBitmask = this.localBitmask & ~bitValue;
            } else {
                // Day is currently not selected, select it
                this.localBitmask = this.localBitmask | bitValue;
            }
            this.$emit('update:weeklySchedule', this.localBitmask);
        },
        dayId(dayKey) {
            return `${this.idPrefix}-${dayKey}`;
        },
        syncLocalDays() {
            // Sync localDays object with localBitmask
            this.weeklyDays.forEach(day => {
                this.$set(this.localDays, day.key, this.isDaySelected(day.bit));
            });
        }
    },
    mounted() {
        this.syncLocalDays();
    }
};
</script>

<style scoped>
.weekly-schedule-wrapper {
    margin: 1rem 0 1.2em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.weekly-days-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
}

.weekly-days {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
}

/* Display mode - read-only boxes */
.weekly-day-box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 22px;
    padding: 2px 4px;
    margin-left: -1px;
    border: 1px solid #ccc;
    border-radius: 0;
    font-size: 0.65em;
    font-weight: 400;
    color: #666;
    cursor: default;
    transition: all 0.2s ease;
}

.weekly-day-box:first-child {
    border-radius: 11px 0 0 11px;
}

.weekly-day-box:last-child {
    border-radius: 0 11px 11px 0;
}

.weekly-day-box.active {
    background-color: var(--trip-half-free-color);
    border-color: var(--trip-half-free-color);
    color: white;
    font-weight: 500;
}

.weekly-day-box .day-name {
    user-select: none;
}

.weekly-day-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.weekly-day-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.weekly-day-checkbox .checkbox-label {
    cursor: pointer;
    font-size: 0.85em;
    margin-top: 10px;
    user-select: none;
}

.weekly-schedule-time-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 4px;
}

.weekly-schedule-time {
    display: inline-flex;
    align-items: center;
    font-size: 1.1em;
    color: var(--trip-half-free-color);
}

.weekly-schedule-wrapper.light-theme {
    margin: 0;
}

.weekly-schedule-wrapper.light-theme .weekly-schedule-time {
    font-size: 1em;
    font-weight: 600;
}

.edit-mode {
    align-items: flex-start;
    
    .weekly-days,
    .weekly-schedule-time-container {
        justify-content: flex-start;
        width: 100%;
    }

    .weekly-days-container {
        margin-bottom: 12px;
    }
}
</style>


