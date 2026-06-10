<template>
    <modal
        v-if="visible"
        :name="'trip-cars-modal'"
        @close="$emit('close')"
    >
        <template #header>
            <h4>{{ $t('autos') }}</h4>
        </template>
        <template #body>
            <CarsEditorPanel
                :active="visible"
                form-modal-name="trip-car-form"
                @updated="$emit('updated')"
            />
        </template>
    </modal>
</template>

<script>
import modal from '../Modal';
import CarsEditorPanel from './CarsEditorPanel.vue';

export default {
    name: 'trip-cars-modal',
    components: {
        modal,
        CarsEditorPanel
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'updated']
};
</script>
