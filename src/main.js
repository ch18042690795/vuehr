// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import {initMenu} from './utils/utils'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest
Vue.use(ElementUI)
import './utils/filter_utils'

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {

  initMenu(router, store)
  next()

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

