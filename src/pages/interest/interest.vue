<template>
  <div class="content">
    <div class="swiper-wrap" v-if="interestList.length > 0">
      <div :class="['swiper-item', {'un-effective': item.isEffective === '0'}]" v-for="(item, index) in interestList" :key="index">
        <div class="item-box" @touchstart="touchStart($event)" @touchend="touchEnd($event,index)" :data-type="item.type" @click="gotToDetail(index, item)">
          <div class="item-box-left">
            <div class="item-box-top">
              <div class="item-info info-city">
                <span>{{item.departureCity}} ― {{item.arrivalCity}}</span>
                <div class="under-text">
                  {{item.company}}
                </div>
              </div>
              <div class="item-info info-date">
                <span>{{item.departureMonth}}月 - {{item.departureDay}}日</span>
                <div class="under-text">
                  {{item.departureTime}} ― {{item.arrivalTime}}
                </div>
              </div>
              <div class="item-info info-price" v-if="item.isEffective === '0'">
                已失效
              </div>
              <div class="item-info info-price" v-else>
                ￥{{item.lowestPrice}}
              </div>
            </div>
            <template v-if="item.isEffective === '1'">
              <div :class="['item-box-bottom', {'red-text': item.actionFlag === 0, 'green-text': item.actionFlag === 1}]">{{buyOpt[item.actionFlag]}}</div>
            </template>
            <!-- <template v-else>
              <div class="item-box-bottom">已失效</div>
            </template> -->
          </div>
          <div class="item-box-right" @click="deleteItem(index, item.id)">取消关注</div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      您还没有关注我们的航班<br />
      赶紧去关注吧
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      interestList: [],
      buyOpt: ['建议购买 >', '建议观望'],
      startX: 0,
      endX: 0
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'depart_date'
    ])
  },
  methods: {
    ...mapMutations({
      setDetailSearch: 'SET_DETAIL_DATE'
    }),
    showClick (l) {
      console.log(l)
    },
    touchStart (e) {
      this.startX = e.mp.changedTouches[0].clientX
    },
    touchEnd (e, index) {
      this.endX = e.mp.changedTouches[0].clientX
      if (this.startX - this.endX > 10) {
        this.interestList.forEach((v, i) => {
          this.interestList[i].type = 0
        })
        this.interestList[index].type = 1
      } else if (this.startX - this.endX < -10) {
        for (let i = 0; i < this.interestList.length; i++) {
          this.interestList[i].type = 0
        }
      }
    },
    gotToDetail (index, _obj) {
      if (this.interestList[index].type === 1) {
        this.interestList[index].type = 0
      } else {
        if (_obj.isEffective === '1') {
          this.setDetailSearch({
            departureCityCode: _obj.departureCityCode,
            arrivalCityCode: _obj.arrivalCityCode,
            departureDate: _obj.departureDate,
            timeSlotList: [],
            companyList: []
          })
          wx.navigateTo({url: '/pages/detail/main'})
        } else {
          wx.showToast({
            title: '当前航班已失效',
            icon: 'none'
          })
        }
      }
    },
    deleteItem (index, fid) {
      this.$fly.post('/attention/del', {
        id: fid
      }).then(res => {
        if (res.code === '0') {
          this.interestList.splice(index, 1)
        } else {
          wx.showToast({
            title: '网络不给力，请稍后再试',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '网络不给力，请稍后再试',
          icon: 'none'
        })
      })
    },
    checkUserStatus () {
      // if (!this.userInfo.unionid.length) {
      //   wx.showModal({
      //     title: '提示',
      //     content: '检测到您尚未关注公众号，如需要查看关注列表，请先关注公众号',
      //     showCancel: false,
      //     confirmText: '确定',
      //     success: function (res) {
      //       wx.navigateTo({url: '/pages/showQRCode/main'})
      //     }
      //   })
      // } else if (!this.userInfo.isRegister) {
      if (!this.userInfo.isRegister) {
        wx.showModal({
          title: '提示',
          content: '检测到您尚未登录，如需要查看关注列表，请先登录',
          showCancel: false,
          confirmText: '确定',
          success: function (res) {
            wx.switchTab({url: '/pages/user/main'})
          }
        })
      } else {
        this.getFavoriteData()
      }
    },
    getFavoriteData () {
      this.$fly.post('/attention/getList', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.interestList = []
          res.data.forEach((v, i) => {
            this.interestList.push({...v, ...{type: 0}})
          })
        } else {
          wx.showToast({
            title: '暂无关注',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    wx.showTabBar({
      animation: false
    })
  },
  created () {
  // let app = getApp()
  },
  onShow () {
    this.checkUserStatus()
  }
}
</script>
<style scoped>
  .content{
    overflow-y: auto;
  }
  .swiper-wrap{
    display: block;
    position: relative;
    width: 90%;
    height: auto;
    margin: 0 auto;
    padding-bottom: 30rpx;
  }
  .swiper-item{
    width: 100%;
    height: 210rpx;
    background: #fff;
    border-radius: 10rpx;
    margin-top: 30rpx;
    overflow: hidden;
  }
  .item-box{
    width: 120%;
    height: 100%;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
  }
  .item-box-left,
  .item-box-right{
    float: left;
  }
  .item-box-left{
    width: 83.3%;
    height: 100%;
  }
  .item-box-right{
    margin-left: 1px;
    width: 16.4%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    font-size: 30rpx;
    justify-content: center;
    background: red;
    color: #fff;
  }
  .item-box-top{
    padding-top: 40rpx;
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
  }
  .item-info span{
    font-size: 34rpx;
    color: #434031;
  }
  .info-date{
    color: #33333e;
  }
  .info-price{
    font-size: 45rpx;
    color: #333333;
  }
  .un-effective .item-info span{
    color: #a9a9a9;
  }
  .un-effective .info-price{
    color: #a9a9a9;
  }
  .under-text{
    font-size: 20rpx;
    color: #66666e;
    text-align: center;
  }
  .un-effective .under-text{
    color: #a9a9a9;
  }
  .item-box-bottom{
    height: 50rpx;
    line-height: 50rpx;
    font-size: 30rpx;
    text-align: right;
    padding-right: 30rpx;
    margin-top: 10rpx;
    color: #a9a9a9;
  }
  .red-text{
    color: #ff6600;
  }
  .green-text{
    color: #38ca50;
  }
  .item-box[data-type="0"]{
    transform: translate3d(0,0,0);
  }
  .item-box[data-type="1"]{
    transform: translate3d(-135rpx,0,0);
  }
  .no-data{
    margin-top: 30rpx;
    text-align: center;
    font-size: 30rpx;
    color: #ccc;
  }
</style>
