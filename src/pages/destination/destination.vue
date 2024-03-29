<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="favorite-bar" v-if="!favoriteStatus && hasData">
      <div class="iconfont icon-jinggao inner-text">当前价格较高，建议您持续关注</div>
      <div class="iconfont icon-buoumaotubiao44 favorite-btn" @click="saveFavorite">添加关注</div>
      <div class="clearfix"></div>
    </div>
    <div class="favorite-list" v-if="favoriteStatus  && hasData">
      <div class="iconfont icon-jinggao inner-text">已关注，进入关注列表查看更多</div>
      <div class="favorite-btn" @click="gotoFavoriteListOnTop">关注列表</div>
      <div class="clearfix"></div>
    </div>
    <div class="flight-info-wrap">
      <div class="curr-price">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="date-show">{{flightInfo.date}}最低机票价格</div>
      </div>
      <div class="middle-line"></div>
      <div class="expect-price">
        <div :class="['price-show', 'iconfont', {'green-price icon-iconset0413-after': checkPrice < 0, 'red-price icon-iconset0414-after': checkPrice > 0, 'black-price': checkPrice === 0}]">￥{{flightInfo.expectPrice}}</div>
        <div class="expect-text">预计未来达到价格</div>
      </div>
    </div>
    <div class="bar-chart-wrap" v-if="!showTimeDialog">
      <mpvue-echarts lazyLoad :echarts="echarts" :onInit="handleInit" ref="echarts" />
    </div>
    <div class="btn detail-btn" @click="gotoDetail" v-if="hasData">查看详情</div>
    <time-dialog :show="showTimeDialog" @closeTimeBox="closeTimePopup" @updateData="updateData" ref="timeBox"/>
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import timeDialog from '@/components/time-dialog'
import * as echarts from '@/../static/lib/echarts.min.js'
import mpvueEcharts from 'mpvue-echarts'
import format from '@/utils/dateFormat'
import {mapState, mapMutations} from 'vuex'

let chart = null
let pname = ''
let pvalue = 0

