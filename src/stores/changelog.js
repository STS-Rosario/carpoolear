import { defineStore } from 'pinia';
import { ChangelogApi } from '../services/api';
import { sortChangelogsBySemverDesc } from '../utils/changelogSort';

const changelogApi = new ChangelogApi();

export const useChangelogStore = defineStore('changelog', {
    state: () => ({
        currentEntry: null,
        probedVersion: null,
        publicList: null,
        publicListProbed: false,
        adminList: null
    }),
    getters: {
        hasCurrentVersionChangelog(state) {
            return !!state.currentEntry;
        },
        hasAnyChangelog(state) {
            return Array.isArray(state.publicList) && state.publicList.length > 0;
        }
    },
    actions: {
        fetchForVersion(version) {
            return changelogApi
                .fetchForVersion(version)
                .then((response) => {
                    const entry = response.data || null;
                    this.currentEntry = entry;
                    this.probedVersion = version;
                    return entry;
                })
                .catch((error) => {
                    this.currentEntry = null;
                    this.probedVersion = version;
                    return Promise.reject(error);
                });
        },
        probeForVersion(version) {
            if (this.probedVersion === version) {
                return Promise.resolve(this.currentEntry);
            }
            return this.fetchForVersion(version).catch(() => null);
        },
        fetchAll() {
            return changelogApi
                .fetchAll()
                .then((response) => {
                    const rows = sortChangelogsBySemverDesc(response.data || []);
                    this.publicList = rows;
                    this.publicListProbed = true;
                    return rows;
                })
                .catch((error) => {
                    this.publicList = [];
                    this.publicListProbed = true;
                    return Promise.reject(error);
                });
        },
        probePublicList() {
            if (this.publicListProbed) {
                return Promise.resolve(this.publicList || []);
            }
            return this.fetchAll().catch(() => []);
        },
        fetchAdminList() {
            this.adminList = null;
            return changelogApi
                .adminList()
                .then((response) => {
                    const rows = response.data || [];
                    this.adminList = rows;
                    return rows;
                })
                .catch((error) => {
                    this.adminList = [];
                    return Promise.reject(error);
                });
        },
        fetchAdminOne(id) {
            return changelogApi.adminShow(id).then((response) => response.data);
        },
        adminCreate(payload) {
            return changelogApi.adminCreate(payload).then((response) => response.data);
        },
        adminUpdate(id, payload) {
            return changelogApi.adminUpdate(id, payload).then((response) => response.data);
        },
        adminDelete(id) {
            return changelogApi.adminDelete(id);
        }
    }
});
