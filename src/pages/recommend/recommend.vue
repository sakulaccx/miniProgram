<template>
  <div class="content">
    <div class="recommend-wrap">
      <div class="recommend-text-wrap">
        <textarea cols="30" rows="20" v-model="recommendVal" placeholder="请输入您的意见反馈..."></textarea>
      </div>
      <div class="mark-line"></div>
      <div class="contact-wrap">
        <input
         type="text"
         placeholder="请输入QQ、邮箱或者联系电话(三选一)"
         v-model="contactVal" />
      </div>
    </div>
    <div class="btn submit-btn" @click="submitRecommend">提交</div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      recommendVal: '',
      contactVal: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    submitRecommend () {
      if (this.recommendVal.length === 0) {
        wx.showToast({
          title: '请输入您的宝贵意见',
          icon: 'none'
        })
        return false
      } else if (this.contactVal.length === 0) {
        wx.showToast({
          title: '请输入QQ、邮箱或者联系电话',
          icon: 'none'
        })
        return false
      } else {
        let submitObj = {
          openId: this.userInfo.openid,
          contact: this.contactVal,
          opinion: this.recommendVal
        }

        this.$fly.post('/feedback/add', submitObj).then(res => {
          wx.showToast({
            title: '非常感谢您的宝贵意见',
            icon: 'none'
          })
          this.recommendVal = ''
          this.contactVal = ''
          setTimeout(() => {
            wx.switchTab({url: '/pages/user/main'})
          }, 500)
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '网络不流畅，请稍后再试',
            icon: 'none'
          })
        })
      }
    }
  },
  mounted () {
  },
  created () {
  // let app = getApp()
  },
  onShow () {
    if (!this.userInfo.isRegister) {
      wx.showModal({
        title: '提示',
        content: '登录后可以提交您的宝贵意见',
        showCancel: false,
        confirmText: '确定',
        success: function (res) {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  }
}
</script>
<style scoped>
  .recommend-wrap{
    width: 90%;
    margin: 30rpx auto 0 auto;
    background: #fff;
    box-shadow: 2rpx 2rpx 2rpx 2rpx rgba(126, 126, 126, 0.2);
  }
  .recommend-text-wrap{
    padding: 20rpx 30rpx;
  }
  .recommend-text-wrap textarea{
    width: 100%;
    font-size: 26rpx;
  }
  .mark-line{
    width: 92%;
    margin: 0 auto;
    height: 2rpx;
    border-bottom: 2rpx solid #ccc;
  }
  .contact-wrap input{
    height: 60rpx;
    line-height: 60rpx;
    padding-left: 30rpx;
    font-size: 26rpx;
  }
  .submit-btn{
    width: 70%;
    border-radius: 50rpx;
    background: #2065ff;
    color: #fff;
    text-align: center;
    font-size: 28rpx;
    border: 0 none;
    margin-top: 60rpx;
    height: 60rpx;
    line-height: 60rpx;
  }
</style>
