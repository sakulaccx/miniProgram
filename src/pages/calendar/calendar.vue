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
      :almanacs="almanacs"
      :disabled="dateDisabled"
      @select="select"
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
      monthRange: [],
      rangeMonthFormat: 'yyyy年MM月',
      events: {
        '2019-6-7': '¥600',
        '2019-6-11': '¥600',
        '2019-6-18': '¥300',
        '2019-7-5': '¥1400'
      },
      date90: null,
      date90Year: '',
      date90Month: '',
      date45: null,
      date45Year: '',
      date45Month: '',
      date45Date: '',
      dateDisabled: []
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
    },
    set90DaysRange () {
      let currDate = new Date()
      let currYear = currDate.getFullYear()
      let currMonth = currDate.getMonth() + 1
      this.date90 = new Date(currDate.setMonth(currDate.getMonth() + 2))
      this.date90Year = this.date90.getFullYear()
      this.date90Month = this.date90.getMonth() + 1

      this.monthRange = [`${currYear}-${currMonth}`, `${this.date90Year}-${this.date90Month}`]
    },
    setDisableDays () {
      let currDate = new Date()
      let _today = currDate.getDate()
      let _targetDate = new Date()
      this.date45 = new Date(_targetDate.setDate(_targetDate.getDate() + 44))
      this.date45Year = this.date45.getFullYear()
      this.date45Month = this.date45.getMonth() + 1
      this.date45Date = this.date45.getDate()

      // console.log()
      if (_today > 1) {
        for (var i = 1; i < _today; i++) {
          this.dateDisabled.push(`${currDate.getFullYear()}-${currDate.getMonth() + 1}-${i}`)
        }
      }

      for (var ii = 1; ii < 50; ii++) {
        var _newdate = new Date()
        var _45date = new Date(_newdate.setDate(_newdate.getDate() + 44))
        var _targetdate = new Date(_45date.setDate(_45date.getDate() + ii))

        this.dateDisabled.push(`${_targetdate.getFullYear()}-${_targetdate.getMonth() + 1}-${_targetdate.getDate()}`)
      }
    }
  },
  mounted () {
    this.set90DaysRange()
    this.setDisableDays()
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
