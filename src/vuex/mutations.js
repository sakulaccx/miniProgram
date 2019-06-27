import type from './mutation-types'

export default {
  [type.SET_HISTORY_SEARCH] (state, arr) {
    state.search_history = arr
  },
  [type.SET_DEPART_DATE] (state, dateObj) {
    state.depart_date = {...state.depart_date, ...dateObj}
  },
  [type.SET_USERINFO] (state, userInfo) {
    state.userInfo = {...state.userInfo, ...userInfo}
  },
  [type.SET_DETAIL_DATE] (state, searchDetail) {
    state.detail_date = {...state.detail_date, ...searchDetail}
  },
  [type.SET_FLIGHT_DATE] (state, flightDate) {
    state.flight_date = {...state.flight_date, ...flightDate}
  },
  [type.SET_SEARCH_STR] (state, searchStr) {
    state.search_data = {...state.search_data, ...searchStr}
  },
  [type.SET_FILTER] (state, val) {
    state.isfiltered = val
  }
}
