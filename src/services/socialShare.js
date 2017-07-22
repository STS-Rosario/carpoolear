/* jshint esversion: 6 */
import cordovaSocialShare from '../cordova/socialShare.js';

export default {
    share (opts) {
        var options = {
            message: 'Aplicación para compartir viajes de autos dentro de Argentina', // not supported on some apps (Facebook, Instagram)
            subject: 'Carpoolear', // fi. for email
            files: [], // an array of filenames either locally or remotely
            url: 'https://carpoolear.com.ar',
            chooserTitle: 'Compartir con ...' // Android only, you can override the default share sheet title
        };
        if (!opts) {
            opts = {};
        }
        options = Object.assign(options, opts);

        if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
            cordovaSocialShare.share(options);
        } else {
            // Not implemented yet
            console.warn('Warning: Social share without cordova not implemented yet.');
        }
    }
};
