<template style="height: 100%">
  <div class="content">
    <div class="top-search-wrap">
      <div class="top-search-l1">
        <i class="iconfont icon-feiji800 icon-select"></i>
        <!-- <span class="choose-city left-city" :class="searchForm.from.length > 0 ? 'selected' : ''" @click="showCity(1)" v-if="!showFromInput">{{from}}</span> -->
        <span class="choose-city left-city">
          <van-field
           :disabled="fromDisabled"
           :value="searchForm.departure_str"
           placeholder="出发地"
           placeholder-style="color:rgb(153, 153, 157)"
           :border="false"
           @click="showCity(1)"
           @input="searchCity"
          />
        </span>
        <i class="iconfont icon-baohudi_zuoyouduitiao- icon-select" @click="exchangeCity"></i>
        <!-- <span class="choose-city right-city target" :class="searchForm.target.length > 0 ? 'selected' : ''" @click="showCity(2)" v-if="!showTargetInput">{{target}}</span> -->
        <span class="choose-city right-city target">
          <van-field
           :disabled="targetDisabled"
           :value="searchForm.arrival_str"
           placeholder="目的地"
           placeholder-style="color:rgb(153, 153, 157)"
           :border="false"
           input-align="right"
           @click="showCity(2)"
           @input="searchCity"
          />
        </span>
      </div>
      <div class="divider-line"></div>
      <div class="top-search-l2" @click="showCalendar">
        <i class="iconfont icon-shizhong-fill date-select"></i>
        <div class="search-l2-box">
          <span class="choose-date selected" v-if="searchForm.departureDate.length > 0">{{search_data.date_display}}</span>
          <span class="choose-date" v-else>请选择日期</span>
          <span class="weekday">{{showWeek}}</span>
        </div>
        <i class="iconfont icon-rightarrow"></i>
      </div>
    </div>
    <div class="btn search-btn" @click="searchFly">搜索</div>
    <div class="city-box-wrap">
      <div class="search-city-wrap" :class="showCityBox ? 'search-city-active' : ''">
        <div class="city-group-wrap">
          <div class="city-group" v-for="(group, index) in cityGroup" :key="index">
            <div class="group-title" v-if="group.list.length > 0">{{group.title}}</div>
            <div class="city-wrap">
              <div class="citylist" v-for="(item, index2) in group.list" :key="index2" v-if="group.list.length > 0" @click="saveCity(item)">
                {{item.label}}
              </div>
              <div class="filllist" v-for="(item, index3) in (cityRow - group.list.length % cityRow)" v-if="group.list.length % cityRow > 0" :key="index3"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="search-city-wrap" :class="showSearchBox ? 'search-city-active' : ''">
        <div class="city-group-wrap">
          <div class="city-group">
            <div class="group-title" v-if="searchCityResult.length > 0">请选择城市</div>
            <div class="group-title" v-else>未找到匹配城市</div>
            <div class="search-list" v-for="(item, index) in searchCityResult" :key="index" v-if="searchCityResult.length > 0" @click="saveCity(item)">
              <div class='city-name'>{{item.label}}</div>
              <div class="iconfont icon-zuoshangjiao select-icon"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-close-wrap" v-if="showBottomClose">
      <div class="search-close-btn" @click="closeSearchBox">
        <span class="iconfont icon-guanbi"></span>
      </div>
    </div>
  </div>
</template>

