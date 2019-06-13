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
          <div class="list-item" v-for="(item, index) in timeList" :key="index" @click='saveTimeRange(item)' :class="item.iselected ? 'selected-item' : ''">
            <div class="left-title">{{item.label}}</div>
            <div class="right-arrow iconfont icon-select-line"></div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="flight-box list-box">
          <div class="list-title">
            <span>航空公司</span><span>(多选)</span>
          </div>
          <div class="list-subtitle">未选择航空公司，则展示全部</div>
          <div class="list-item" v-for="(item, index) in flightList" :key="index" :class="item.iselected ? 'selected-item' : ''" @click='selectFlightNo(item)'>
            <div class="left-title">{{item.label}}</div>
            <div class="right-arrow iconfont icon-select-line"></div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <div class="btn confirm-btn" @click="userFilter">启用</div>
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
          value: '00:00 - 06:00',
          range: 0,
          iselected: false
        },
        {
          label: '06:00 - 12:00',
          value: '06:00 - 12:00',
          range: 1,
          iselected: false
        },
        {
          label: '12:00 - 18:00',
          value: '12:00 - 18:00',
          range: 2,
          iselected: false
        },
        {
          label: '18:00 - 00:00',
          value: '18:00 - 00:00',
          range: 3,
          iselected: false
        }
      ],
      flightList: [
        {
          label: '中国东方航空公司',
          value: 'CES',
          iselected: false
        },
        {
          label: '中国国际航空公司',
          value: 'CCA',
          iselected: false
        },
        {
          label: '上海吉祥航空公司',
          value: 'DKH',
          iselected: false
        },
        {
          label: '中国南方航空公司',
          value: 'CSN',
          iselected: false
        }
      ],
      timeRage: [],
      flightCode: []
    }
  },
  components: {},
  methods: {
    closePopup () {
      this.$emit('closeTimeBox')
    },
    resetForm () {
      this.timeList.forEach((v, i) => {
        v.iselected = false
      })
      this.flightList.forEach((v, i) => {
        v.iselected = false
      })
      this.timeRage = []
      this.flightCode = []
    },
    saveTimeRange (_obj) {
      if (!_obj.iselected) {
        _obj.iselected = true
        this.timeRage.push(_obj)
      } else {
        _obj.iselected = false
        this.timeRage.forEach((v, i) => {
          if (v.value === _obj.value) {
            this.timeRage.splice(i, 1)
          }
        })
      }
    },
    selectFlightNo (_obj) {
      if (!_obj.iselected) {
        _obj.iselected = true
        this.flightCode.push(_obj)
      } else {
        _obj.iselected = false
        this.flightCode.forEach((v, i) => {
          if (v.value === _obj.value) {
            this.flightCode.splice(i, 1)
          }
        })
      }
    },
    userFilter () {
      let _tplarr = []
      this.timeRage.sort((a, b) => {
        return a['range'] - b['range']
      })
      this.timeRage.forEach((v, i) => {
        _tplarr.push({
          range: v.value
        })
      })

      let _tplarr2 = []
      this.flightCode.forEach((v, i) => {
        _tplarr2.push({
          code: v.value
        })
      })
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
  background: #f5f5f5;
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
  font-size: 60rpx;
  color: #7796E3;
}
.right-reset{
  float: right;
  margin-right: 32rpx;
  font-size: 28rpx;
  color: #7796E3;
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
  width: 87%;
  margin: 0 auto;
  position: relative;
  font-size: 32rpx;
}
.list-subtitle{
  width: 87%;
  margin: 0 auto;
  font-size: 24rpx;
  padding-top: 10rpx;
  color: #848484;
}
.list-title span:first-child{
  margin-left: 30rpx;
}
.list-title:before{
  content: " ";
  display: block;
  height: 100%;
  width: 16rpx;
  position: absolute;
  left: 0;
  top: 0;
  background: #7796E3;
  border-radius: 5rpx;
}
.list-title span:last-child{
  font-size: 24rpx;
  color: #848484;
}
.list-item{
  margin: 0 auto;
  width: 87%;
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
  color: #b5b5b5;
}
.selected-item .left-title,
.selected-item .right-arrow{
  color: #7796E3;
}
.flight-box{
  margin-top: 60rpx;
}
</style>
