import Vue from 'vue'
import App from './App'
import store from './vuex'
import './../static/styles/icon/iconfont.css'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store

const app = new Vue(App)
app.$mount()

export default {
  config: {
    pages: [],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '第一个小程序',
      navigationBarTextStyle: 'black'
    }
  }
}
