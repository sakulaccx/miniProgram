<template>
  <div class="time-shadow" v-if="show">
    <div class="time-wrap">
      <div class="top-bar">
        <div class="left-close iconfont icon-guanbi2" @click="closePopup"></div>
        <div class="right-reset" @click="clearForm">重置</div>
        <div class="clearfix"></div>
      </div>
      <div class="list-wrap">
        <div class="time-box list-box">
          <div class="list-title">
            <span>起飞时段</span><span>(多选)</span>
          </div>
          <div class="list-subtitle">未选择起飞时段，则展示全部</div>
          <div class="list-item" v-for="(item, index) in timeList" :key="index" @click='saveTimeRange(item)' :class="item.iselected ? 'selected-item' : ''">
            <div class="left-title">{{item.label}}</div>
            <div class="right-arrow iconfont icon-select-line"></div>
            <div class="clearfix"></div>
          </div>
        </div>
        <div class="flight-box list-box">
          <div class="list-title">
            <span>航空公司</span><span>(多选)</span>
          </div>
          <div class="list-subtitle">未选择航空公司，则展示全部</div>
          <div class="list-item" v-for="(item, index) in flightList" :key="index" :class="item.iselected ? 'selected-item' : ''" @click='selectFlightNo(item)'>
            <div class="left-title">{{item.label}}</div>
            <div class="right-arrow iconfont icon-select-line"></div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <div class="btn confirm-btn" @click="userFilter">启用</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
