/*!

=========================================================
* Vue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/* COMPONENTS */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import VueSweetalert2 from 'vue-sweetalert2'
import Popper from 'vue-popperjs';
import VueSingleSelect from "vue-single-select";
import VueCurrencyInput from 'vue-currency-input'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faCloudUploadAlt, faRedoAlt, faTimes, faTag, faPercent, faMoneyBillWave, faMoneyCheckAlt, faHandHoldingUsd, faUserPlus, faFolderPlus, faRedo, faUserEdit, faPager, faEdit, faTrash, faClipboard, faShoppingCart} from '@fortawesome/free-solid-svg-icons'
import endPoint from '../config-endpoint/endpoint.js'
import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"
import 'vue-progress-path/dist/vue-progress-path.css'
import VueProgress from 'vue-progress-path'
import VueCarousel from 'vue-carousel';
import Antd from 'ant-design-vue';
import formatPrice from '@/plugins/formatPrice';
import 'ant-design-vue/dist/antd.css';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import formatDate from '@/plugins/formatDate';
import vuescroll from 'vuescroll';
import VuePhoneNumberInput from 'vue-phone-number-input';
import VueHtmlToPaper from 'vue-html-to-paper';
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

// You can set global config here.
Vue.use(vuescroll)

/* STYLES */
import VueFormWizard from 'vue-form-wizard'

/* STYLES */
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'vue-popperjs/dist/vue-popper.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

/* Currency input */
Vue.config.productionTip = false
const pluginOptions = {globalOptions: { currency: {'prefix':'$ '}, precision: 0, distractionFree: false, autoDecimalMode:false}}
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}
/* USES*/
Vue.use(Antd);
Vue.component('vue-phone-number-input', VuePhoneNumberInput);
Vue.component('vue-single-select', VueSingleSelect);
Vue.use(VueCurrencyInput, pluginOptions)
Vue.use(ArgonDashboard)
Vue.use(VueSweetalert2);
Vue.use(Popper)
Vue.use(Vuesax)
Vue.use(formatDate)
Vue.use(VueHtmlToPaper, options)
Vue.use(formatPrice)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueFormWizard)

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO(endPoint.endpointTarget)
  })
);
Vue.use(VueProgress)
Vue.use(VueCarousel);

/* FONTS LIBRARY */
library.add(faUserSecret, faCloudUploadAlt, faRedoAlt, faTimes, faTag, faPercent, faMoneyBillWave, faMoneyCheckAlt, faHandHoldingUsd, faUserPlus, faFolderPlus, faRedo, faUserEdit, faPager, faEdit, faTrash, faClipboard, faShoppingCart)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
