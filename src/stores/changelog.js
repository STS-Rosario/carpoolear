import { defineStore } from 'pinia';
import { ChangelogApi } from '../services/api';

const changelogApi = new ChangelogApi();

export const useChangelogStore = defineStore('changelog', {
    state: () => ({
        currentEntry: null,
        probedVersion: null,
        adminList: null
    }),
    getters: {
        hasCurrentVersionChangelog(state) {
            return !!state.currentEntry;
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
