<template>
  <div class="content">
    <div class="img-wrap">
      <img src="/static/images/WechatIMG592.jpg" data-src="/static/images/WechatIMG592.jpg" alt="" mode="widthFix" show-menu-by-longpress="true">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      aaa: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    getUserInfo () {
      wx.login({
        success: res => {
          this.$fly.post('/login/getOpenid', {
            jsCode: res.code
          }).then(res1 => {
            let _obj = {}
            if (res1.data.isRegister === '1') {
              _obj = {
                openid: res1.data.openid,
                unionid: res1.data.unionid === null ? 0 : 1,
                isRegister: (res1.data.isRegister * 1),
                phone: res1.data.phone
              }
            } else {
              _obj = {
                openid: res1.data.openid,
                unionid: res1.data.unionid === null ? 0 : 1,
                isRegister: (res1.data.isRegister * 1)
              }
            }
            this.setUserInfo(_obj)
          })
        }
      })
    }
  },
  mounted () {
  },
  created () {
  // let app = getApp()
  },
  onUnload () {
    // this.getUserInfo()
  }
}
</script>
<style scoped>
.img-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.img-wrap img{
  width: 100%;
}
</style>
