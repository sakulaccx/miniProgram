<template>
  <div class="content">
    <Calendar
      ref="calendar"
      :events="events"
      :now="'今天'"
      :monthRange="monthRange"
      :rangeMonthFormat="rangeMonthFormat"
      :clean="false"
      :lunar="true"
      @select="select"
      :almanacs="almanacs"
    />
  </div>

</template>

<script>
import Calendar from 'mpvue-calendar'
import 'mpvue-calendar/src/style.css'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      weekarr: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      monthRange: ['2019-5', '2020-4'],
      rangeMonthFormat: 'yyyy年MM月',
      events: {'2019-5-1': '¥600', '2019-5-8': '¥300', '2020-4-5': '¥1400'},
      almanacs: {
        '1-1': '元旦'
      }
    }
  },
  components: {
    Calendar
  },
  methods: {
    ...mapMutations({
      setDate: 'SET_DEPART_DATE'
    }),
    select (val, val2) {
      const info = this.$refs.calendar.dateInfo(val[0], val[1], val[2])
      let monthDate = info.cMonth > 9 ? info.cMonth : `0${info.cMonth}`
      let dayDate = info.cDay > 9 ? info.cDay : `0${info.cDay}`
      let _obj = {
        date_display: `${info.cMonth}月${info.cDay}日`,
        date_search: `${info.cYear}-${monthDate}-${dayDate}`,
        date_week: `${this.weekarr[info.nWeek]}`
      }
      this.setDate(_obj)
      wx.navigateTo({url: '../index/main'})
    }
  },
  created () {
  // let app = getApp()
  }
}
</script>

<style scoped>
.mpvue-calendar ._td.selected ._span{
  border-radius: 20rpx;
}
</style>