export default {
  props: ['show'],
  data () {
    return {
      tplTimeSlotList: [],
      tplCompanyList: [],
      timeList: [
        {
          label: '00:00 - 06:00',
          value: '00:00-06:00',
          range: 0,
          iselected: false
        },
        {
          label: '06:00 - 12:00',
          value: '06:00-12:00',
          range: 1,
          iselected: false
        },
        {
          label: '12:00 - 18:00',
          value: '12:00-18:00',
          range: 2,
          iselected: false
        },
        {
          label: '18:00 - 00:00',
          value: '18:00-00:00',
          range: 3,
          iselected: false
        }
      ],
      flightList: [],
      timeRage: [],
      flightCode: []
    }
  },
  components: {},
  computed: {
    ...mapState([
      'detail_date',
      'isfiltered'
    ])
  },
  methods: {
    ...mapMutations({
      setDepart: 'SET_DEPART_DATE',
      setDetailSearch: 'SET_DETAIL_DATE',
      setFilter: 'SET_FILTER'
    }),
    getStoreFromBefore () {
      this.tplTimeSlotList = this.detail_date.timeSlotList
      this.tplCompanyList = this.detail_date.companyList
    },
    closePopup () {
      if (!this.isfiltered) {
        this.clearForm()
      } else {
        this.resetForm()
      }
      this.$emit('closeTimeBox')
    },
    updateData () {
      this.$emit('updateData')
    },
    resetForm () {
      this.timeRage = []
      this.flightCode = []

      this.timeList.forEach((v, i) => {
        v.iselected = false
      })
      this.flightList.forEach((v, i) => {
        v.iselected = false
      })

      this.timeList.forEach((v, i) => {
        this.tplTimeSlotList.forEach((v1, i1) => {
          if (v.value === v1) {
            v.iselected = true
            this.timeRage.push(v)
          }
        })
      })

      this.flightList.forEach((v, i) => {
        this.tplCompanyList.forEach((v1, i1) => {
          if (v.value === v1) {
            v.iselected = true
            this.flightCode.push(v)
          }
        })
      })
    },
    clearForm () {
      this.timeList.forEach((v, i) => {
        v.iselected = false
      })
      this.flightList.forEach((v, i) => {
        v.iselected = false
      })

      this.timeRage = []
      this.flightCode = []
    },
    clearFormParent () {
      this.tplTimeSlotList = []
      this.tplCompanyList = []
      this.clearForm()
    },
    saveTimeRange (_obj) {
      if (!_obj.iselected) {
        _obj.iselected = true
        this.timeRage.push(_obj)
      } else {
        _obj.iselected = false
        this.timeRage.forEach((v, i) => {
          if (v.value === _obj.value) {
            this.timeRage.splice(i, 1)
          }
        })
      }
    },
    selectFlightNo (_obj) {
      if (!_obj.iselected) {
        _obj.iselected = true
        this.flightCode.push(_obj)
      } else {
        _obj.iselected = false
        this.flightCode.forEach((v, i) => {
          if (v.value === _obj.value) {
            this.flightCode.splice(i, 1)
          }
        })
      }
    },
    userFilter () {
      this.setFilter(1)
      if (this.timeRage.length === 0 && this.flightCode.length === 0) {
        let objDep = {
          timeSlotList: [],
          companyList: []
        }

        let objDet = {
          timeSlotList: [],
          companyList: []
        }
        this.tplTimeSlotList = []
        this.tplCompanyList = []
        this.clearForm()
        this.setDepart(objDep)
        this.setDetailSearch(objDet)
      } else {
        let _tplarr = []
        let _tplarr2 = []

        if (this.timeRage.length > 0) {
          this.timeRage.sort((a, b) => {
            return a['range'] - b['range']
          })
          this.timeRage.forEach((v, i) => {
            _tplarr.push(v.value)
          })
        }

        if (this.flightCode.length > 0) {
          this.flightCode.forEach((v, i) => {
            _tplarr2.push(v.value)
          })
        }

        let objDep = {
          timeSlotList: _tplarr,
          companyList: _tplarr2
        }

        let objDet = {
          timeSlotList: _tplarr,
          companyList: _tplarr2
        }

        this.tplTimeSlotList = _tplarr
        this.tplCompanyList = _tplarr2

        this.setDepart(objDep)
        this.setDetailSearch(objDet)
      }

      this.updateData()
    },
    getCompanyList () {
      this.$fly.post('/flightData/getCompanies', {
        departureCityCode: this.detail_date.departureCityCode,
        arrivalCityCode: this.detail_date.arrivalCityCode,
        departureDate: this.detail_date.departureDate
      }).then(res => {
        if (res.code === '0' && res.data && res.data.length > 0) {
          this.flightList = []
          res.data.forEach((v, i) => {
            this.flightList.push({
              label: v,
              value: v,
              iselected: false
            })
          })

          this.resetForm()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    console.log(this.detail_date)
    // this.getStoreFromBefore()
  },
  created () {
    // let app = getApp()
  }
}
</script>

<style scoped>
.time-shadow{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f5f5f5;
  z-index: 10000
}
.time-wrap{
  position: relative;
  width: 100%;
  height: 100%;
}
.top-bar{
  height: 80rpx;
  line-height: 80rpx;
  width: 100%;
}
.left-close{
  float: left;
  margin-left: 30rpx;
  font-size: 48rpx;
  color: #7796E3;
}
.right-reset{
  float: right;
  margin-right: 32rpx;
  font-size: 28rpx;
  color: #7096e9;
}
.btn-wrap{
  position: absolute;
  width: 100%;
  background: #fff;
  bottom: 0;
}
.confirm-btn{
  height: 64rpx;
  line-height: 64rpx;
  width: 70%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 40rpx;
  border: 0 none;
  background: #2065ff;
}
.list-wrap{
  height: 100%;
}
.time-box{
  height: 40%;
  overflow: hidden;
  overflow-y: auto;
}
.list-title{
  width: 87%;
  margin: 0 auto;
  position: relative;
  font-size: 28rpx;
  color: #3d3d3d;
}
.list-subtitle{
  width: 87%;
  margin: 0 auto;
  font-size: 22rpx;
  padding-top: 10rpx;
  color: #878787;
}
.list-title span:first-child{
  margin-left: 30rpx;
}
.list-title:before{
  content: " ";
  display: block;
  height: 100%;
  width: 13rpx;
  position: absolute;
  left: 0;
  top: 0;
  background: #7096e9;
  border-radius: 5rpx;
}
.list-title span:last-child{
  font-size: 22rpx;
  color: #878787;
}
.list-item{
  margin: 0 auto;
  width: 87%;
  height: 80rpx;
  line-height: 80rpx;
  border-bottom: 2rpx solid #ccc;
}
.left-title{
  float: left;
  font-size: 22rpx;
  color: #000;
}
.right-arrow{
  float: right;
  font-size: 40rpx;
  color: #b5b5b5;
}
.selected-item .left-title,
.selected-item .right-arrow{
  color: #7096e9;
}
.flight-box{
  height: 40%;
  overflow: hidden;
  overflow-y: auto;
}
</style>
