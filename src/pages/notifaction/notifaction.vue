<template>
  <div class="content">
    <div class="swiper-wrap">
      <div class="swiper-item" v-for="(item, index) in interestList" :key="index">
        <div class="item-box" @touchstart="touchStart($event)" @touchend="touchEnd($event,index)" :data-type="item.type" @click="recover(index)">
          <div class="item-box-left">
            <div class="item-box-top">
              <div class="item-info info-city">
                <span>{{item.departureCity}}</span> ― <span>{{item.arrivalCity}}</span>
                <div class="under-text">
                  {{item.company}}
                </div>
              </div>
              <div class="item-info info-date">
                <span>{{item.departureMonth}}月</span> - <span>{{item.departureDay}}日</span>
                <!-- <div class="under-text">
                  {{item.departureTime}} ― {{item.arrivalTime}}
                </div> -->
              </div>
              <div class="item-info info-price">
                ￥{{item.lowestPrice}}
              </div>
            </div>
            <div class="mark-line"></div>
            <div class="under-desc">
              <span>可以立即购票，当前已是最低价格</span>
              <span>2分钟前已更新</span>
            </div>
          </div>
          <div class="item-box-right" @click="deleteItem(index, item.id)">取消关注</div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      interestList: [
        {
          id: '123456',
          flightNumber: '2342342',
          company: '东方航空',
          departureCity: '上海',
          departureCityCode: 'sss',
          arrivalCity: '深圳',
          arrivalCityCode: 'sz',
          departureMonth: '6',
          departureDay: '5',
          departureTime: '14:00',
          arrivalTime: '17:00',
          lowestPrice: '700',
          historyPrice: '333',
          actionFlag: 1,
          isEffective: 1,
          type: 0
        }
      ],
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
    showClick (l) {
      console.log(l)
    },
    touchStart (e) {
      this.startX = e.mp.changedTouches[0].clientX
    },
    touchEnd (e, index) {
      this.endX = e.mp.changedTouches[0].clientX
      if (this.startX - this.endX > 10) {
        for (let i = 0; i < this.interestList.length; i++) {
          this.interestList[i].type = 0
        }
        this.interestList[index].type = 1
      } else if (this.startX - this.endX < -10) {
        for (let i = 0; i < this.interestList.length; i++) {
          this.interestList[i].type = 0
        }
      }
    },
    recover (index) {
      this.interestList[index].type = 0
    },
    deleteItem (index, id) {
      this.interestList.splice(index, 1)
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
  .swiper-wrap{
    display: block;
    position: relative;
    width: 90%;
    height: auto;
    margin: 0 auto;
    overflow: hidden;
    overflow-y: auto;
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
  .info-price{
    font-size: 46rpx;
    color: #ED6F2E;
  }
  .under-text{
    font-size: 24rpx;
    color: #66666e;
    text-align: center;
  }
  .mark-line{
    width: 95%;
    margin: 18rpx 0 0 40rpx;
    border-bottom: 1rpx solid #EAEAEA;
  }
  .under-desc{
    font-size: 26rpx;
    color: #63646C;
    padding: 0 30rpx;
  }
  .under-desc span{
    display: inline-block;
    vertical-align: middle;
    height: 60rpx;
    line-height: 60rpx;
  }
  .under-desc span:first-child{
    width: 60%;
  }
  .under-desc span:last-child{
    width: 39%;
    text-align: right;
  }
</style>
