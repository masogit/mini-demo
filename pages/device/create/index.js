import { rest } from '../../../actions/index'
import { urls } from '../../../constants/index'
Page({
  data:{
    imageList: [],
    count: 5,
    qrCode: '',
    status: ''
  },
  chooseImage() {
    console.log('choose Image...')
    wx.chooseImage({
      sourceType: 2,
      sizeType: 2,
      count: this.data.count,
      success: res => {
        console.log(res)
        this.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.imageList
    })
  },
  uploadImages() {
    let promises = []
    const isFile = true
    const token = getApp().globalData.token
    this.data.imageList.forEach(path => {
      promises.push(
        rest.go({
          url: urls.objSingle,
          filePath: path,
          name: 'file',
        }, wx.uploadFile)
      )
    })

    Promise.all(promises).then(
      res => console.log(res), 
      err => console.log(err)
    )
  },
  onLoad() {},
  onReady() {
    // 页面渲染完成
  },
  onShow() {
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