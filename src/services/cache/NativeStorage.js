import { Preferences } from '@capacitor/preferences';

class NativeStorage {
    setItem(key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                // Convert value to string for Capacitor Preferences compatibility
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                await Preferences.set({ key, value: stringValue });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    removeItem(key) {
        return new Promise(async (resolve, reject) => {
            try {
                await Preferences.remove({ key });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    getItem(key) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Preferences.get({ key });
                if (result.value === null) {
                    reject(new Error('Item not found'));
                    return;
                }

                // Try to parse as JSON, fallback to string if parsing fails
                try {
                    const parsed = JSON.parse(result.value);
                    resolve(parsed);
                } catch (parseError) {
                    resolve(result.value);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    clear() {
        return new Promise(async (resolve, reject) => {
            try {
                await Preferences.clear();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export { NativeStorage as default };
