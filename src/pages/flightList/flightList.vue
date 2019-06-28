<template>
  <div class="content">
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="desc-bar">
      <div class="left-desc">
        {{search_data.departure_str}} - {{search_data.arrival_str}}
        <span>{{showDateStr}}</span>
      </div>
      <div class="right-desc">
        <i class="iconfont icon-jinggao1"></i>
        请自行去各平台购买
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="tab-wrap">
      <div :class="['tab-item item-1', {'active-tab' : curractive === 0}]" @click="checkTab(0)">
        价格 低 <i class="iconfont icon-youjiantou3"></i> 高
      </div>
      <div :class="['tab-item item-1', {'active-tab' : curractive === 1}]" @click="checkTab(1)">
        起飞 早 <i class="iconfont icon-youjiantou3"></i> 晚
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="list-wrap" v-if="flightList.length > 0">
      <div class="list-item" v-for="(item, index) in flightList" :key="index">
        <div class="item-left-wrap">
          <div class="item-left-top">
            <div class="item-from-info">
              <div class="up-info">{{item.departureTime}}</div>
              <div class="donw-info">{{item.departureAirport}}</div>
            </div>
            <div class="item-middle-line">
              <img src="../../../static/images/arrive-arrow.jpg" alt="">
            </div>
            <div class="item-target-info">
              <div class="up-info">{{item.arrivalTime}}</div>
              <div class="donw-info">{{item.arrivalAirport}}</div>
            </div>
          </div>
          <div class="item-left-bottom">
            {{item.company}} {{item.flightNumber}}
          </div>
        </div>
        <div class="item-right-wrap">¥{{item.lowestPrice}}</div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="no-data" v-else>
      没有查询到数据
    </div>
    <time-dialog :show="showTimeDialog" @closeTimeBox="closeTimePopup" @updateData="updateData" ref="timeBox"/>
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import timeDialog from '@/components/time-dialog-flight'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      curractive: 0,
      orderBy: 2,
      flightList: [
        {
          flightNumber: 'C657',
          company: '东方航空',
          departureAirport: '浦东机场',
          arrivalAirport: '仙桃机场',
          departureTime: '17:00',
          arrivalTime: '20:00',
          lowestPrice: '700'
        },
        {
          flightNumber: 'C659',
          company: '东方航空',
          departureAirport: '浦东机场',
          arrivalAirport: '仙桃机场',
          departureTime: '14:00',
          arrivalTime: '17:00',
          lowestPrice: '900'
        }
      ],
      showTimeDialog: false
    }
  },
  components: {
    noticeBar,
    timeDialog
  },
  computed: {
    ...mapState([
      'search_data',
      'flight_date'
    ]),
    showDateStr () {
      let _date = new Date(this.flight_date.departureDate)
      return `${_date.getMonth() + 1}月${_date.getDate()}日`
    }
  },
  methods: {
    ...mapMutations({
      setFlightDate: 'SET_FLIGHT_DATE'
    }),
    rebindList () {
      this.getListData()
    },
    showTimeFilter () {
      this.showTimeDialog = true
    },
    closeTimePopup () {
      this.showTimeDialog = false
    },
    checkTab (n) {
      if (this.curractive === n) {
        return false
      } else {
        this.curractive = n
        this.orderBy = n === 0 ? 2 : 1
        this.rebindList(n)
      }
    },
    updateData () {
      this.$fly.all([this.getListData()]).then(this.$fly.spread((records, project) => {
        this.showTimeDialog = false
      }))
    },
    getListData () {
      this.$fly.post('/flightData/getFlightDataByDay', {
        departureCityCode: this.flight_date.departureCityCode,
        arrivalCityCode: this.flight_date.arrivalCityCode,
        departureDate: this.flight_date.departureDate,
        timeSlotList: this.flight_date.timeSlotList,
        companyList: this.flight_date.companyList,
        orderBy: this.orderBy
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.flightList = res.data
        } else {
          this.flightList = []
        }
        this.$refs.timeBox.getStoreFromBefore()
        // 获取航空公司
        this.$refs.timeBox.getCompanyList()
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getListData()
  },
  created () {
  // let app = getApp()
  },
  onUnload () {
    this.orderBy = 2
    this.checkTab(0)
    this.showTimeDialog = false
  }
}
</script>

<style scoped>
.tab-wrap{
  width: 88%;
  margin: 30rpx auto 0 auto;
  display: block;
  height: 60rpx;
  line-height: 60rpx;
  background: #fff;
  font-size: 30rpx;
  border: 1px solid #7596E4;
  border-radius: 10rpx;
  color: #7096e9;
  text-align: center;
}
.left-desc,
.right-desc,
.tab-item{
  width: 50%;
}
.active-tab{
  background: #7096e9;
  color: #fff;
}
.left-desc,
.item-1{
  float: left;
}
.right-desc,
.item-2{
  float: right;
}
.iconfont{
  font-size: 28rpx;
  line-height: 60rpx;
  vertical-align: top;
}
.icon-youjiantou3:before{
  color: #7596E4;
}
.active-tab .icon-youjiantou3:before{
  color: #fff;
}
.desc-bar{
  height: 60rpx;
  line-height: 60rpx;
  background: #fff;
  font-size: 28rpx;
  padding: 0 30rpx;
}
.left-desc{
  text-align: left;
  font-size: 28rpx;
  color: #3d3d3d;
}
.left-desc span{
  font-size: 22rpx;
  color: #878787;
  margin-left: 10rpx;
}
.right-desc{
  text-align: right;
  font-size: 22rpx;
  color: #878787;
}
.right-desc .iconfont{
  font-size: 24rpx;
  color: #608ae6;
}
.list-wrap{
  width: 90%;
  margin: 30rpx auto 0 auto;
  color: #3d3d3d;
  height: 80%;
  overflow: hidden;
  overflow-y: auto;
}
.list-item{
  background: #fff;
  border-radius: 20rpx;
  padding: 0 30rpx;
  margin-bottom: 24rpx;
  height: 230rpx;
  overflow: hidden;
}
.item-left-wrap{
  float: left;
  width: 76%;
  height: 100%;
}
.item-left-top{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 54rpx;
}
.item-from-info,
.item-target-info{
  text-align: left;
}
.item-target-info{
  margin-right: 20rpx;
}
.up-info{
  font-size: 40rpx;
}
.donw-info{
  font-size: 24rpx;
  color: #878787;
}
.item-middle-line{
  width: 120rpx;
}
.item-middle-line img{
  width: 100%;
  height: 20rpx;
}
.item-left-bottom{
  font-size: 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  color: #878787;
  margin-top: 10rpx;
}
.item-right-wrap{
  float: right;
  width: 20%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  font-size: 40rpx;
}
.no-data{
  margin-top: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #ccc;
}
</style>
