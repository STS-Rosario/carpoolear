import { Preferences } from '@capacitor/preferences';

class NativeStorage {
    async setItem(key, value) {
        try {
            // Convert value to string for Capacitor Preferences compatibility
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await Preferences.set({ key, value: stringValue });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async removeItem(key) {
        try {
            await Preferences.remove({ key });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async getItem(key) {
        try {
            const result = await Preferences.get({ key });
            if (result.value === null) {
                throw new Error('Item not found');
            }
            
            // Try to parse as JSON, fallback to string if parsing fails
            try {
                return JSON.parse(result.value);
            } catch {
                return result.value;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async clear() {
        try {
            await Preferences.clear();
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export { NativeStorage as default };
