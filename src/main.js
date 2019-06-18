// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'
import config from './Config.js'

/*add by sky Start*/
import MintUI from 'mint-ui'
import './css/style.css'
import './css/UI.css'
import axios from 'axios';



//Compatibility with IE
import Promise from 'promise-polyfill'
if (!window.Promise) {
    window.Promise = Promise;
}
Vue.use(MintUI)
/*add by sky End*/

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCzDiLMhMwZGPQvFS9kCqysvBhs6LB4KTY'
  }
})

import { Lazyload } from 'mint-ui';
Vue.use(Lazyload);


import VueCordova from 'vue-cordova'
Vue.use(VueCordova)

import VueTouch from 'vue-touch'

VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})

Vue.use(VueTouch);


Vue.component('shoptemplate', require('./components/ShopTemplate.vue') )
Vue.component('circletemplate', require('./components/CircleTemplate.vue') )
Vue.component('lifeadvertisetemplate', require('./components/LifeAdvertiseTemplate.vue') )
Vue.component('advertisetemplate', require('./components/AdvertiseTemplate.vue') )



Vue.config.productionTip = false

Vue.config.errorHandler = function (err, vm, info) {
 //alert(err + " " + info) 
 Vue.cordova.on('deviceready', () => {  
   var model = device.model;
   var platform = device.platform;
   var version = device.version;
   var manufacturer = device.manufacturer;
   var uuid = device.uuid;
   var error = "info:" + new Date() + " " + info + " " + platform + " " + version + " " + manufacturer
    axios.post('http://utahhome.net/webapiv2/' + 'api/ExceptionLogs/', {
    Model:model,
    Platform:platform, 
    Version:version,
    Manufacturer:manufacturer,
    Message: err + " " + info,
    Uuid:uuid
    })
    .then(response => {    
     
    })
    .catch(e => {    
   
    })
 })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
