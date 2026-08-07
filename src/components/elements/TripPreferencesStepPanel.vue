<template>
    <div class="trip-preferences-step">
        <h3 class="new-trip-wizard__question">
            {{ $t('tripCreationStepDescriptionQuestion') }}
        </h3>

        <section class="trip-preferences-step__section">
            <h4 class="trip-preferences-step__section-title">
                {{ $t('preferenciasViaje') }}
            </h4>
            <div class="trip-preferences-step__rows">
                <label class="trip-preferences-step__row">
                    <img
                        v-if="kidsIcon"
                        :src="kidsIcon"
                        alt=""
                        class="trip-preferences-step__icon"
                    />
                    <span class="trip-preferences-step__label">{{
                        $t('tripPrefToggleKids')
                    }}</span>
                    <input
                        class="trip-preferences-step__switch"
                        type="checkbox"
                        :checked="allowKids"
                        @change="
                            $emit('update:allowKids', $event.target.checked)
                        "
                    />
                </label>
                <label class="trip-preferences-step__row">
                    <img
                        v-if="smokingIcon"
                        :src="smokingIcon"
                        alt=""
                        class="trip-preferences-step__icon"
                    />
                    <span class="trip-preferences-step__label">{{
                        $t('tripPrefToggleSmoking')
                    }}</span>
                    <input
                        class="trip-preferences-step__switch"
                        type="checkbox"
                        :checked="allowSmoking"
                        @change="
                            $emit('update:allowSmoking', $event.target.checked)
                        "
                    />
                </label>
                <label class="trip-preferences-step__row">
                    <img
                        v-if="petsIcon"
                        :src="petsIcon"
                        alt=""
                        class="trip-preferences-step__icon"
                    />
                    <span class="trip-preferences-step__label">{{
                        $t('tripPrefTogglePets')
                    }}</span>
                    <input
                        class="trip-preferences-step__switch"
                        type="checkbox"
                        :checked="allowAnimals"
                        @change="
                            $emit('update:allowAnimals', $event.target.checked)
                        "
                    />
                </label>
            </div>
        </section>

        <section v-if="showFriends" class="trip-preferences-step__section">
            <h4 class="trip-preferences-step__section-title">
                {{ $t('tripPrefFriendsSection') }}
            </h4>
            <label class="trip-preferences-step__row trip-preferences-step__row--multi">
                <i
                    class="fa fa-user-plus trip-preferences-step__fa-icon"
                    aria-hidden="true"
                ></i>
                <span class="trip-preferences-step__copy">
                    <span class="trip-preferences-step__label">{{
                        $t('tripPrefFriendsTitle')
                    }}</span>
                    <span class="trip-preferences-step__helper label-soft">{{
                        $t('tripPrefFriendsHelper')
                    }}</span>
                </span>
                <input
                    class="trip-preferences-step__switch"
                    type="checkbox"
                    :checked="autoacceptFriends"
                    @change="
                        $emit(
                            'update:autoacceptFriends',
                            $event.target.checked
                        )
                    "
                />
            </label>
        </section>

        <section class="trip-preferences-step__section">
            <h4 class="trip-preferences-step__section-title">
                {{ $t('tripPrefCommentsSection') }}
            </h4>
            <AppTextarea
                class="trip-preferences-step__comments"
                maxlength="2000"
                :model-value="description"
                :placeholder="$t('placeholderComentarioPasajeros')"
                :error="descriptionError"
                @update:modelValue="$emit('update:description', $event)"
            />
        </section>
    </div>
</template>

<script>
import AppTextarea from '../ui/AppTextarea.vue';

export default {
    name: 'trip-preferences-step-panel',

    components: {
        AppTextarea
    },

    props: {
        allowKids: { type: Boolean, default: false },
        allowSmoking: { type: Boolean, default: false },
        allowAnimals: { type: Boolean, default: false },
        autoacceptFriends: { type: Boolean, default: false },
        description: { type: String, default: '' },
        descriptionError: { type: String, default: '' },
        showFriends: { type: Boolean, default: true },
        kidsIcon: { type: String, default: '' },
        smokingIcon: { type: String, default: '' },
        petsIcon: { type: String, default: '' }
    },

    emits: [
        'update:allowKids',
        'update:allowSmoking',
        'update:allowAnimals',
        'update:autoacceptFriends',
        'update:description'
    ]
};
</script>

<style scoped>
.trip-preferences-step__section {
    margin: 0 0 1.5rem;
}

.trip-preferences-step__section-title {
    margin: 0 0 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8a8a8a;
}

.trip-preferences-step__rows {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.trip-preferences-step__row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 3.25rem;
    padding: 0.55rem 0;
    border-bottom: 1px solid #ececec;
    cursor: pointer;
}

.trip-preferences-step__row--multi {
    align-items: flex-start;
}

.trip-preferences-step__icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    object-fit: contain;
}

.trip-preferences-step__fa-icon {
    width: 1.5rem;
    text-align: center;
    color: var(--ds-action, #1e5f9e);
    margin-top: 0.2rem;
}

.trip-preferences-step__label {
    flex: 1;
    color: #22211f;
    font-weight: 600;
}

.trip-preferences-step__copy {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.trip-preferences-step__helper {
    font-size: 0.85rem;
    line-height: 1.35;
}

.trip-preferences-step__switch {
    appearance: none;
    width: 2.75rem;
    height: 1.55rem;
    flex-shrink: 0;
    border-radius: 999px;
    border: 0;
    background: #cfcfcf;
    position: relative;
    cursor: pointer;
    transition: background 0.15s ease;
}

.trip-preferences-step__switch::after {
    content: '';
    position: absolute;
    top: 0.15rem;
    left: 0.15rem;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.15s ease;
}

.trip-preferences-step__switch:checked {
    background: var(--ds-action, #1e5f9e);
}

.trip-preferences-step__switch:checked::after {
    transform: translateX(1.2rem);
}

.trip-preferences-step__comments {
    width: 100%;
}
</style>
