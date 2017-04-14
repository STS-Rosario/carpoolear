/*jshint esversion: 6 */
import store from '../store';
import * as types from '../store/mutation-types';

class Notification {
  constructor (e) {
    this.foreground = false;
    this.sound = '';
    this.title = '';
    this.content = '';
    this.type = '';
    this.url = '';
    this._original = {};
    this.coldstart = false;

    if (e) {
      // La aplicacion esta abierta y en pantalla
      this.foreground = e.additionalData.foreground; // Coercion
      this.sound = e.additionalData.sound ? e.additionalData.sound : '';
      this.title = e.title ? e.title : '';
      this.content = e.body ? e.body : (e.message ? e.message : '');
      this.type = e.additionalData.type ? e.additionalData.type : '';
      this.url = e.additionalData.url ? e.additionalData.url : '';
      this.coldstart = e.additionalData.coldstart;
      this._original = e;
    }
  }
}

export default {
  init () {
    let push = window.PushNotification.init({
      android: {
        clearBadge: true,
        senderID: '147151221990591',
        icon: 'icon',
        iconColor: '#6E00A0'
      },
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      },
      ios: {
        'sound': true,
        'alert': true,
        'badge': true,
        'clearBadge': true,
        'categories': {
          'taxi': {
            'yes': {
              'callback': 'app.acceptViaje', 'title': 'Accept', 'foreground': false, 'destructive': false
            },
            'no': {
              'callback': 'app.rejectViaje', 'title': 'Reject', 'foreground': false, 'destructive': true
            }
          }
        }
      },
      windows: {}
    });

    // Registro Exitoso
    push.on('registration', function (data) {
      console.log('Device register successfully', data.registrationId);
      store.commit('cordova/' + types.CORDOVA_DEVICE_REGISTER, data.registrationId);
    });

    push.on('notification', function (data) {
      let n = new Notification(data);
      console.log('Notificacion recived', n);
      store.dispatch('cordova/notificationArrive', n);
    });

    // Registro fail
    push.on('error', function (e, f) {
      console.log('notification error', e, f);
    });
  }
};

