<template>
  <div class="favorite-bar">
    <div class="iconfont icon-jinggao inner-text">当前价格较高，建议您持续关注</div>
    <div class="iconfont icon-buoumaotubiao44 favorite-btn" @click="saveFavorite">添加关注</div>
    <div class="clearfix"></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      aa: ''
    }
  },

  components: {},

  methods: {
    saveFavorite () {
      console.log('bbbbbbbb')
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.favorite-bar{
  width: 100%;
  height: 60rpx;
  background: #fee1cf;
}
.inner-text{
  float: left;
  height: 100%;
  line-height: 50rpx;
  padding-left: 30rpx;
  color: #ff7216;
  font-size: 28rpx;
}
.icon-jinggao:before{
  font-size: 38rpx;
  margin-right: 10rpx;
}
.favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #fff;
  background: #ff6500;
  font-size: 26rpx;
}
.icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
</style>
