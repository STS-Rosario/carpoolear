<template>
    <div class="profile-cars">
        <div class="profile-cars__card">
            <h1 class="profile-cars__heading">{{ $t('autos') }}</h1>
            <CarsEditorPanel
                :prompt-incomplete-on-load="true"
                form-modal-name="profile-car-form"
                @updated="onCarsUpdated"
            />
        </div>
    </div>
</template>

<script>
import CarsEditorPanel from '../elements/CarsEditorPanel.vue';

export default {
    name: 'profile-cars',
    components: {
        CarsEditorPanel
    },
    methods: {
        onCarsUpdated() {}
    }
};
</script>

<style scoped>
.profile-cars {
    color: var(--main-font-color, #555);
}

.profile-cars__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

.profile-cars__card {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--profile-card-bg, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

@media only screen and (max-width: 768px) {
    .profile-cars {
        padding: 1em;
    }
}
</style>
