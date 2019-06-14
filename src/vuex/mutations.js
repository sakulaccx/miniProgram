import type from './mutation-types'

export default {
  [type.SET_HISTORY_SEARCH] (state, arr) {
    state.search_history = arr
  },
  [type.SET_DEPART_DATE] (state, dateObj) {
    state.depart_date = {...state.depart_date, ...dateObj}
  }
}
