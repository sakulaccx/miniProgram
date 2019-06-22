<template>
  <div class="notice-bar">
    <div class="inner-text">您可点击筛选，按照起飞时段选择航班</div>
    <div class="notice-btn" @click="showTimeFilter">筛选></div>
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
    showTimeFilter () {
      this.$emit('showTimeBox')
    }
  },

  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.notice-bar{
  width: 100%;
  height: 54rpx;
  background: #d8e5ff;
  line-height: 54rpx;
}
.inner-text{
  float: left;
  height: 100%;
  color: #4680f6;
  font-size: 28rpx;
  padding-left: 30rpx;
}
.notice-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  color: #fff;
  width: 120rpx;
  height: 42rpx;
  border-radius: 42rpx;
  line-height: 42rpx;
  background: #4680f6;
  font-size: 26rpx;
  text-align: center;
  
}
</style>
