<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <favorite-bar :status="favoriteStatus" ref='favorite' />
    <div class="flight-info-wrap">
      <div class="curr-price">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="date-show">{{flightInfo.date}}机票价格</div>
      </div>
      <div class="middle-line"></div>
      <div class="expect-price">
        <div :class="['price-show', 'iconfont', {'green-price icon-iconset0413-after': checkPrice < 0, 'red-price icon-iconset0414-after': checkPrice > 0, 'black-price': checkPrice === 0}]">￥{{flightInfo.expectPrice}}</div>
        <div class="expect-text">预计达到价格</div>
      </div>
    </div>
    <div class="bar-chart-wrap">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
    </div>
    <div class="btn detail-btn" @click="gotoDetail">查看详情</div>
    <time-dialog :show="showTimeDialog" @closeTimeBox="closeTimePopup" />
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import favoriteBar from '@/components/favorite-bar'
import timeDialog from '@/components/time-dialog'
import * as echarts from '../../../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'
import format from '@/utils/dateFormat'
import {mapState, mapMutations} from 'vuex'

let chart = null
let pvalue = ''

export default {
  data () {
    return {
      pagename: '搜索页面',
      showTimeDialog: false,
      favoriteStatus: 0,
      flightInfo: {
        currPrice: 0,
        expectPrice: 0,
        date: ''
      },
      echarts,
      dataAxis: [],
      dataAyis: [],
      zoomStart: 0,
      zoomEnd: 0,
      chartOpt: null
    }
  },

  components: {
    noticeBar,
    favoriteBar,
    timeDialog,
    mpvueEcharts
  },
  computed: {
    checkPrice () {
      return this.flightInfo.expectPrice - this.flightInfo.currPrice
    },
    ...mapState([
      'userInfo',
      'depart_date'
    ])
  },
  methods: {
    ...mapMutations({
      setDepart: 'SET_DEPART_DATE'
    }),
    gotoDetail () {
      wx.navigateTo({url: '../detail/main'})
    },
    initChart (canvas, width, height) {
      let yMax = Math.max(...this.dataAyis)
      let dataShadow = []
      let weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

      for (let i = 0; i < this.dataAyis.length; i++) {
        dataShadow.push(yMax + 200)
      }

      this.chartOpt = {
        grid: {
          left: '5%',
          top: '8%',
          right: '5%',
          bottom: '20%'
        },
        xAxis: {
          data: this.dataAxis,
          axisLabel: {
            interval: 0,
            inside: false,
            textStyle: {
              color: '#42434D'
            },
            formatter: function (value, index) {
              var date = new Date(value * 1)
              var month = date.getMonth() + 1
              var day = date.getDate()
              var weekday = weekdays[date.getDay()]
              var dateStr = month + '月' + day + '日'
              if (pvalue === value) {
                return [
                  '{a|' + dateStr + '}',
                  '{b|' + weekday + '}'
                ].join('\n')
              } else {
                return [
                  '{c|' + dateStr + '}',
                  '{d|' + weekday + '}'
                ].join('\n')
              }
            },
            rich: {
              a: {
                fontSize: 11,
                color: '#EC624C'
              },
              b: {
                fontSize: 12,
                lineHeight: 18,
                color: '#EC624C'
              },
              c: {
                fontSize: 11
              },
              d: {
                fontSize: 12,
                lineHeight: 18
              }
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          show: false
        },
        dataZoom: [{
          type: 'inside',
          xAxisIndex: [0],
          startValue: this.zoomStart,
          endValue: this.zoomEnd
        }],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: { color: '#F8F9FC' }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false
          },
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                var key = params.name
                if (key === pvalue) {
                  return '{a|¥' + params.value + '}'
                } else {
                  return '{b|¥' + params.value + '}'
                }
              },
              rich: {
                a: {
                  color: '#EB5B3E'
                },
                b: {
                  color: '#42434D'
                }
              }
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var key = params.name
                  if (key === pvalue) {
                    return '#2b6cff'
                  } else {
                    return '#e3effc'
                  }
                }
              }
            },
            markLine: {
              silent: true,
              symbol: 'none',
              data: [
                {
                  yAxis: yMax
                }
              ],
              label: {
                show: false
              },
              lineStyle: {
                color: '#ff6c58'
              }
            },
            data: this.dataAyis
          }
        ]
      }

      this.$refs.echarts.init()
    },
    handleInit (canvas, width, height) {
      var _that = this
      chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      canvas.setChart(chart)
      chart.setOption(this.chartOpt)
      chart.on('click', function (params) {
        pvalue = params.name
        let _startValue = 0
        let _endValue = 0
        if (params.dataIndex <= parseInt(_that.dataAxis.length / 2)) {
          _startValue = params.dataIndex - 3 > 0 ? params.dataIndex - 3 : 0
          _endValue = _startValue + 6
        } else {
          _endValue = params.dataIndex + 3 > (_that.dataAxis.length - 1) ? (_that.dataAxis.length - 1) : params.dataIndex + 3
          _startValue = _endValue - 6
        }
        _that.chartOpt.dataZoom[0].startValue = _startValue
        _that.chartOpt.dataZoom[0].endValue = _endValue
        chart.setOption(_that.chartOpt, true)

        let _date = new Date((pvalue * 1))
        let _dateStr = format(_date, 'yyyy-MM-dd')
        _that.changeBar(_dateStr)
      })
      return chart
    },
    showTimeFilter () {
      this.showTimeDialog = true
      chart.clear()
    },
    confirmTime (_obj) {
      console.log(_obj.startTime)
      console.log(_obj.endTime)
    },
    closeTimePopup () {
      this.$fly.all([this.getData()]).then(this.$fly.spread((records, project) => {
        this.showTimeDialog = false
        chart.setOption(this.chartOpt)
      }))
    },
    changeBar (_dateStr) {
      this.$fly.post('/flightData/getAppointDatePrice', {
        departureCityCode: this.depart_date.from_code,
        arrivalCityCode: this.depart_date.target_code,
        departureDate: _dateStr,
        timeSlotList: this.depart_date.time_filter,
        companyList: this.depart_date.company_filter
      }).then(res => {
        if (res.data) {
          let currData = res.data
          let dateInfo = new Date(currData.departureDate)
          let _obj = {
            currPrice: currData.lowestPrice * 1,
            expectPrice: currData.futureLowestPrice * 1,
            date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`
          }
          this.flightInfo = {...this.flightInfo, ..._obj}

          // 同步请求关注数据
          this.$refs.favorite.getFavorite(currData.departureTime, currData.flightNumber, currData.lowestPrice)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getData () {
      return this.$fly.post('/flightData/getSearchResultData', {
        departureCityCode: this.depart_date.from_code,
        arrivalCityCode: this.depart_date.target_code,
        departureDate: this.depart_date.date_search,
        timeSlotList: this.depart_date.time_filter,
        companyList: this.depart_date.company_filter
      }).then(res => {
        if (res.code === '0' && res.data && res.data.list.length > 0) {
          if (res.data.currentData) {
            // 定义变量
            let currData = res.data.currentData
            let dateInfo = new Date(currData.departureDate)
            let dataIndex = 0
            let _startValue = 0
            let _endValue = 0

            // 同步请求关注数据
            this.$refs.favorite.getFavorite(currData.departureTime, currData.flightNumber, currData.lowestPrice)

            // 赋值全局当前时间戳
            pvalue = dateInfo.getTime().toString()

            // 当前日期的价格信息
            let _obj = {
              currPrice: currData.lowestPrice * 1,
              expectPrice: currData.futureLowestPrice * 1,
              date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`
            }
            this.flightInfo = {...this.flightInfo, ..._obj}

            // Charts柱状图处理
            if (res.data.list.length > 0) {
              this.dataAxis = []
              this.dataAyis = []
              res.data.list.forEach((v, i) => {
                let _date = new Date(v.departureDate).getTime()
                this.dataAxis.push(_date)
                this.dataAyis.push(v.lowestPrice)

                // 这个柱状图当前显示的数据
                if (v.departureDate === currData.departureDate) {
                  dataIndex = i
                }
              })

              // 柱状图dataZoom起始和结束的位置
              if (dataIndex <= parseInt(res.data.list.length / 2)) {
                _startValue = dataIndex - 3 > 0 ? dataIndex - 3 : 0
                _endValue = _startValue + 6
              } else {
                _endValue = dataIndex + 3 > (res.data.list.length - 1) ? (res.data.list.length - 1) : dataIndex + 3
                _startValue = _endValue - 6
              }

              this.zoomStart = _startValue
              this.zoomEnd = _endValue

              // 生成柱状图
              this.initChart()

              // 清空filter
              let _dep = {
                time_filter: [],
                company_filter: []
              }
              this.setDepart(_dep)
            }
          }
        } else {
          wx.showToast({
            title: '没有符合条件的数据',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: `${this.depart_date.from_str} - ${this.depart_date.target_str}`
    })
    this.getData()
  },
  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.content{
  background: #f5f5f5;
  height: 100%;
}
.flight-info-wrap{
  background: #fff;
  width: 90%;
  height: 240rpx;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  margin: 20rpx auto 0 auto;
}
.curr-price,
.expect-price{
  width: 50%;
  padding: 30rpx 0;
  text-align: center;
}
.price-show{
  font-size: 52rpx;
  text-align: center;
}
.date-show,
.expect-text{
  font-size: 24rpx;
  color: #66666e;
  text-align: center;
}
.green-price{
  color: #07d428;
}
.red-price{
  color: #ff320b;
}
.black-price{
  color: #000;
}
.middle-line{
  height: 42%;
  border-left: 1px solid #f5f5f5;
}
.bar-chart-wrap{
  width: 100%;
  height: 376rpx;
  background: #fff;
  margin-top: 30rpx;
}
.detail-btn{
  margin: 60rpx auto 0 auto;
  background: #2065ff;
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  border-radius: 44rpx;
  overflow: hidden;
  overflow-x: auto;
}
.chart-show{
  width: 100%;
  height: 100%;
}
</style>
