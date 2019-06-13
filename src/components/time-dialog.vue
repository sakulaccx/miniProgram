<template>
  <div class="time-shadow" v-if="show">
    <div class="time-wrap">
      <div class="top-bar">
        <div class="left-close iconfont icon-guanbi2" @click="closePopup"></div>
        <div class="right-reset" @click="resetForm">重置</div>
        <div class="clearfix"></div>
      </div>
      <div class="list-wrap">
        <div class="time-box list-box">
          <div class="list-title">
            <span>起飞时段</span><span>(多选)</span>
          </div>
          <div class="list-subtitle">未选择起飞时段，则展示全部</div>
          <div class="list-item" v-for="(item, index) in timeList">
            <div class="left-title">{{item.label}}</div>
            <div class="right-arrow iconfont icon-select-line"></div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="flight-box list-box"></div>
      </div>
      <div class="btn-wrap">
        <div class="btn confirm-btn">启用</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['show'],
  data () {
    return {
      timeList: [
        {
          label: '00:00 - 06:00',
          value: '00:00 - 06:00'
        },
        {
          label: '06:00 - 12:00',
          value: '06:00 - 12:00'
        },
        {
          label: '12:00 - 18:00',
          value: '12:00 - 18:00'
        },
        {
          label: '18:00 - 00:00',
          value: '18:00 - 00:00'
        }
      ],
      flightList: [
        {
          label: '中国东方航空公司',
          value: 'CES'
        },
        {
          label: '中国国际航空公司',
          value: 'CCA'
        },
        {
          label: '上海吉祥航空公司',
          value: 'DKH'
        },
        {
          label: '中国南方航空公司',
          value: 'CSN'
        }
      ]
    }
  },
  components: {},
  methods: {
    closePopup () {
      this.show = false
    },
    resetForm () {

    }
  },
  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.time-shadow{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000
}
.time-wrap{
  position: relative;
  width: 100%;
  height: 100%;
}
.top-bar{
  height: 80rpx;
  line-height: 80rpx;
  width: 100%;
}
.left-close{
  float: left;
  margin-left: 30rpx;
  font-size: 50rpx;
  color: #4680f6;
}
.right-reset{
  float: right;
  margin-right: 30rpx;
  font-size: 28rpx;
  color: #4680f6;
}
.btn-wrap{
  position: absolute;
  width: 100%;
  bottom: 30rpx;
}
.confirm-btn{
  width: 80%;
  font-size: 16px;
  color: #fff;
  border-radius: 40rpx;
  background: rgb(48, 104, 246);
}
.list-title{
  width: 80%;
  margin: 0 auto;
  position: relative;
  font-size: 30rpx;
}
.list-subtitle{
  width: 80%;
  margin: 0 auto;
  font-size: 24rpx;
  padding-top: 10rpx;
}
.list-title span:first-child{
  margin-left: 30rpx;
}
.list-title:after{
  content: " ";
  display: block;
  height: 100%;
  width: 16rpx;
  position: absolute;
  left: 0;
  top: 0;
  background: #4680f6;
  border-radius: 5rpx;
}
.list-title span:last-child{
  font-size: 24rpx;
  color: #ccc;
}
.list-item{
  margin: 0 auto;
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  border-bottom: 2rpx solid #ccc;
}
.left-title{
  float: left;
  font-size: 26rpx;
  color: #000;
}
.right-arrow{
  float: right;
  font-size: 50rpx;
}
</style>
