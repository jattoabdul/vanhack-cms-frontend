import Vue from 'vue'
import Ripple from 'vue-ripple-directive'
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: []
}

Vue.use(VueHtmlToPaper, options)

Ripple.color = 'rgba(255, 255, 255, 0.35)'

Ripple.zIndex = 3

Vue.directive('ripple', Ripple)
