// cmms/device/create/index.js
import { scan } from '../../../actions/native'
Page({
  data:{
    btnlabel: 'Load',
    qrCode: '',
    status: '',
    sites: []
  },
  eventScan: function() {
    this.setData({ status: 'Scanning...' })
    wx.scanCode({
      success: (res) => {
        this.setData({
          status: JSON.stringify(res)
        })
      },
      fail: (res) => {
        this.setData({
          status: JSON.stringify(res)
        })
      },
      complete: (res) => {
        this.setData({
          status: JSON.stringify(res)
        })
      }
    })
  },
  eventPost: function() {
    this.setData({
      btnlabel: 'Loading'
    })
    wx.request({
      url: 'http://maso.ittun.com/apm/dataget/site_info',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        console.log(res)
        this.setData({
          sites: res.data,
          status: '',
          btnlabel: 'Load'
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onLoad: () => {},
  onReady:function(){
    // 页面渲染完成
  },
  onShow: function() {
    this.setData({ status: 'Scanning...' })
    wx.scanCode({
      success: res => {
        if (res.errMsg === "scanCode:ok" && res.scanType === 'QR_CODE' && res.result)
        this.setData({
          qrCode: res.result
        })
        wx.showToast({
            title: `QR code: ${res.result}`,
            icon: 'success',
            duration: 1000
        })
      },
      fail: res => {
        this.setData({ status: 'fail!' })
      },
      complete: res => {
        this.setData({ status: 'complete!' })
      }
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})