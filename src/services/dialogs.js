/* jshint esversion: 6 */
import alertifyjs from '../../node_modules/alertifyjs/build/alertify.min.js';
import cordovaToast from '../cordova/toast.js';
require('../../node_modules/alertifyjs/build/css/alertify.min.css');

export default {
    message (text, options = {}, successCallback = null) {
        if (typeof successCallback !== 'function') {
            successCallback = function () { };
        }
        var defaultOptions = {
            duration: 2,
            position: 'center',
            estado: 'success'
        };
        if (!options) {
            options = {};
        }
        options = Object.assign(defaultOptions, options);
        if (window && window.plugins && window.plugins.toast && window.plugins.toast.showWithOptions && window.device && window.device.platform !== 'browser') {
            if (options.duration) {
                options.duration = options.duration * 1000;
            }
            cordovaToast.toast(text, successCallback, options);
        } else {
            alertifyjs.notify(text, options.estado, options.duration, successCallback);
        }
    }
};
