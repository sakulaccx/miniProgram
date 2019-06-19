<template style="height: 100%">
  <div class="index-wrap">
    <img src="/static/images/launch.jpg" alt="">
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      aaa: ''
    }
  },
  computed: {
    ...mapState([
      'search_history',
      'depart_date'
    ])
  },
  methods: {
    ...mapMutations({
      setHistory: 'SET_HISTORY_SEARCH',
      setDepart: 'SET_DEPART_DATE',
      setUserInfo: 'SET_USERINFO'
    })
  },
  onLoad () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.$fly.post('/xiaoJingAdmin/wxApp/login/getOpenid', {
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
    this.$fly.get({
      url: '/uploaded/i4/O1CN01mFJukB1w4pvUknib0_!!0-rate.jpg_40x40.jpg'
    }).then(res => {
      console.log(res)
    })
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
