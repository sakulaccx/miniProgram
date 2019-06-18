<template>
  <div class="content">
    <div class="loading-wrap" v-if="isLoading">
      <van-loading color="#3068F6"/>
    </div>
    <notice-bar @showTimeBox="showTimeFilter" />
    <div class="desc-bar">
      <div class="left-desc">
        {{depart_date.from_str}} - {{depart_date.target_str}}
        <span>{{depart_date.date_display}}</span>
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
    <div class="list-wrap">
      <div class="list-item" v-for="(item, index) in flightList" :key="index">
        <div class="item-left-wrap">
          <div class="item-left-top">
            <div class="item-from-info"></div>
            <i class="iconfont icon-xianzhongzhuandaodachang"></i>
            <div class="item-target-info"></div>
          </div>
          <div class="item-left-bottom">
            {{item.company}} {{item.flightNumber}}
          </div>
        </div>
        <div class="item-right-wrap">¥{{item.lowestPrice}}</div>
        <div class="clearfix"></div>
      </div>
    </div>
    <time-dialog :show="showTimeDialog" @selectedTime="confirmTime" @closeTimeBox="closeTimePopup" />
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import timeDialog from '@/components/time-dialog'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      isLoading: true,
      curractive: 0,
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
      'depart_date'
    ])
  },
  methods: {
    ...mapMutations({
      setDate: 'SET_DEPART_DATE'
    }),
    showLoading () {
    },
    hideLoading () {
    },
    rebindList (index) {
      console.log(index)
    },
    showTimeFilter () {
      this.showTimeDialog = true
      // chart.clear()
    },
    closeTimePopup () {
      this.showTimeDialog = false
      // chart.setOption(this.chartOpt)
    },
    confirmTime (_obj) {
      console.log(_obj.startTime)
      console.log(_obj.endTime)
    },
    checkTab (n) {
      if (this.curractive === n) {
        return false
      } else {
        this.curractive = n
        this.rebindList(n)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.isLoading = false
    }, 1000)
  },
  created () {
  // let app = getApp()
  }
}
</script>

<style scoped>
.content{
  height: 100%;
  overflow: hidden;
  background: rgb(245, 245, 245);
}
.loading-wrap{
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
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
  color: #7596E4;
  text-align: center;
}
.left-desc,
.right-desc,
.tab-item{
  width: 50%;
}
.active-tab{
  background: #7596E4;
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
}
.left-desc span{
  font-size: 24rpx;
  color: #A1A2A3;
  margin-left: 10rpx;
}
.right-desc{
  text-align: right;
  font-size: 24rpx;
  color: #A1A2A3;
}
.right-desc .iconfont{
  font-size: 24rpx;
  color: #7596E4;
}
.list-wrap{
  width: 90%;
  margin: 30rpx auto 0 auto;
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
  width: 80%;
  height: 100%;
}
.item-left-top{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
.item-left-bottom{
  font-size: 24rpx;
  height: 60rpx;
  line-height: 60rpx;
  color: #A1A2A3;
}
.item-right-wrap{
  float: right;
  width: 20%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  font-size: 52rpx;
}
</style>
