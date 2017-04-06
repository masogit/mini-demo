// cmms/device/create/index.js
import { scan } from '../../../actions/native'
Page({
  data:{
    btnlabel: 'Load',
    qrCode: '',
    text: '',
    sites: []
  },
  eventScan: function() {
    this.setData({ text: 'Scanning...' })
    wx.scanCode({
      success: (res) => {
        this.setData({
          text: JSON.stringify(res)
        })
      },
      fail: (res) => {
        this.setData({
          text: JSON.stringify(res)
        })
      },
      complete: (res) => {
        this.setData({
          text: JSON.stringify(res)
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
          text: '',
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
    this.setData({ text: 'Scanning...' })
    wx.scanCode({
      success: res => {
        if (res.errMsg === "scanCode:ok" && res.scanType === 'QR_CODE' && res.result)
        this.setData({
          qrCode: JSON.stringify(res.result)
        })
        wx.showToast({
            title: `QR code: ${res.result}`,
            icon: 'success',
            duration: 1000
        })
      },
      fail: res => {
        this.setData({ text: 'fail!' })
      },
      complete: res => {
        this.setData({ text: 'complete!' })
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