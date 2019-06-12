<template>
  <div class="content">
    <notice-bar />
    <favorite-bar />
    <div class="flight-info-wrap">
      <div class="curr-price">
        <div class="price-show">￥{{flightInfo.currPrice}}</div>
        <div class="date-show">{{flightInfo.date}}机票价格</div>
      </div>
      <div class="middle-line"></div>
      <div class="expect-price">
        <div :class="['price-show', 'iconfont', {'green-price icon-downarrow-after': checkPrice < 0, 'red-price icon-uparrow-after': checkPrice > 0}]">￥{{flightInfo.expectPrice}}</div>
        <div class="expect-text">预计达到价格</div>
      </div>
    </div>
    <div class="bar-chart-wrap"></div>
    <div class="btn detail-btn" @click="gotoDetail">查看详情</div>
  </div>
</template>

<script>
import noticeBar from '@/components/notice-bar'
import favoriteBar from '@/components/favorite-bar'

export default {
  data () {
    return {
      pagename: '搜索页面',
      flightInfo: {
        currPrice: 700,
        expectPrice: 200,
        date: '4月1日'
      }
    }
  },

  components: {
    noticeBar,
    favoriteBar
  },
  computed: {
    checkPrice () {
      return this.flightInfo.expectPrice - this.flightInfo.currPrice
    }
  },
  methods: {
    gotoDetail () {
      console.log('go to detail page')
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.content{
  background: #f5f5f5;
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
  padding: 30rpx 50rpx;
}
.price-show{
  font-size: 52rpx;
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
  margin: 30rpx auto 0 auto;
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
</style>
