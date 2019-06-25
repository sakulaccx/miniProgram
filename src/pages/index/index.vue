<template>
  <div class="index-wrap">
    <img src="/static/images/launch.jpg" alt="">
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      aaa: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    })
  },
  onLoad () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.$fly.post('/login/getOpenid', {
          jsCode: res.code
        }).then(res => {
          if (res.code === '0') {
            let _obj = {}
            if (res.data.isRegister === '1') {
              _obj = {
                openid: res.data.openid,
                unionid: res.data.unionid,
                isRegister: (res.data.isRegister * 1),
                phone: res.data.phone
              }
            } else {
              _obj = {
                openid: res.data.openid,
                unionid: res.data.unionid,
                isRegister: (res.data.isRegister * 1)
              }
            }
            this.setUserInfo(_obj)
            wx.switchTab({
              url: '/pages/search/main'
            })
          } else {
            this.setUserInfo({
              openid: '123456',
              unionid: '123456',
              phone: '18616291931',
              isRegister: 0
            })
            wx.switchTab({
              url: '/pages/search/main'
            })
            // 测试
            // wx.showModal({
            //   title: '提示',
            //   content: '请求用户数据失败，请稍后再试',
            //   showCancel: false,
            //   confirmText: '确定',
            //   success: function (res) {
            //     wx.navigateBack({
            //       delta: -1
            //     })
            //   }
            // })
          }
        }).catch(err => {
          console.log(err)
          this.setUserInfo({
            openid: '123456',
            unionid: '123456',
            phone: '18616291931',
            isRegister: 0
          })
          wx.switchTab({
            url: '/pages/search/main'
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '请求用户数据失败，请稍后再试',
          //   showCancel: false,
          //   confirmText: '确定',
          //   success: function (res) {
          //     wx.navigateBack({
          //       delta: -1
          //     })
          //   }
          // })
        })
      }
    })
  },
  mounted () {
  },
  created () {
  // let app = getApp()
  }
}
</script>
<style scoped>
.index-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.index-wrap img{
  width: 100%;
  height: 100%;
}
</style>
