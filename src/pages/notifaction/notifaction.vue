<template>
  <div class='content'>
    <div class='notice-wrap' v-if='notifyList.length > 0'>
      <div class='notice-item' v-for='(item, index) in notifyList' :key='index'>
        <div class='notice-item-top'>
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
        <div class='notice-time-bottom'>
          <div class='recommend'>
            {{item.recommend}}
          </div>
          <div class='update'>
            {{item.updateStr}}
            <!-- {{getUpdateRange(item.updateTime)}} -->
          </div>
        </div>
      </div>
    </div>
    <div class='no-data' v-else>当前没有新通知</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      notifyList: [
        {
          futureLowestPriceDate: 14,
          futureLowestPrice: 550,
          departureCity: '上海',
          actionFlag: 1,
          currentPrice: 600,
          company: '东方航空',
          updateTime: 1561224727,
          departureDate: '2019-04-05',
          arrivalCity: '北京'
        },
        {
          futureLowestPriceDate: 0,
          futureLowestPrice: 610,
          departureCity: '上海',
          actionFlag: 0,
          currentPrice: 610,
          company: '中国国航',
          updateTime: 1561224727,
          departureDate: '2019-04-07',
          arrivalCity: '北京'
        },
        {
          futureLowestPriceDate: 29,
          futureLowestPrice: 500,
          departureCity: '上海',
          actionFlag: 1,
          currentPrice: 690,
          company: '上海航空',
          updateTime: 1561224727,
          departureDate: '2019-04-08',
          arrivalCity: '北京'
        },
        {
          futureLowestPriceDate: 31,
          futureLowestPrice: 467,
          departureCity: '上海',
          actionFlag: 1,
          currentPrice: 678,
          company: '中国联航',
          updateTime: 1561224727,
          departureDate: '2019-04-12',
          arrivalCity: '北京'
        }
      ]
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
    getNotifactionList () {
      this.$fly.post('/attention/getNotes', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.notifyList = res.data
          this.setNoitfactionList()
        } else {
          this.notifyList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    setNoitfactionList () {
      let [..._tplList] = [...this.notifyList]
      _tplList.forEach((v, i) => {
        v['dateStr'] = this.getDateStr(v.departureDate)
        v['updateStr'] = this.getUpdateRange(v.updateTime)
        v['recommend'] = this.getRecommend(v)
      })

      this.notifyList = [...this.notifyList, ..._tplList]
    }
  },
  mounted () {
    // this.setNoitfactionList()
    if (this.userInfo.isRegister) {
      this.getNotifactionList()
    }
  },
  created () {
    // let app = getApp()
  }
}
</script>
<style scoped>
.content{
  overflow-y: auto;
}
.notice-wrap{
  width: 100%;
  height: auto;
  padding: 0 0 30rpx 0;
}
.notice-item{
  width: 90%;
  background: #fff;
  border-radius: 16rpx;
  margin: 30rpx auto;
}
.notice-item-top{
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
.notice-time-bottom{
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
.no-data {
  margin-top: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #ccc;
}

</style>
