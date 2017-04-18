/* jshint esversion: 6 */
export default {
    toast (options, onSuccess, onError) {
        var message = '';
        if (typeof options === 'string' || options instanceof String) {
            message = options;
        }
        if (window && window.plugins && window.plugins.toast && window.plugins.toast.showWithOptions) {
            window.plugins.toast.showWithOptions({
                message: message,
                duration: message.duration ? message.duration : 2000, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
                position: message.position ? message.position : 'center'
            },
            onSuccess, // optional
            onError    // optional
        );
        } else {
            console.error('ERROR: Se llamó al toast plugin pero no se encontró');
        }
    }
};
