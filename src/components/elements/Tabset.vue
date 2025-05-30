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
<!--
<style lang="sass" src="./tabs.scss"></style>
-->

<script type="text/babel">
export default {
    props: {
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
    },
    data: function () {
        return {
            tabs: [],
            activeTabIndex: 0
        };
    },
    computed: {
        activeTabClass: function () {
            return 'active-' + this.activeTabIndex;
        }
    },
    methods: {
        orientationClass: function () {
            return 'tabs-' + this.orientation;
        },
        activateTab: function (index, ensure) {
            this.activeTabIndex = index;
            if (this.rememberTab) {
                if (window.sessionStorage && !ensure) {
                    window.sessionStorage.setItem(
                        this.keytabset + '_last_active_tab',
                        this.activeTabIndex
                    );
                }
            }
            var tab = this.tabs[index];
            if (tab && !tab.disabled) {
                if (index === 'first') {
                    index = 0;
                } else if (index === 'last') {
                    index = this.tabs.length - 1;
                } // end if
                this.tabs.forEach(function (tab, idx) {
                    tab.active = idx === index;
                });
            } // end if
        },
        getRememberedTab: function (defaultValue) {
            if (this.rememberTab) {
                if (window.sessionStorage) {
                    let savedIndex = window.sessionStorage.getItem(
                        this.keytabset + '_last_active_tab'
                    );
                    if (savedIndex) {
                        return parseInt(savedIndex, 10);
                    }
                }
            }
            return defaultValue;
        },
        ensureActiveTab: function () {
            var activeTab = 0;
            this.tabs.forEach((tab, index) => {
                if (tab.active) {
                    activeTab = index;
                } // end if
            });
            this.activateTab(activeTab, true);
        },
        registerTab: function (tab) {
            tab.id = this.tabs.length;
            this.tabs.push(tab);
            this.ensureActiveTab();
        },
        removeTab(tab) {
            let index = this.tabs.findIndex((item) => item.id === tab.id);
            if (index >= 0) {
                this.tabs.splice(index, 1);
            }
            this.ensureActiveTab();
        }
    }
};
</script>
