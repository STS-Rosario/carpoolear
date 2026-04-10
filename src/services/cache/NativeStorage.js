import { Preferences } from '@capacitor/preferences';

class NativeStorage {
    setItem(key, value) {
        return (async () => {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await Preferences.set({ key, value: stringValue });
        })();
    }

    removeItem(key) {
        return (async () => {
            await Preferences.remove({ key });
        })();
    }

    getItem(key) {
        return (async () => {
            const result = await Preferences.get({ key });
            if (result.value === null) {
                throw new Error('Item not found');
            }

            try {
                return JSON.parse(result.value);
            } catch (parseError) {
                return result.value;
            }
        })();
    }

    clear() {
        return (async () => {
            await Preferences.clear();
        })();
    }
}

export { NativeStorage as default };
