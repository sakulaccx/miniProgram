<template>
  <div class="content">
    <Calendar
      ref="calendar"
      :events="cevents"
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
import format from '@/utils/dateFormat'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      currDate: '2019-04-05',
      monthRange: [],
      rangeMonthFormat: 'yyyy年MM月',
      cevents: {},
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
  computed: {
    ...mapState([
      'depart_date',
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setDate: 'SET_DEPART_DATE',
      setSearchStr: 'SET_SEARCH_STR'
    }),
    select (val, val2) {
      const info = this.$refs.calendar.dateInfo(val[0], val[1], val[2])
      let monthDate = info.cMonth > 9 ? info.cMonth : `0${info.cMonth}`
      let dayDate = info.cDay > 9 ? info.cDay : `0${info.cDay}`
      this.setDate({departureDate: `${info.cYear}-${monthDate}-${dayDate}`})
      this.setSearchStr({date_display: `${info.cMonth}月${info.cDay}日`})
      wx.switchTab({url: '/pages/search/main'})
    },
    set90DaysRange () {
      let currDate = new Date(this.currDate)
      let currYear = currDate.getFullYear()
      let currMonth = currDate.getMonth() + 1
      this.date90 = new Date(currDate.setMonth(currDate.getMonth() + 2))
      this.date90Year = this.date90.getFullYear()
      this.date90Month = this.date90.getMonth() + 1

      this.monthRange = [`${currYear}-${currMonth}`, `${this.date90Year}-${this.date90Month}`]
    },
    setDisableDays () {
      let currDate = new Date(this.currDate)
      let _today = currDate.getDate()
      let _targetDate = new Date(this.currDate)
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

      // 补足30或31天
      for (var ii = 1; ii < 50; ii++) {
        var _newdate = new Date(this.currDate)
        var _45date = new Date(_newdate.setDate(_newdate.getDate() + 44))
        var _targetdate = new Date(_45date.setDate(_45date.getDate() + ii))

        this.dateDisabled.push(`${_targetdate.getFullYear()}-${_targetdate.getMonth() + 1}-${_targetdate.getDate()}`)
      }
    },
    getPriceDate () {
      this.$fly.post('/flightData/calendarPriceData', {
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.setPriceDate(res.data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setPriceDate (priceList) {
      let _tpl = {}
      let _currdate = new Date(this.currDate)
      priceList.forEach((v, i) => {
        let _date = new Date(v.departureDate)
        if (_date >= _currdate) {
          let key = format(_date, 'yyyy-M-d')
          _tpl[key] = '¥' + v.lowestPrice
        }
      })
      this.cevents = _tpl
    }
  },
  mounted () {
    this.set90DaysRange()
    this.setDisableDays()
    this.getPriceDate()
  },
  created () {
  // let app = getApp()
  }
}
</script>

<style scoped>
page,
.content{
  overflow-y: auto;
}
.mpvue-calendar ._td.selected ._span{
  border-radius: 20rpx;
}
</style>