export default {
  data () {
    return {
      hasData: true,
      pagename: '搜索页面',
      showTimeDialog: false,
      favoriteStatus: 0,
      departureDate: '',
      flightInfo: {
        currPrice: 0,
        expectPrice: 0,
        date: '',
        departureTime: '',
        flightNumber: '',
        timeSlotList: [],
        companyList: []
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
    timeDialog,
    mpvueEcharts
  },
  computed: {
    checkPrice () {
      return this.flightInfo.expectPrice - this.flightInfo.currPrice
    },
    ...mapState([
      'userInfo',
      'depart_date',
      'detail_date',
      'search_data'
    ])
  },
  methods: {
    ...mapMutations({
      setDepart: 'SET_DEPART_DATE',
      setDetailSearch: 'SET_DETAIL_DATE'
    }),
    gotoDetail () {
      this.setDetailSearch({
        timeSlotList: this.depart_date.timeSlotList,
        companyList: this.depart_date.companyList
      })
      wx.navigateTo({url: '/pages/detail/main'})
    },
    initChart (canvas, width, height) {
      var _that = this
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
          data: _that.dataAxis,
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
              if (pname === value) {
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
          startValue: _that.zoomStart,
          endValue: _that.zoomEnd
        }],
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: {
                // color: '#000'
                color: function (param) {
                  return (param['company'] === _that.dataAxis[param.dataIndex]) ? 'rgb(255, 255, 255, 0)' : 'rgb(248, 249, 252)'
                }
              }
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            animation: false,
            silent: true
          },
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              formatter: function (params) {
                var key = params.name
                if (key === pname) {
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
                  if (key === pname) {
                    return '#4A9FEF'
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
                  yAxis: pvalue
                }
              ],
              label: {
                show: false
              },
              lineStyle: {
                color: '#ff6c58'
              }
            },
            data: _that.dataAyis
          }
        ]
      }

      // 初始化控件
      // this.$refs.echarts.init()
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
        pname = params.name
        pvalue = params.value
        let _startValue = 0
        let _endValue = 0
        if (params.dataIndex <= parseInt(_that.dataAxis.length / 2)) {
          _startValue = params.dataIndex - 3 > 0 ? params.dataIndex - 3 : 0
          _endValue = _startValue + 6
        } else {
          _endValue = params.dataIndex + 3 > (_that.dataAxis.length - 1) ? (_that.dataAxis.length - 1) : params.dataIndex + 3
          _startValue = _endValue - 6
        }
        _that.chartOpt.series[1].markLine.data[0].yAxis = pvalue
        _that.chartOpt.dataZoom[0].startValue = _startValue
        _that.chartOpt.dataZoom[0].endValue = _endValue
        chart.setOption(_that.chartOpt, true)

        let _date = new Date((pname * 1))
        let _dateStr = format(_date, 'yyyy-MM-dd')
        _that.departureDate = _dateStr
        // _that.setDepart({departureDate: _dateStr})
        _that.changeBar()
      })
      return chart
    },
    disposeChart () {
      if (chart && !chart._disposed) {
        chart.clear()
        chart.dispose()
      }
    },
    reInitChart () {
      this.initChart()
      this.$refs.echarts.init()
    },
    showTimeFilter () {
      this.disposeChart()
      this.showTimeDialog = true
    },
    closeTimePopup () {
      setTimeout(() => {
        if (this.hasData) {
          this.reInitChart()
        }
      }, 100)
      this.showTimeDialog = false
    },
    showAuthorityDialog (level) {
      if (level === 0) {
        wx.showModal({
          title: '提示',
          content: '检测到您尚未关注公众号，如需要查看关注列表，请先关注公众号',
          showCancel: true,
          confirmText: '确定',
          cancelText: '关闭',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({url: '/pages/showQRCode/main'})
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '检测到您尚未登录，如需要查看关注列表，请先登录',
          showCancel: true,
          confirmText: '确定',
          cancelText: '关闭',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({url: '/pages/user/main'})
            }
          }
        })
      }
    },
    updateData () {
      this.disposeChart()
      this.showTimeDialog = false
      this.$refs.timeBox.getStoreFromBefore()
      this.$fly.all([this.getData()]).then(this.$fly.spread((records, project) => {
        if (this.hasData) {
          // 请求关注数据
          this.getFavorite(this.flightInfo.departureTime, this.flightInfo.flightNumber, this.flightInfo.currPrice)

          this.reInitChart()
        }
      }))
    },
    changeBar () {
      this.$fly.post('/flightData/getAppointDatePrice', {
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode,
        departureDate: this.departureDate,
        timeSlotList: this.depart_date.timeSlotList,
        companyList: this.depart_date.companyList
      }).then(res => {
        if (res.data) {
          this.hasData = true
          let currData = res.data
          let dateInfo = new Date(currData.departureDate)
          let _obj = {
            currPrice: currData.lowestPrice * 1,
            expectPrice: currData.futureLowestPrice * 1,
            date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`,
            departureTime: currData.departureTime,
            flightNumber: currData.flightNumber
          }
          this.flightInfo = {...this.flightInfo, ..._obj}
          this.setDetailSearchInfo(currData)

          // 同步请求关注数据
          this.getFavorite(currData.departureTime, currData.flightNumber, currData.lowestPrice)
        } else {
          this.hasData = false
          let dateInfo = new Date(this.depart_date.departureDate)
          let _obj = {
            currPrice: 0,
            expectPrice: 0,
            date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`
          }
          this.flightInfo = {...this.flightInfo, ..._obj}
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getData () {
      return this.$fly.post('/flightData/getSearchResultData', {
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode,
        departureDate: this.depart_date.departureDate,
        timeSlotList: this.depart_date.timeSlotList,
        companyList: this.depart_date.companyList
      }).then(res => {
        if (res.code === '0' && res.data) {
          if (res.data.currentData) {
            // 定义变量
            let currData = res.data.currentData
            let dateInfo = new Date(currData.departureDate)
            let dataIndex = 0
            let _startValue = 0
            let _endValue = 0

            this.hasData = true

            // 当前日期的价格信息
            let _obj = {
              currPrice: currData.lowestPrice * 1,
              expectPrice: currData.futureLowestPrice * 1,
              date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`,
              departureTime: currData.departureTime,
              flightNumber: currData.flightNumber
            }
            this.flightInfo = {...this.flightInfo, ..._obj}

            // 赋值全局当前时间戳
            pname = dateInfo.getTime().toString()
            pvalue = _obj.currPrice

            // Charts柱状图处理
            if (res.data.list.length > 0) {
              this.dataAxis = []
              this.dataAyis = []
              res.data.list.forEach((v, i) => {
                let _date = new Date(v.departureDate).getTime()
                this.dataAxis.push(_date)
                this.dataAyis.push(v.lowestPrice)

                // 柱状图当前显示的数据
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
              this.setDetailSearchInfo(currData)
            }
          } else {
            wx.showToast({
              title: '没有对应的数据',
              icon: 'none'
            })
            this.hasData = false
            let dateInfo = new Date(this.depart_date.departureDate)
            let _obj = {
              currPrice: 0,
              expectPrice: 0,
              date: `${dateInfo.getMonth() + 1}月${dateInfo.getDate()}日`
            }
            this.flightInfo = {...this.flightInfo, ..._obj}
          }
        } else {
          wx.showToast({
            title: '没有对应的数据',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setDetailSearchInfo (_obj) {
      // 详情页查询数据
      let _detail = {
        departureCityCode: _obj.departureCityCode,
        arrivalCityCode: _obj.arrivalCityCode,
        departureDate: _obj.departureDate,
        actionFlag: _obj.actionFlag,
        timeSlotList: this.depart_date.timeSlotList,
        companyList: this.depart_date.companyList
      }
      this.setDetailSearch(_detail)
      setTimeout(() => {
        this.$refs.timeBox.getCompanyList()
      }, 100)
    },
    getFavorite (depTime, flyNum, lowPrice) {
      // 赋值请求参数
      this.departureTime = depTime
      this.flightNumber = flyNum
      this.lowestPrice = lowPrice

      // 查询是否已关注
      this.$fly.post('/attention/isAttention', {
        openid: this.userInfo.openid,
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode,
        departureTime: depTime,
        flightNumber: flyNum
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = res.data * 1
          // this.lowestPrice = lowPrice
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveFavorite () {
      // 正式代码
      if (!this.userInfo.unionid) {
        this.showAuthorityDialog(0)
      } else if (!this.userInfo.isRegister) {
      // if (!this.userInfo.isRegister) {
        this.showAuthorityDialog(1)
      } else {
        this.addFavorite()
      }
    },
    addFavorite () {
      this.$fly.post('/attention/add', {
        openid: this.userInfo.openid,
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        actionFlag: this.detail_date.actionFlag,
        departureTime: this.departureTime,
        flightNumber: this.flightNumber,
        lowestPrice: this.lowestPrice
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = 1
          // this.runNotifactionTrack()
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: err.msg,
          icon: 'none'
        })
      })
    },
    gotoFavoriteListOnTop () {
      if (this.userInfo.isRegister) {
        // wx.switchTab({
        //   url: '/pages/follow/main'
        // })
        wx.navigateTo({url: '../../pages/interest/main'})
      } else {
        this.showAuthorityDialog(1)
      }
    },
    runNotifactionTrack () {
      this.$fly.get('/attention/updateNotes')
    }
  },
  mounted () {
    // 清空filter数据
    this.setDepart({
      timeSlotList: [],
      companyList: []
    })

    wx.setNavigationBarTitle({
      title: `${this.search_data.departure_str} - ${this.search_data.arrival_str}`
    })
  },
  created () {
    // let app = getApp()
  },
  onPullDownRefresh () {
    wx.showNavigationBarLoading()
    this.$fly.all([this.getData()]).then(this.$fly.spread((records, project) => {
      if (this.hasData) {
        this.getFavorite(this.flightInfo.departureTime, this.flightInfo.flightNumber, this.flightInfo.currPrice)

        this.reInitChart()
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }))
  },
  onUnload () {
    this.showTimeDialog = false
    this.setDepart({
      timeSlotList: [],
      companyList: []
    })
    this.$refs.timeBox.clearFormParent()
  },
  onShow () {
    // 重置出发时间
    this.setDetailSearch({
      departureDate: this.departureDate,
      departureTime: '',
      flightNumber: ''
    })

    // 刷新数据
    this.$fly.all([this.getData()]).then(this.$fly.spread((records, project) => {
      if (this.hasData) {
        this.getFavorite(this.flightInfo.departureTime, this.flightInfo.flightNumber, this.flightInfo.currPrice)
        setTimeout(() => {
          // 初始化chart控件
          this.reInitChart()
        }, 100)
      }
    }))
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
  color: #33333e;
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
  color: #66666e;
}
.middle-line{
  height: 42%;
  border-left: 1px solid #eaeaea;
}
.bar-chart-wrap{
  width: 100%;
  height: 376rpx;
  background: #fff;
  margin-top: 30rpx;
}
.detail-btn{
  margin: 60rpx auto 0 auto;
  background: #4A9FEF;
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
  border-radius: 44rpx;
  border: 0 none;
  overflow: hidden;
  overflow-x: auto;
}
.chart-show{
  width: 100%;
  height: 100%;
}
.no-data{
  margin-top: 30rpx;
  color: #ccc;
  font-size: 30rpx;
  text-align: center;
}
/* Favorite bar */
.favorite-list,
.favorite-bar{
  width: 100%;
  height: 54rpx;
  line-height: 54rpx;
  background: #fee1cf;
}
.favorite-bar .inner-text{
  float: left;
  height: 100%;
  padding-left: 30rpx;
  color: #ff6500;
  font-size: 28rpx;
}
.favorite-bar .icon-jinggao:before{
  font-size: 28rpx;
  margin-right: 10rpx;
}
.favorite-bar .favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 42rpx;
  height: 42rpx;
  line-height: 42rpx;
  text-align: center;
  color: #fff;
  background: #ED6E2D;
  font-size: 26rpx;
}
.favorite-bar .icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
.favorite-list{
  background: #9af3ad;
}
.favorite-list .inner-text{
  float: left;
  height: 100%;
  padding-left: 30rpx;
  color: #1cb152;
  font-size: 28rpx;
}
.favorite-list .icon-jinggao:before{
  font-size: 28rpx;
  margin-right: 10rpx;
}
.favorite-list .favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 42rpx;
  height: 42rpx;
  line-height: 42rpx;
  text-align: center;
  color: #fff;
  background: #1cb152;
  font-size: 26rpx;
}
.favorite-list .icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
</style>
