<template>
  <div class="content">
    <div class="info-wrap">
      <div class="avator-box" v-if="!isRegister">
        <img src="../../../static/images/my-avator.png" alt="">
      </div>
      <div class="avator-box logined-avator" v-else>
        <img src="../../../static/images/logined-avator.jpg" alt="">
      </div>
      <div class="btn login-btn" @click="showLoginForm" v-if="!isRegister">登录</div>
      <div class="user-info" v-if="isRegister">
        <div class="phone-num">{{cutPhone}}</div>
        <div class="under-text">机票省钱小能手</div>
      </div>
    </div>
    <div class="opt-list-wrap">
      <van-cell title="通知" is-link arrow-direction="right" url="/pages/notifaction/main" link-type="navigateTo" @click="visitedNotify">
        <template slot v-if="hasNotify">
          <div class="dot"></div>
        </template>
      </van-cell>
      <van-cell title="关于我们" is-link arrow-direction="right" url="/pages/aboutus/main" link-type="navigateTo" />
      <van-cell title="意见反馈" is-link arrow-direction="right" url="/pages/recommend/main" link-type="navigateTo" />
    </div>
    <div class="dialog-wrap" v-if="showLogion" @click="showLogion = false">
      <div class="login-form-wrap" @click.stop="stopPopup">
        <div class="phone-input">
          <input type="number" placeholder="输入手机号" maxlength="11" v-model="phoneNum" @click.stop="stopPopup" placeholder-class="input-placeholder">
        </div>
        <div class="code-input">
          <input type="text" placeholder="输入验证码" maxlength="6" v-model="codeNum" @click.stop="stopPopup" placeholder-class="input-placeholder">
          <span @click.stop="getCode" v-if="resent">获取验证码</span>
          <span v-if="!resent" class="sending">{{getCodeDue}}重新发送</span>
        </div>
        <div class="btn submit-btn" @click.stop="getLogin">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  data () {
    return {
      phoneNum: '',
      codeNum: '',
      isRegister: 0,
      showLogion: false,
      getCodeTimer: null,
      getCodeDue: 0,
      resent: true,
      hasNotify: false
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    cutPhone () {
      return this.phoneNum.substr(0, 3) + '****' + this.phoneNum.substr(7, 11)
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USERINFO'
    }),
    showLoginForm () {
      this.showLogion = true
    },
    getCode () {
      let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!reg.test(this.phoneNum)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return false
      } else {
        this.getCodeDue = 59
        this.resent = false
        this.getCodeTimeout()
        this.$fly.post('/login/getConfirmCode', {phone: this.phoneNum}).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '获取验证码失败',
            icon: 'none'
          })
        })
      }
    },
    getCodeTimeout () {
      this.getCodeTimer = setTimeout(() => {
        this.getCodeDue -= 1
        if (this.getCodeDue > 0) {
          this.getCodeTimeout()
        } else {
          clearTimeout(this.getCodeTimer)
          this.resent = true
        }
      }, 1000)
    },
    getLogin () {
      let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!reg.test(this.phoneNum)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return false
      } else if (this.codeNum.length < 6) {
        wx.showToast({
          title: '验证码错误',
          icon: 'none'
        })
        return false
      } else {
        let _obj = {
          openid: this.userInfo.openid,
          phone: this.phoneNum,
          code: this.codeNum
        }
        this.$fly.post('/login/userLogin', _obj).then(res => {
          if (res.code === '0') {
            this.setUserInfo({
              phone: this.phoneNum,
              isRegister: true
            })
            this.checkNotifaction()
            this.isRegister = true
            this.showLogion = false
          } else {
            this.isRegister = false
            this.showLogion = false
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }).catch(err => {
          console.log(err)
          this.isRegister = false
          this.showLogion = false
          wx.showToast({
            title: err.msg,
            icon: 'none'
          })
        })
      }
    },
    checkLogined () {
      this.isRegister = this.userInfo.isRegister
      if (this.isRegister) {
        this.phoneNum = this.userInfo.phone
        this.checkNotifaction()
      }
    },
    checkNotifaction () {
      this.$fly.post('/attention/getNotesCount', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.code === '0' && res.data && (res.data * 1) > 0) {
          this.hasNotify = true
        } else {
          this.hasNotify = false
        }
      }).catch(err => {
        console.log(err)
        this.hasNotify = false
      })
    },
    visitedNotify () {
      this.hasNotify = false
    },
    stopPopup () {
      return false
    }
  },
  mounted () {
  },
  created () {
  // let app = getApp()
  },
  onShow () {
    this.checkLogined()
  }
}
</script>
<style scoped>
  .content{
    height: 100%;
    overflow: hidden;
    background: rgb(245, 245, 245);
  }
  .info-wrap{
    width: 100%;
    height: 45%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    background: #fff;
  }
  .avator-box{
    width: 182rpx;
    height: 182rpx;
  }
  .logined-avator{
    border-radius: 50%;
    overflow: hidden;
  }
  .avator-box img{
    width: 100%;
    height: 100%;
  }
  .login-btn{
    width: 310rpx;
    height: 70rpx;
    line-height: 70rpx;
    font-size: 30rpx;
    color: #fff;
    background: #4A9FEF;
    border: 0 none;
    border-radius: 35rpx;
  }
  .user-info{
    margin-top: 20rpx;
    text-align: center;
    font-size: 36rpx;
    color: #33333e;
  }
  .under-text{
    margin-top: 10rpx;
    font-size: 28rpx;
    color: #88888e;
  }
  .opt-list-wrap{
    margin-top: 30rpx;
  }
  .dialog-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.4);
    z-index: 500;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .login-form-wrap{
    width: 85%;
    background: #fff;
    border-radius: 15rpx;
    padding-top: 40rpx;
  }
  .submit-btn{
    width: 80%;
    height: 70rpx;
    line-height: 70rpx;
    border-radius: 35rpx;
    color: #fff;
    font-size: 30rpx;
    background: #4A9FEF;
    border: 0 none;
    margin-top: 60rpx;
  }
  .phone-input,
  .code-input{
    width: 80%;
    font-size: 30rpx;
    color: #99999e;
    margin: 30rpx auto 0 auto;
    border-bottom: 2rpx solid #ccc;
  }
  .input-placeholder{
    color: #99999e;
  }
  .phone-input input{
    height: 70rpx;
    line-height: 70rpx;
  }
  .code-input input{
    width: 60%;
    display: inline-block;
    vertical-align: middle;
    height: 70rpx;
    line-height: 70rpx;
  }
  .code-input span{
    width: 39%;
    display: inline-block;
    vertical-align: middle;
    text-align: right;
    color: #4680f6;
    height: 70rpx;
    line-height: 70rpx;
  }
  .code-input span.sending{
    color: #ccc;
  }
  .dot{
    position: absolute;
    width: 10rpx;
    height: 10rpx;
    left: 80rpx;
    top: -25rpx;
  }
  .dot:after{
    content: '.';
    color: red;
    font-size: 100rpx;
  }
</style>
