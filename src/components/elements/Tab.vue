<template>
    <div
        role="tabpanel"
        class="tab-pane container"
        :class="{ active: active }"
        :id="id"
    >
        <slot></slot>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, inject } from 'vue';

const props = defineProps({
    header: {
        type: String
    },
    disabled: {
        type: Boolean,
        default: false
    },
    onSelected: {
        type: Function,
        default: () => {}
    }
});

const id = ref('');
const _active = ref(false);

const active = computed({
    get() {
        return _active.value;
    },
    set(val) {
        _active.value = val;
        if (val) {
            props.onSelected();
        }
    }
});

const tabset = inject('tabset');

onMounted(() => {
    const tab = {
        header: props.header,
        disabled: props.disabled,
        id: null,
        get active() { return active.value; },
        set active(val) { active.value = val; }
    };
    tabset.registerTab(tab);
    id.value = tab.id;
});

onBeforeUnmount(() => {
    tabset.removeTab({ id: id.value });
});
</script>