<script>
import cityList from './cityData.json'
import hotCity from './hotCity.json'
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      selectFrom: 1,
      showCityBox: false,
      fromDisabled: true,
      targetDisabled: true,
      showSearchBox: false,
      searchTimer: null,
      searchCityResult: [],
      searchForm: {
        departureCityCode: '',
        arrivalCityCode: '',
        departure_str: '',
        arrival_str: '',
        departureDate: ''
      },
      weekarr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      cityGroup: [
        {
          title: '历史搜索',
          list: []
        },
        {
          title: '国内热门城市',
          list: hotCity
        },
        {
          title: '出发城市列表',
          list: cityList
        }
      ],
      cityRow: 3,
      searchCityArr: cityList
    }
  },
  computed: {
    ...mapState([
      'depart_date',
      'search_data',
      'userInfo'
    ]),
    newDepartureDate () {
      return this.depart_date.departureDate
    },
    showBottomClose () {
      return this.showCityBox || this.showSearchBox
    },
    showWeek () {
      if (this.searchForm.departureDate) {
        return this.weekarr[new Date(this.searchForm.departureDate).getDay()]
      }
      return ''
    }
  },
  watch: {
    newDepartureDate () {
      this.searchForm.departureDate = this.depart_date.departureDate
    }
  },
  methods: {
    ...mapMutations({
      setDepart: 'SET_DEPART_DATE',
      setSearchStr: 'SET_SEARCH_STR'
    }),
    showCity (val) {
      wx.hideTabBar({
        animation: false
      })

      this.selectFrom = val
      this.showCityBox = true
      this.showSearchBox = false

      if (val === 1) {
        this.fromDisabled = false
      } else {
        this.targetDisabled = false
      }
    },
    exchangeCity () {
      let _tpl = this.searchForm.departure_str
      this.searchForm.departure_str = this.searchForm.arrival_str
      this.searchForm.arrival_str = _tpl

      let _code = this.searchForm.departureCityCode
      this.searchForm.departureCityCode = this.searchForm.arrivalCityCode
      this.searchForm.arrivalCityCode = _code

      this.setStore()
    },
    searchCity (val) {
      let searchStr = val.mp.detail
      this.showCityBox = false
      this.showSearchBox = true
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.getSearchCity(searchStr)
      }, 100)
    },
    getSearchCity (_str) {
      let _tplArr = []
      this.searchCityArr.forEach((v) => {
        if (v.label.indexOf(_str) >= 0) {
          _tplArr.push(v)
        }
      })
      this.searchCityResult = _tplArr
    },
    showCalendar () {
      wx.navigateTo({url: '../calendar/main'})
    },
    saveCity (obj) {
      if (this.selectFrom === 1) {
        this.searchForm.departure_str = obj.label
        this.searchForm.departureCityCode = obj.value
      } else {
        this.searchForm.arrival_str = obj.label
        this.searchForm.arrivalCityCode = obj.value
      }

      this.setStore()
    },
    setStore () {
      let _dept = {
        departureDate: this.searchForm.departureDate,
        departureCityCode: this.searchForm.departureCityCode,
        arrivalCityCode: this.searchForm.arrivalCityCode
      }
      this.setDepart(_dept)

      let _search = {
        departure_str: this.searchForm.departure_str,
        arrival_str: this.searchForm.arrival_str
      }
      this.setSearchStr(_search)
    },
    searchFly () {
      if (this.searchForm.departureDate.length > 0 && this.searchForm.departureCityCode.length > 0 && this.searchForm.arrivalCityCode.length > 0) {
        this.setStore()
        this.$fly.post('/record/add', {
          openid: this.userInfo.openid,
          cities: [
            {
              cityName: this.searchForm.departure_str,
              cityCode: this.searchForm.departureCityCode
            },
            {
              cityName: this.searchForm.arrival_str,
              cityCode: this.searchForm.arrivalCityCode
            }
          ]
        }).then(res => {
          if (res.code === '0') {
            // 获取历史搜索城市
            // this.$fly.all([this.getHistoryCity()]).then(this.$fly.spread((records, project) => {
            //   wx.navigateTo({url: '../destination/main'})
            // }))
            this.resetForm()
            wx.navigateTo({url: '/pages/destination/main'})
          } else {
            wx.showToast({
              title: '网络开小差了',
              icon: 'none'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      } else if (this.searchForm.departureDate.length === 0) {
        wx.showToast({
          title: '请选择出发日期',
          icon: 'none'
        })
      } else if (this.searchForm.departureCityCode.length === 0) {
        wx.showToast({
          title: '请选择出发地',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '请选择目的地',
          icon: 'none'
        })
      }
    },
    resetForm () {
      this.targetDisabled = true
      this.closeSearchBox()
    },
    closeSearchBox () {
      wx.showTabBar({
        animation: false
      })
      this.showCityBox = false
      this.showSearchBox = false
    },
    getHistoryCity () {
      return this.$fly.get('/record/getList', {
        openid: this.userInfo.openid
      }).then(res => {
        if (res.data && res.data.length > 0) {
          let _tpl = []
          res.data.forEach((v, i) => {
            _tpl.push(
              {
                label: v.cityName,
                value: v.cityCode
              }
            )
          })

          this.cityGroup[0].list = _tpl
        }
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: '历史搜索加载失败',
          icon: 'none'
        })
      })
    }
  },
  mounted () {
    // 获取历史搜索
    this.getHistoryCity()

    // 获取选择的日期
    // if (this.depart_date.departureDate.length > 0) {
    //   this.searchForm.departureDate = this.depart_date.departureDate
    // }
  },
  created () {
    // let app = getApp()
  }
}
</script>
<style>
  .choose-city .field-index--van-field{
    padding: 0;
    font-size: 32rpx;
  }
</style>
<style scoped>
  .content{
    height: 100%;
    overflow: hidden;
    background: rgb(245, 245, 245);
  }
  .top-search-wrap{
    margin: 30rpx auto;
    width: 90%;
    background: #fff;
    border-radius: 20rpx;
    height: 210rpx;
  }
  .top-search-l1,
  .top-search-l2{
    height: 50%;
    line-height: 100rpx;
    font-size: 32rpx;
    vertical-align: middle;
  }
  .divider-line{
    margin: 0 auto;
    width: 95%;
    height: 1px;
    border-bottom: 1px solid rgb(243, 243, 243);
  }
  .icon-select{
    font-size: 28px;
    margin: 0 40rpx;
  }
  .date-select{
    margin: 0 40rpx;
    font-size: 20px;
  }
  .choose-city{
    width: 150rpx;
    text-align: center;
    display: inline-block;
    color: rgb(153, 153, 157);
    vertical-align: middle;
  }
  .choose-city.selected{
    color: rgb(49, 49, 49);
  }
  .left-city{
    text-align: left;
  }
  .right-city{
    text-align: right;
  }
  .search-l2-box{
    display: inline-block;
    min-width: 70%;
  }
  .choose-date{
    color: rgb(153, 153, 157);
  }
  .choose-date.selected{
    color: rgb(49, 49, 49);
  }
  .weekday{
    margin-left: 10rpx;
    font-size: 14px;
    color: rgb(141, 141, 146);
  }
  .icon-rightarrow{
    font-size: 30px;
  }
  .search-btn{
    font-size: 16px;
    color: #fff;
    border-radius: 40rpx;
    background: rgb(48, 104, 246);
  }
  .city-box-wrap{
    position: relative;
    top: 0;
    left: 0;
  }
  .search-city-wrap{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 700rpx;
    overflow-x: hidden;
    overflow-y: auto;
    transform: translate(0, 200%);
    opacity: 0;
    transition: all .3s ease-in .1s;
  }
  .city-group-wrap{
    padding: 0 40rpx 40rpx 40rpx;
  }
  .search-close-wrap{
    position: absolute;
    bottom: 0;
    left: 0;
    height: 116rpx;
    width: 100%;
    line-height: 58rpx;
    text-align: center;
    font-size: 50rpx;
    background: rgb(255, 255, 255);
  }
  .search-close-btn{
    width: 50rpx;
    height: 50rpx;
    margin: 25rpx auto;
  }
  .search-city-active{
    opacity: 1;
    transform: translate(0, 0);
  }
  .city-group{
    margin-top: 30rpx;
  }
  .group-title{
    font-size: 14px;
    color: rgb(181, 181, 185);
    margin-bottom: 10rpx;
    font-weight: lighter;
  }
  .city-wrap{
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
  }
  .citylist{
    width: 30%;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 14px;
    background: #fff;
    color: rgb(115, 115, 122);
    margin-top: 20rpx;
  }
  .filllist{
    content: '';
    width: 30%;
    border:1px solid transparent;
    overflow: hidden;

  }
  .search-list{
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    border-bottom: 1px solid #ccc;
  }
  .search-list div{
    display: inline-block;
    vertical-align: middle;
    height: 100%;
  }
  .search-list .city-name{
    width: 90%;
  }
  .search-list .select-icon{
    width: 8%;
    text-align: right;
  }
  .closebtn{
    width: 80rpx;
    height: 80rpx;
    content: "关闭";
    line-height: 80rpx;
    text-align: center;
  }
  .icon-guanbi{
    font-size: 56rpx;
  }
</style>
