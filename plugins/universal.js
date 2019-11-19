import Vue from 'vue'

// plugins
import Multiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'
import VueSwal from 'vue-swal'
import VueContentPlaceholders from 'vue-content-placeholders'
import DateRangePicker from 'vue2-daterange-picker'
// import Notifications from 'vue-notification'
// import Notifications from 'vue-notification/dist/ssr.js'

// stylesheets
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

Vue.prototype.$eventBus = new Vue()

Vue.prototype.$monthLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
Vue.prototype.$monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// usage/registration
Vue.component('multiselect', Multiselect)
Vue.component('date-range-picker', DateRangePicker)
Vue.component('loading', Loading)
Vue.use(VueContentPlaceholders)
Vue.use(VueSwal)
// Vue.use(Notifications)
