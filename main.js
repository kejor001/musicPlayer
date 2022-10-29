import Vue from 'vue'
import App from './App'
import store from './store/index.js'

Vue.config.productionTip = false
Vue.prototype.$store=store
App.mpType = 'app'
import PubFn from 'common/js/utils.js'
Vue.prototype.$pubFn=PubFn;

const app = new Vue({
    ...App
})
app.$mount()
