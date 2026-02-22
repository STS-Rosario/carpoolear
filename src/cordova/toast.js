/* jshint esversion: 6 */
export default {
    async toast(options, onSuccess, onError) {
        let message = '';
        let duration = 2000;
        let position = 'center';
        if (typeof options === 'string' || options instanceof String) {
            message = options;
        } else if (options && typeof options === 'object') {
            message = options.message || '';
            duration = options.duration || 2000;
            position = options.position || 'center';
        }

        try {
            // Check if we're in Capacitor environment
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                // Use Capacitor Toast plugin for native platforms
                const { Toast } = await import('@capacitor/toast');

                const toastOptions = {
                    text: message,
                    duration: duration >= 4000 ? 'long' : 'short',
                    position: position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : 'center'
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
                        duration: duration,
                        position: position
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
