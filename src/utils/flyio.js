/**
* Created by cooper.cai on 2019/06/18
*/
import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()
const host = 'https://api.hotban.top/xiaoJingAdmin/wxApp'

// 请求拦截器
fly.interceptors.request.use((request) => {
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  request.headers = {
    'X-Tag': 'flyio',
    'content-type': 'application/json'
  }

  let authParams = {
    // 公共参数
    // 'categoryType': 'SaleGoodsType@sim',
    // 'streamNo': 'wxapp153570682909641893',
    // 'reqSource': 'MALL_H5',
    // 'appid': 'string',
    // 'timestamp': new Date().getTime(),
    // 'sign': 'string'
  }

  request.body && Object.keys(request.body).forEach((val) => {
    if (request.body[val] === '') {
      delete request.body[val]
    }
  })

  request.body = {
    ...request.body,
    ...authParams
  }

  return request
})

// 响应拦截
fly.interceptors.response.use(
  (res) => {
    wx.hideLoading()
    return res.data
  },
  (err) => {
    console.log(err)
    wx.hideLoading()
    wx.showToast({
      title: '网络不流畅，请稍后再试!',
      icon: 'none'
    })
  }
)

fly.config.baseURL = host

export default fly
