<template>
    <div class="force-upgrade-modal">
        <div class="force-upgrade-content">
            <img
                :src="logoUrl"
                alt="Carpoolear"
                class="force-upgrade-logo"
            />
            <h2 class="force-upgrade-title">Actualización obligatoria</h2>
            <p class="force-upgrade-paragraph">
                La aplicación de Carpoolear necesita actualizarse a la última versión para usar la plataforma, haga click en el botón para hacerlo
            </p>
            <button
                class="force-upgrade-button btn"
                :disabled="isUpdating"
                @click="onActualizarClick"
            >
                {{ isUpdating ? 'Actualizando...' : 'Actualizar' }}
            </button>
        </div>
    </div>
</template>

<script>
import { Capacitor } from '@capacitor/core';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';

export default {
    name: 'ForceUpgradeModal',
    data() {
        return {
            isUpdating: false
        };
    },
    computed: {
        logoUrl() {
            return (
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_logo.png'
            );
        }
    },
    methods: {
        async onActualizarClick() {
            if (!Capacitor.isNativePlatform()) return;
            if (this.isUpdating) return;

            this.isUpdating = true;

            try {
                if (Capacitor.getPlatform() === 'ios') {
                    await AppUpdate.openAppStore();
                } else {
                    const result = await AppUpdate.getAppUpdateInfo();
                    if (
                        result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE &&
                        result.immediateUpdateAllowed
                    ) {
                        await AppUpdate.performImmediateUpdate();
                    } else if (
                        result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE &&
                        result.flexibleUpdateAllowed
                    ) {
                        await AppUpdate.startFlexibleUpdate();
                    } else {
                        await AppUpdate.openAppStore();
                    }
                }
            } catch (error) {
                console.error('Force upgrade error:', error);
                try {
                    await AppUpdate.openAppStore();
                } catch (openStoreError) {
                    console.error('Failed to open app store:', openStoreError);
                }
            } finally {
                this.isUpdating = false;
            }
        }
    }
};
</script>

<style scoped>
.force-upgrade-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
}

.force-upgrade-content {
    max-width: 400px;
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.force-upgrade-logo {
    max-width: 180px;
    height: auto;
    margin-bottom: 24px;
}

.force-upgrade-title {
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 16px;
    color: #333;
}

.force-upgrade-paragraph {
    font-size: 15px;
    line-height: 1.5;
    margin: 0 0 24px;
    color: #555;
}

.force-upgrade-button {
    background-color: #91b64c !important;
    color: #fff !important;
    border: none;
    padding: 12px 32px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
}

.force-upgrade-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>
