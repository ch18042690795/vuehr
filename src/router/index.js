import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '/',
      name: '主页',
      component: Home,
      hidden: true,
      meta: {
        requireAuth: true
      }
    }
  ]
})
