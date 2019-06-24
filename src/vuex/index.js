import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'

import mutations from './mutations'

Vue.use(Vuex)

const state = {
  search_data: {
    date_display: '',
    departure_str: '',
    arrival_str: ''
  },
  depart_date: {
    departureDate: '',
    departureCityCode: '',
    arrivalCityCode: '',
    timeSlotList: [],
    companyList: [],
    actionFlag: ''
  },
  detail_date: {
    departureCityCode: '',
    arrivalCityCode: '',
    departureDate: '',
    timeSlotList: [],
    companyList: [],
    actionFlag: ''
  },
  userInfo: {
    openid: '',
    unionid: '',
    phone: '',
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
