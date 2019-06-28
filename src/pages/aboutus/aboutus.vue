<template>
  <div class="content">
    <!-- <div class="about-wrap">
      关于我们
    </div> -->
    <div class="about-img">
      <img src="/static/images/aboutus.png" mode="widthFix">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: '',
      height: ''
    }
  },
  methods: {
    imageLoad (e) {
      console.log(e)
      let _width = e.detail.width
      let _height = e.detail.height
      let ratio = _width / _height
      let viewWidth = wx.getSystemInfoSync().windowWidth
      let viewHeight = viewWidth / ratio
      this.width = viewWidth + 'rpx'
      this.height = viewHeight + 'rpx'
      console.log(this.width)
      console.log(this.height)
    }
  },
  mounted () {
  },
  created () {
  // let app = getApp()
  }
}
</script>
<style scoped>
  .about-wrap{
    width: 80%;
    background: #fff;
    margin: 30rpx auto 0 auto;
    font-size: 30rpx;
    padding: 30rpx;
    border-radius: 10rpx;
    box-shadow: 2rpx 2rpx 5rpx 5rpx rgba(166, 166, 166, 0.3)
  }
  .about-img{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: #fff;
  }
  .about-img img{
    width: 100%;
  }
</style>
