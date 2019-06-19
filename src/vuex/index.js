import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'

Vue.use(Vuex)

const state = {
  search_history: [],
  depart_date: {
    date_display: '',
    date_week: '',
    date_search: '',
    from_str: '',
    target_str: '',
    from_code: '',
    target_code: ''
  },
  loginInfo: {
    phone: '',
    islogined: false
  },
  userInfo: {
    openid: '123456',
    unionid: '123456',
    isRegister: 0
  }
}

export default new Vuex.Store({
  state,
  mutations,
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => ''
      }
    })
  ]
})
