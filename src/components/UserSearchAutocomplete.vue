<template>
    <div class="user-search-autocomplete">
        <input
            ref="inputRef"
            v-model.trim="inputText"
            type="text"
            class="form-control"
            :class="inputClass"
            :disabled="disabled"
            :placeholder="placeholder"
            autocomplete="off"
            @input="scheduleSearch"
            @keydown.down.prevent="moveHighlight(1)"
            @keydown.up.prevent="moveHighlight(-1)"
            @keydown.enter.prevent="confirmHighlight"
            @keydown.escape="closeDropdown"
        />
        <ul
            v-if="dropdownOpen"
            class="list-group user-search-autocomplete__results"
            role="listbox"
        >
            <li
                v-for="(row, idx) in options"
                :key="row.id"
                class="list-group-item"
                :class="{ active: idx === highlightIndex }"
                role="option"
                @mousedown.prevent="pick(row)"
            >
                {{ row.id }} - {{ row.name || '—' }} ({{ row.email || '—' }})
            </li>
            <li
                v-if="!loading && inputText && !options.length"
                class="list-group-item text-muted"
            >
                {{ $t('noSeEncontroNingunUsuario') }}
            </li>
            <li v-if="loading" class="list-group-item text-muted">
                <img
                    v-if="showLoader"
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoUsuarios') }}
            </li>
        </ul>
    </div>
</template>

<script>
import { AdminApi } from '../services/api';

const DEBOUNCE_MS = 250;

export default {
    name: 'user-search-autocomplete',
    props: {
        modelValue: {
            type: Object,
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxResults: {
            type: Number,
            default: 8
        },
        inputClass: {
            type: String,
            default: ''
        },
        showLoader: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:modelValue', 'cleared'],
    data() {
        return {
            inputText: '',
            options: [],
            loading: false,
            dropdownOpen: false,
            highlightIndex: -1,
            debounceTimer: null,
            adminApi: null,
            syncingFromModel: false
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(user) {
                this.syncingFromModel = true;
                if (user && user.id) {
                    const label = `${user.id} - ${user.name || ''}`.trim();
                    this.inputText = label;
                } else if (!this.inputText) {
                    this.inputText = '';
                }
                this.$nextTick(() => {
                    this.syncingFromModel = false;
                });
            }
        }
    },
    mounted() {
        this.adminApi = new AdminApi();
    },
    beforeUnmount() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    },
    methods: {
        scheduleSearch() {
            if (this.syncingFromModel) {
                return;
            }
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }
            const term = this.inputText;
            if (!term) {
                this.options = [];
                this.loading = false;
                this.dropdownOpen = false;
                this.highlightIndex = -1;
                this.$emit('update:modelValue', null);
                this.$emit('cleared');
                return;
            }
            this.$emit('update:modelValue', null);
            this.debounceTimer = setTimeout(() => {
                this.runSearch(term);
            }, DEBOUNCE_MS);
        },
        async runSearch(term) {
            this.loading = true;
            this.dropdownOpen = true;
            this.highlightIndex = -1;
            try {
                const response = await this.adminApi.searchUsers({ name: term });
                const rows = Array.isArray(response.data) ? response.data : [];
                this.options = rows.slice(0, this.maxResults);
            } catch (e) {
                this.options = [];
            } finally {
                this.loading = false;
            }
        },
        pick(user) {
            this.dropdownOpen = false;
            this.highlightIndex = -1;
            this.syncingFromModel = true;
            this.inputText = `${user.id} - ${user.name || ''}`.trim();
            this.$nextTick(() => {
                this.syncingFromModel = false;
            });
            this.$emit('update:modelValue', user);
        },
        moveHighlight(delta) {
            if (!this.options.length) {
                return;
            }
            let next = this.highlightIndex + delta;
            if (next < 0) {
                next = this.options.length - 1;
            } else if (next >= this.options.length) {
                next = 0;
            }
            this.highlightIndex = next;
        },
        confirmHighlight() {
            if (this.highlightIndex >= 0 && this.options[this.highlightIndex]) {
                this.pick(this.options[this.highlightIndex]);
            }
        },
        closeDropdown() {
            this.dropdownOpen = false;
            this.highlightIndex = -1;
        }
    }
};
</script>

<style scoped>
.user-search-autocomplete {
    position: relative;
}

.user-search-autocomplete__results {
    margin-top: 6px;
    max-height: 240px;
    overflow: auto;
    cursor: pointer;
    background: #fff;
    position: absolute;
    z-index: 50;
    left: 0;
    right: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.user-search-autocomplete__results .list-group-item {
    color: #333;
    background: #fff;
}

.user-search-autocomplete__results .list-group-item:hover,
.user-search-autocomplete__results .list-group-item.active {
    background: #f5f5f5;
}
</style>
