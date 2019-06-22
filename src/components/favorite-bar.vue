<template>
  <div>
    <div class="favorite-bar" v-if="!favoriteStatus">
      <div class="iconfont icon-jinggao inner-text">当前价格较高，建议您持续关注</div>
      <div class="iconfont icon-buoumaotubiao44 favorite-btn" @click="saveFavorite">添加关注</div>
      <div class="clearfix"></div>
    </div>
    <div class="favorite-list" v-else>
      <div class="iconfont icon-jinggao inner-text">已关注，进入关注列表查看更多</div>
      <div class="favorite-btn" @click="gotoFavoriteList">关注列表</div>
      <div class="clearfix"></div>
    </div>
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
import Dialog from '@/../static/vant/dialog/dialog'
import { mapState } from 'vuex'
export default {
  props: ['favoriteStatus'],
  data () {
    return {
      departureTime: '',
      flightNumber: '',
      lowestPrice: 0
    }
  },
  components: {},
  computed: {
    ...mapState([
      'userInfo',
      'depart_date'
    ])
  },
  methods: {
    saveFavorite () {
      if (this.userInfo.unionid.length === 0) {
        Dialog.alert({
          title: '',
          message: '检测到您尚未关注公众号，如需要查看关注列表，请先关注公众号'
        }).then(() => {
          console.log('需要跳转到公众号')
        })
      } else if (!this.userInfo.isRegister) {
        Dialog.alert({
          title: '',
          message: '检测到您尚未登录，如需要查看关注列表，请先登录'
        }).then(() => {
          wx.navigateTo('../../pages/user/main')
        })
      } else {
        this.addFavorite()
      }
    },
    gotoFavoriteList () {
      if (this.userInfo.isRegister) {
        wx.navigateTo({url: '../../pages/interest/main'})
      } else {
        Dialog.alert({
          title: '',
          message: '检测到您尚未登录，如需要查看关注列表，请先登录'
        }).then(() => {
          wx.navigateTo('../../pages/user/main')
        })
      }
    },
    addFavorite () {
      this.$fly.post('/attention/add', {
        openid: this.userInfo.openid,
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode,
        departureTime: this.departureTime,
        flightNumber: this.flightNumber,
        lowestPrice: this.lowestPrice
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = 1
          this.runNotifactionTrack()
        } else {
          console.log(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getFavorite (depTime, flyNum, lowPrice) {
      // 赋值请求参数
      this.departureTime = depTime
      this.flightNumber = flyNum
      this.lowestPrice = lowPrice

      // 查询是否已关注
      this.$fly.post('/attention/isAttention', {
        openid: this.userInfo.openid,
        departureCityCode: this.depart_date.departureCityCode,
        arrivalCityCode: this.depart_date.arrivalCityCode,
        departureTime: depTime,
        flightNumber: flyNum
      }).then(res => {
        if (res.code === '0') {
          this.favoriteStatus = res.data * 1
          this.lowestPrice = lowPrice
        }
      }).catch(err => {
        console.log(err)
      })
    },
    runNotifactionTrack () {
      this.$fly.get('/attention/updateNotes')
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
.favorite-list,
.favorite-bar{
  width: 100%;
  height: 60rpx;
  background: #fee1cf;
}
.favorite-bar .inner-text{
  float: left;
  height: 100%;
  line-height: 50rpx;
  padding-left: 30rpx;
  color: #ff7216;
  font-size: 28rpx;
}
.favorite-bar .icon-jinggao:before{
  font-size: 38rpx;
  margin-right: 10rpx;
}
.favorite-bar .favorite-btn{
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
.favorite-bar .icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
.favorite-list{
  background: #9af3ad;
}
.favorite-list .inner-text{
  float: left;
  height: 100%;
  line-height: 50rpx;
  padding-left: 30rpx;
  color: #1cb152;
  font-size: 28rpx;
}
.favorite-list .icon-jinggao:before{
  font-size: 38rpx;
  margin-right: 10rpx;
}
.favorite-list .favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #fff;
  background: #1cb152;
  font-size: 26rpx;
}
.favorite-list .icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
</style>
