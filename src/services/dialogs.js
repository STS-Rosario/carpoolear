/* jshint esversion: 6 */
require('../../node_modules/alertifyjs/build/css/alertify.min.css');
import alertifyjs from '../../node_modules/alertifyjs/build/alertify.min.js';
import cordovaToast from '../cordova/toast.js';

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
        console.log(options);
        if (window && window.plugins && window.plugins.toast && window.plugins.toast.showWithOptions) {
            if (options.duration) {
                options.duration = options.duration * 1000;
            }
            cordovaToast.toast(text, successCallback, options);
        } else {
            alertifyjs.notify(text, options.estado, options.duration, successCallback);
        }
    }
};
