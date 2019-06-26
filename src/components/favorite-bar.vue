<template>
  <div>
    <div class="favorite-bar" v-if="!favoriteStatus">
      <div class="iconfont icon-jinggao inner-text">当前价格较高，建议您持续关注</div>
      <div class="iconfont icon-buoumaotubiao44 favorite-btn" @click="saveFavorite">添加关注</div>
      <div class="clearfix"></div>
    </div>
    <div class="favorite-list" v-if="favoriteStatus">
      <div class="iconfont icon-jinggao inner-text">已关注，进入关注列表查看更多</div>
      <div class="favorite-btn" @click="gotoFavoriteListOnTop">关注列表</div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>

<script>
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
      'depart_date',
      'detail_date'
    ])
  },
  methods: {
    saveFavorite () {
      // 正式代码
      // if (!this.userInfo.unionid) {
      //   this.showAuthorityDialog(0)
      // } else if (!this.userInfo.isRegister) {
      //   this.showAuthorityDialog(1)
      // } else {
      //   this.addFavorite()
      // }

      // 测试代码
      if (this.userInfo.unionid.length === 0) {
        this.showAuthorityDialog(0)
      } else if (!this.userInfo.isRegister) {
        this.showAuthorityDialog(1)
      } else {
        this.addFavorite()
      }
    },
    showAuthorityDialog (level) {
      this.$emit('parentShowAuthority', level)
    },
    gotoFavoriteListOnTop () {
      if (this.userInfo.isRegister) {
        wx.navigateTo({url: '../../pages/interest/main'})
      } else {
        this.showAuthorityDialog(1)
      }
    },
    addFavorite () {
      this.$fly.post('/attention/add', {
        openid: this.userInfo.openid,
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        actionFlag: this.detail_date.actionFlag,
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
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
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
  height: 54rpx;
  line-height: 54rpx;
  background: #fee1cf;
}
.favorite-bar .inner-text{
  float: left;
  height: 100%;
  padding-left: 30rpx;
  color: #ff6500;
  font-size: 28rpx;
}
.favorite-bar .icon-jinggao:before{
  font-size: 28rpx;
  margin-right: 10rpx;
}
.favorite-bar .favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 42rpx;
  height: 42rpx;
  line-height: 42rpx;
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
  padding-left: 30rpx;
  color: #1cb152;
  font-size: 28rpx;
}
.favorite-list .icon-jinggao:before{
  font-size: 28rpx;
  margin-right: 10rpx;
}
.favorite-list .favorite-btn{
  float: right;
  margin-right: 30rpx;
  margin-top: 7rpx;
  width: 180rpx;
  border-radius: 42rpx;
  height: 42rpx;
  line-height: 42rpx;
  text-align: center;
  color: #fff;
  background: #1cb152;
  font-size: 26rpx;
}
.favorite-list .icon-buoumaotubiao44:before{
  margin-right: 10rpx;
}
</style>
