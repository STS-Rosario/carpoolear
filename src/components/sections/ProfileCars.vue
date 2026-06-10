<template>
    <div class="profile-cars">
        <h1 class="profile-cars__heading visible-xs-block">{{ $t('autos') }}</h1>

        <CarsEditorPanel
            :prompt-incomplete-on-load="true"
            form-modal-name="profile-car-form"
            @updated="onCarsUpdated"
        />
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
    color: #036686;
}
</style>
