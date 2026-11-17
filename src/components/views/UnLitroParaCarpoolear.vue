<template>
    <AccountSettingsLayout>
        <UnLitroParaCarpoolearContent />
    </AccountSettingsLayout>
</template>

<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import UnLitroParaCarpoolearContent from '../elements/UnLitroParaCarpoolearContent.vue';
import router from '../../router';
import bus from '../../services/bus-event.js';

export default {
    name: 'UnLitroParaCarpoolear',
    components: { AccountSettingsLayout, UnLitroParaCarpoolearContent },
    mounted() {
        bus.on('back-click', this.onBackClick);
    },
    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    },
    methods: {
        onBackClick() {
            router.back();
        }
    }
};
</script>
