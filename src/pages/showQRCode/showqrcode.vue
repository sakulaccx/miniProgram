<template>
  <div class="content">
    <div class="img-wrap">
      <img src="/static/images/WechatIMG592.jpg" data-src="/static/images/WechatIMG592.jpg" alt="" mode="widthFix" show-menu-by-longpress="true">
      <!-- <official-account style="position: absolute; bottom: 20rpx; width: 96%; left: 2%;"></official-account> -->
      <div class="bottom-wrap">
        <button class="gotoService" open-type="contact">获取二维码，完成关注</button>
        <div class="bottom-text">关注后获得提醒，将不会错过低价</div>
      </div>
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
  },
  onShow () {
    this.getUserInfo()
  }
}
</script>
<style scoped>
.img-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
}
.img-wrap img{
  width: 90%;
}
.bottom-wrap{
  position: absolute;
  width: 100%;
  bottom: 100rpx;
  display: flex-start;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
}
.gotoService{
  width: 80%;
  background: #4a9fef;
  color: #fff;
  font-size: 16px;
  border-radius: 50px;
  height: 72rpx;
  line-height: 72rpx;
  letter-spacing: 10rpx;
}
.bottom-text{
  margin-top: 30rpx;
  font-size: 12px;
  color: #bbb9ba;
  text-align: center;
}
</style>
