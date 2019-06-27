<template>
  <div class="content">
    <div class="swiper-wrap" v-if="notifyList.length > 0">
      <div class="swiper-item" v-for="(item, index) in notifyList" :key="index">
        <!-- <div class="item-box" @touchstart="touchStart($event)" @touchend="touchEnd($event,index)" :data-type="item.type" @click="gotToDetail(index, item)"> -->
        <div class="item-box" @click="gotToDetail(index, item)">
          <div class="item-box-left">
            <div class="item-box-top">
              <div class='dept-info'>
                <div class='dept-arrive'>
                  {{item.departureCity}} ― {{item.arrivalCity}}
                </div>
                <div class='company-info'>
                  {{item.company}}
                </div>
              </div>
              <div class='date-info'>
                 {{item.dateStr}}
              </div>
              <div class='price-info'>
                ￥{{item.currentPrice}}
              </div>
            </div>
            <div class="mark-line"></div>
            <div class="item-box-bottom">
              <div class='recommend'>
              {{item.recommend}}
            </div>
            <div class='update'>
              {{item.updateStr}}
            </div>
            </div>
          </div>
          <div class="item-box-right" @click="deleteItem(index, item.id)">取消关注</div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      没有查询到数据
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      notifyList: [],
      buyOpt: ['建议购买 >', '建议观望'],
      startX: 0,
      endX: 0
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    getDateStr () {
      return function (dateStr) {
        let _date = new Date(dateStr)
        return `${_date.getMonth() + 1}月 - ${_date.getDate()}日`
      }
    },
    getRecommend () {
      return function (_obj) {
        if (_obj.actionFlag) {
          return `该航班将于${_obj.futureLowestPriceDate}天后降至￥${_obj.futureLowestPrice}，建议观望`
        } else {
          return `可以立即购票，当前已是最低价格`
        }
      }
    },
    getUpdateRange () {
      return function (_time) {
        let _curr = new Date()
        let _range = (_curr.getTime() / 1000) - _time
        let day = Math.floor(_range / (24 * 3600))
        let leave1 = _range % (24 * 3600)
        let hours = Math.floor(leave1 / 3600)
        let leave2 = leave1 % 3600
        let minutes = Math.floor(leave2 / 60)
        if (day !== 0) {
          return `${day}天前更新`
        } else if (hours !== 0) {
          return `${hours}小时前更新`
        } else {
          return `${minutes}分钟前更新`
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      setDetailSearch: 'SET_DETAIL_DATE'
    }),
    touchStart (e) {
      this.startX = e.mp.changedTouches[0].clientX
    },
    touchEnd (e, index) {
      this.endX = e.mp.changedTouches[0].clientX
      if (this.startX - this.endX > 10) {
        this.notifyList.forEach((v, i) => {
          this.notifyList[i].type = 0
        })
        this.notifyList[index].type = 1
      } else if (this.startX - this.endX < -10) {
        for (let i = 0; i < this.notifyList.length; i++) {
          this.notifyList[i].type = 0
        }
      }
    },
    gotToDetail (index, _obj) {
      if (this.notifyList[index].type === 1) {
        this.notifyList[index].type = 0
      } else {
        this.setDetailSearch({
          departureCityCode: _obj.departureCityCode,
          arrivalCityCode: _obj.arrivalCityCode,
          departureDate: _obj.departureDate,
          companyList: [_obj.company]
        })
        wx.navigateTo({url: '/pages/detail/main'})
        // if (_obj.isEffective === '1') {
        //   this.setDetailSearch({
        //     departureCityCode: _obj.departureCityCode,
        //     arrivalCityCode: _obj.arrivalCityCode,
        //     departureDate: _obj.departureDate,
        //     companyList: [_obj.company]
        //   })
        //   wx.navigateTo({url: '/pages/detail/main'})
        // } else {
        //   wx.showToast({
        //     title: '当前航班已失效',
        //     icon: 'none'
        //   })
        // }
      }
    },
    deleteItem (index, nid) {
      // this.$fly.post('/attention/del', {
      //   id: fid
      // }).then(res => {
      //   if (res.code === '0') {
      //     this.interestList.splice(index, 1)
      //   } else {
      //     wx.showToast({
      //       title: '网络不给力，请稍后再试',
      //       icon: 'none'
      //     })
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   wx.showToast({
      //     title: '网络不给力，请稍后再试',
      //     icon: 'none'
      //   })
      // })
    },
    checkUserStatus () {
      if (this.userInfo.unionid.length === 0) { // 测试
        wx.showModal({
          title: '提示',
          content: '检测到您尚未关注公众号，如需要查看关注列表，请先关注公众号',
          showCancel: false,
          confirmText: '确定',
          success: function (res) {
            wx.navigateTo({url: '/pages/showQRCode/main'})
          }
        })
      } else if (!this.userInfo.isRegister) {
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
        this.getNotifactionList()
      }
    },
    getNotifactionList () {
      this.$fly.post('/attention/getNotes', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.notifyList = []
          res.data.forEach((v, i) => {
            let _obj = {
              dateStr: this.getDateStr(v.departureDate),
              updateStr: this.getUpdateRange(v.updateTime),
              recommend: this.getRecommend(v),
              type: 0
            }
            this.notifyList.push({...v, ..._obj})
          })
        } else {
          wx.showToast({
            title: '暂无通知',
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
    width: 16.7%;
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
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    color: #434031;
    height: 140rpx;
  }
  .dept-info{
    text-align: center;
  }
  .dept-arrive{
    font-size: 36rpx;
  }
  .company-info{
    margin-top: 8rpx;
    font-size: 22rpx;
    color: #66666e;
  }
  .date-info{
    font-size: 36rpx;
    color: #33333e;
  }
  .price-info{
    font-size: 52rpx;
    color: #ff6600;
  }
  .mark-line{
    width: 95%;
    margin-left: 5%;
    border-bottom: 1px solid #eaeaea;
  }
  .item-box-bottom{
    padding: 0 30rpx 0 36rpx;
  }
  .recommend,
  .update{
    font-size: 24rpx;
    color: #66666e;
    display: inline-block;
    vertical-align: middle;
    height: 70rpx;
    line-height: 70rpx;
  }
  .recommend{
    width: 75%;
  }
  .update{
    width: 24%;
    text-align: right;
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
