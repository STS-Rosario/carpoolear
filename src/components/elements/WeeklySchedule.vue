<template>
    <div class="weekly-schedule-wrapper" :class="{ 'edit-mode': !readonly }">
        <div class="weekly-days-container">
            <div class="weekly-days">
                <div
                    v-for="day in weeklyDays"
                    :key="day.key"
                    :class="[
                        readonly ? 'weekly-day-box' : 'weekly-day-checkbox',
                        { active: readonly && isDaySelected(day.bit) }
                    ]"
                >
                    <!-- Display mode -->
                    <span v-if="readonly" class="day-name">
                        {{ t(day.key) }}
                    </span>

                    <!-- Edit mode -->
                    <template v-else>
                        <input
                            type="checkbox"
                            :id="dayId(day.key)"
                            :checked="isDaySelected(day.bit)"
                            @change="toggleDay(day.bit)"
                        />
                        <label :for="dayId(day.key)" class="checkbox-label">
                            {{ t(day.key) }}
                        </label>
                    </template>
                </div>
            </div>
        </div>

        <!-- Time display/input -->
        <div class="weekly-schedule-time-container">
            <span v-if="readonly" class="weekly-schedule-time">
                {{ formatDate(weeklyScheduleTime, 'HH:mm') }} {{ t('horas') }}
            </span>
            <input
                v-else
                type="time"
                :value="weeklyScheduleTime"
                @input="emit('update:weeklyScheduleTime', $event.target.value)"
                v-mask="'##:##'"
                class="form-control form-control-with-icon form-control-time"
                :class="{ 'has-error': hasError }"
            />
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { formatDate } from '@/composables/useFormatters';

const { t } = useI18n();

const WEEKLY_DAYS = [
    { key: 'domingo', bit: 64 },
    { key: 'lunes', bit: 1 },
    { key: 'martes', bit: 2 },
    { key: 'miercoles', bit: 4 },
    { key: 'jueves', bit: 8 },
    { key: 'viernes', bit: 16 },
    { key: 'sabado', bit: 32 }
];

const props = defineProps({
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
    idPrefix: {
        type: String,
        default: 'ws'
    },
    hasError: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:weeklySchedule', 'update:weeklyScheduleTime']);

const weeklyDays = WEEKLY_DAYS;

function isDaySelected(bitValue) {
    return (props.weeklySchedule & bitValue) !== 0;
}

function toggleDay(bitValue) {
    emit('update:weeklySchedule', props.weeklySchedule ^ bitValue);
}

function dayId(dayKey) {
    return `${props.idPrefix}-${dayKey}`;
}
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
}

.weekly-day-checkbox input[type='checkbox'] {
    width: 16px;
    height: 16px;
    cursor: pointer;
}

.weekly-day-checkbox .checkbox-label {
    cursor: pointer;
    font-size: 0.85em;
    padding: 0px 2px 4px 8px;
    margin: 0;
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
