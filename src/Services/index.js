/*
    Vue Plugin 
    Install all services on Vue System
*/

import Network from './network.js';
import Auth from './auth.js';
import Api from './Api';

function plugin(Vue) { 
    
    if (plugin.installed) {
        return;
    }     
    
    Network.install(Vue);
    
    //Vue.$network = Network;
    //Vue.$auth = Auth; 

    //Vue.$auth.setAuthToken("1234567890");

    Vue.prototype.$network = Network;
    Vue.prototype.$auth = Auth; 
    Vue.prototype.$api = Api; 
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin)
}

export default plugin
