<template>
    <div class="tabset clearfix" :class="orientationClass()">
        <!-- Nav tabs -->
        <ul
            v-if="orientation != 'bottom' && orientation != 'right'"
            class="nav nav-tabs"
            :class="activeTabClass"
            role="tablist"
        >
            <li class="nav-item" v-for="(tab, $index) in tabs">
                <a
                    class="nav-link"
                    :class="{ active: tab.active, disabled: tab.disabled }"
                    :href="'#' + $index"
                    role="tab"
                    data-toggle="tab"
                    @click.stop.prevent="activateTab($index)"
                >
                    {{ tab.header }}
                </a>
            </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content">
            <slot></slot>
        </div>

        <!-- Nav tabs -->
        <ul
            v-if="orientation == 'bottom' || orientation == 'right'"
            class="nav nav-tabs"
            role="tablist"
        >
            <li class="nav-item" v-for="(tab, $index) in tabs">
                <a
                    class="nav-link"
                    :class="{ active: tab.active, disabled: tab.disabled }"
                    :href="'#' + $index"
                    role="tab"
                    data-toggle="tab"
                    @click.stop.prevent="activateTab($index)"
                >
                    {{ tab.header }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';

const props = defineProps({
    orientation: {
        type: String,
        default: 'top'
    },
    keytabset: {
        type: String,
        default: 'tabset'
    },
    rememberTab: {
        type: Boolean,
        default: false
    }
});

const tabs = ref([]);
const activeTabIndex = ref(0);

const activeTabClass = computed(() => {
    return 'active-' + activeTabIndex.value;
});

function orientationClass() {
    return 'tabs-' + props.orientation;
}

function activateTab(index, ensure) {
    activeTabIndex.value = index;
    if (props.rememberTab) {
        if (window.sessionStorage && !ensure) {
            window.sessionStorage.setItem(
                props.keytabset + '_last_active_tab',
                activeTabIndex.value
            );
        }
    }
    var tab = tabs.value[index];
    if (tab && !tab.disabled) {
        if (index === 'first') {
            index = 0;
        } else if (index === 'last') {
            index = tabs.value.length - 1;
        }
        tabs.value.forEach(function (tab, idx) {
            tab.active = idx === index;
        });
    }
}

function getRememberedTab(defaultValue) {
    if (props.rememberTab) {
        if (window.sessionStorage) {
            let savedIndex = window.sessionStorage.getItem(
                props.keytabset + '_last_active_tab'
            );
            if (savedIndex) {
                return parseInt(savedIndex, 10);
            }
        }
    }
    return defaultValue;
}

function ensureActiveTab() {
    var activeTab = 0;
    tabs.value.forEach((tab, index) => {
        if (tab.active) {
            activeTab = index;
        }
    });
    activateTab(activeTab, true);
}

function registerTab(tab) {
    tab.id = tabs.value.length;
    tabs.value.push(tab);
    ensureActiveTab();
}

function removeTab(tab) {
    let index = tabs.value.findIndex((item) => item.id === tab.id);
    if (index >= 0) {
        tabs.value.splice(index, 1);
    }
    ensureActiveTab();
}

provide('tabset', {
    registerTab,
    removeTab
});
</script>
