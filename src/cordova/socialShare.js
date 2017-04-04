/*jshint esversion: 6 */

import cordovaToast from './toast';

export default {
  share (options) { 
    /*var options = {
        message: 'Aplicación para compartir viajes de autos dentro de Argentina', // not supported on some apps (Facebook, Instagram)
        subject: 'Carpoolear', // fi. for email
        files: [], // an array of filenames either locally or remotely
        url: 'https://carpoolear.com.ar',
        chooserTitle: 'Carpoolear' // Android only, you can override the default share sheet title
    }*/



    var onSuccess = function(result) {
        console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
        console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    };

    var onError = function(msg) {
        console.log("Sharing failed with message: " + msg);
    };
    if(window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
        if(cordovaToast && cordovaToast.toast) {
            cordovaToast.toast("Buscando aplicaciones para compartir, espere ...");
        }
        console.log("SHARE PLUGIN", options);
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    } else {
        console.error("ERROR: Se llamó al social plugin pero no se encontró");
    }
    
  }

};