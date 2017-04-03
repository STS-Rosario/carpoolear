
import cordovaSocialShare from '../cordova/socialShare.js'

export default {
  share (opts) { 
    var options = {
        message: 'Aplicación para compartir viajes de autos dentro de Argentina', // not supported on some apps (Facebook, Instagram)
        subject: 'Carpoolear', // fi. for email
        files: [], // an array of filenames either locally or remotely
        url: 'https://carpoolear.com.ar',
        chooserTitle: 'Compartir con ...' // Android only, you can override the default share sheet title
    }

    options = Object.assign(options, opts);

    if(window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
        cordovaSocialShare.share();
    } else {
        //Not implemented yet
    }
  }
}