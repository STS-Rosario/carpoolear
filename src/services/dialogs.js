/* jshint esversion: 6 */
import alertifyModule from 'alertifyjs/build/alertify.min.js';
import cordovaToast from '../cordova/toast.js';
import 'alertifyjs/build/css/alertify.min.css';

const alertifyjs = (
    alertifyModule &&
    (alertifyModule.notify ? alertifyModule : alertifyModule.default)
) || (typeof window !== 'undefined' ? window.alertify : null);

export default {
    message(text, options = {}, successCallback = null) {
        if (typeof successCallback !== 'function') {
            successCallback = function () {};
        }
        const defaultOptions = {
            duration: 2,
            position: 'center',
            estado: 'success'
        };
        if (!options) {
            options = {};
        }
        options = Object.assign(defaultOptions, options);
        if (
            window &&
            window.plugins &&
            window.plugins.toast &&
            window.plugins.toast.showWithOptions &&
            window.device &&
            window.device.platform !== 'browser'
        ) {
            if (options.duration) {
                options.duration = options.duration * 1000;
            }
            cordovaToast.toast(text, successCallback, options);
        } else {
            if (alertifyjs && typeof alertifyjs.notify === 'function') {
                alertifyjs.notify(
                    text,
                    options.estado,
                    options.duration,
                    successCallback
                );
            } else {
                console.warn('Alertify notify is not available');
                successCallback();
            }
        }
    }
};
