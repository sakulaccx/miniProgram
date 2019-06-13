<template style="height: 100%">
  <div class="content">
    <div class="top-search-wrap">
      <div class="top-search-l1">
        <i class="iconfont icon-feiji800 icon-select"></i>
        <!-- <span class="choose-city left-city" :class="searchForm.from.length > 0 ? 'selected' : ''" @click="showCity(1)" v-if="!showFromInput">{{from}}</span> -->
        <span class="choose-city left-city">
          <van-field
           :disabled="fromDisabled"
           :value="from"
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
           :value="target"
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
          <span class="choose-date" :class="searchForm.date.length > 0 ? 'selected' : ''">{{date}}</span>
          <span class="weekday">{{weekday}}</span>
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
            <div class="citylist" v-for="(item, index2) in group.list" :key="index2" v-if="group.list.length > 0" @click="saveCity(item)">
              {{item.label}}
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
import {mapState, mapMutations} from 'vuex'

export default {
  data () {
    return {
      from: '',
      target: '',
      date: '选择出行日期',
      weekday: '',
      selectFrom: 1,
      showCityBox: false,
      fromDisabled: true,
      targetDisabled: true,
      showSearchBox: false,
      searchTimer: null,
      searchCityResult: [],
      searchForm: {
        from: '',
        target: '',
        date: ''
      },
      cityGroup: [
        {
          title: '历史搜索',
          list: []
        },
        {
          title: '国内热门城市',
          list: [
            {
              label: '北京',
              value: 'BJ'
            },
            {
              label: '上海',
              value: 'SH'
            },
            {
              label: '广州',
              value: 'CAN'
            },
            {
              label: '成都',
              value: 'CTU'
            },
            {
              label: '深圳',
              value: 'SZX'
            },
            {
              label: '杭州',
              value: 'HGH'
            },
            {
              label: '重庆',
              value: 'CQ'
            },
            {
              label: '西安',
              value: 'SIA'
            },
            {
              label: '南京',
              value: 'NKG'
            },
            {
              label: '天津',
              value: 'TSN'
            },
            {
              label: '昆明',
              value: 'KMG'
            },
            {
              label: '武汉',
              value: 'WUH'
            },
            {
              label: '郑州',
              value: 'CGO'
            },
            {
              label: '沈阳',
              value: 'SHE'
            },
            {
              label: '青岛',
              value: 'TAO'
            },
            {
              label: '长沙',
              value: 'CSX'
            }
          ]
        },
        {
          title: '出发城市列表',
          list: [
            {
              label: '北京',
              value: 'BJS'
            },
            {
              label: '上海',
              value: 'SHA'
            },
            {
              label: '天津',
              value: 'TSN'
            },
            {
              label: '重庆',
              value: 'CKG'
            }
          ]
        }
      ],
      searchCityArr: [
        {
          label: '上海',
          value: 'SH'
        },
        {
          label: '北京',
          value: 'BJS'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'search_history',
      'depart_date'
    ]),
    showBottomClose () {
      return this.showCityBox || this.showSearchBox
    }
  },
  methods: {
    ...mapMutations({
      setHistory: 'SET_HISTORY_SEARCH'
    }),
    showCity (val) {
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
      let _tpl = this.from
      this.from = this.target
      this.target = _tpl
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
        this.from = obj.label
        this.searchForm.from = obj.value
      } else {
        this.target = obj.label
        this.searchForm.target = obj.value
      }
      let _tplArr = this.search_history
      _tplArr = [..._tplArr, obj]
      this.setHistory(this.mergArr(_tplArr))
      this.cityGroup[0].list = this.search_history
    },
    mergArr (arr) {
      const newArr = arr.reduce((all, next) => all.some((atom) => atom['value'] === next['value']) ? all : [...all, next], [])
      return newArr
    },
    searchFly () {
      if (this.searchForm.date.length > 0 && this.searchForm.from.length > 0 && this.searchForm.target.length > 0) {
        wx.navigateTo({url: '../search/main'})
      } else if (this.searchForm.date.length === 0) {
        console.log('请选择出发日期')
      } else if (this.searchForm.from.length === 0) {
        console.log('请选择出发地')
      } else {
        console.log('请选择目的地')
      }
      console.log(this.searchForm)
    },
    closeSearchBox () {
      this.showCityBox = false
      this.showSearchBox = false
    }
  },
  mounted () {
    this.cityGroup[0].list = this.search_history
    if (this.depart_date.date_search.length > 0) {
      this.searchForm.date = this.depart_date.date_search
      this.date = this.depart_date.date_display
      this.weekday = this.depart_date.date_week
    }
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
  .group-title{
    font-size: 14px;
    color: rgb(181, 181, 185);
    margin-bottom: 10rpx;
    font-weight: lighter;
  }
  .city-group{
    margin-top: 30rpx;
  }
  .citylist{
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 14px;
    background: #fff;
    color: rgb(115, 115, 122);
    display: inline-block;
    margin-top: 20rpx;
    margin-right: 30rpx;
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
</style>
