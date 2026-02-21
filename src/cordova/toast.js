/* jshint esversion: 6 */
export default {
    async toast(options, onSuccess, onError) {
        let message = '';
        if (typeof options === 'string' || options instanceof String) {
            message = options;
        }

        try {
            // Check if we're in Capacitor environment
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                // Use Capacitor Toast plugin for native platforms
                const { Toast } = await import('@capacitor/toast');

                const toastOptions = {
                    text: message,
                    duration: message.duration === 4000 ? 'long' : 'short',
                    position: message.position === 'top' ? 'top' : message.position === 'bottom' ? 'bottom' : 'center'
                };

                await Toast.show(toastOptions);

                if (onSuccess) onSuccess();
            } else if (
                window &&
                window.plugins &&
                window.plugins.toast &&
                window.plugins.toast.showWithOptions
            ) {
                // Fallback to Cordova plugin for web or legacy environments
                window.plugins.toast.showWithOptions(
                    {
                        message: message,
                        duration: message.duration ? message.duration : 2000,
                        position: message.position ? message.position : 'center'
                    },
                    onSuccess,
                    onError
                );
            } else {
                // Fallback to console log if no toast plugin available
                console.log('📱 Toast message:', message);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.error('Toast error:', error);
            // Fallback to console log
            console.log('📱 Toast message (fallback):', message);
            if (onError) onError(error);
        }
    }
};
