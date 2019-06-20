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
          this.setUserInfo(res.data)
        }).catch(err => {
          console.log(err)
          this.setUserInfo({
            openid: '123456',
            unionid: '123456',
            isRegister: 0
          })
        })
        wx.redirectTo({
          url: '../search/main'
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
