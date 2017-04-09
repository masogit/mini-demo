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
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
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
  onLoad() {
    console.log('Device Create page onLoad')
    this.scanCode()
  },
  onReady() {
    // 页面渲染完成
  },
  scanCode() {
    console.log('scan code')
    this.setData({ status: 'scanning...' })
    wx.scanCode({
      success: res => {
        if (res.errMsg === "scanCode:ok" && res.scanType === 'QR_CODE' && res.result) {
          this.setData({
            qrCode: res.result
          })
          console.log('scan code success')
          this.setData({ status: 'success!' })
        } else {
          console.log('scan code complete')
          this.setData({ status: 'complete!' })
        }
      },
      fail: res => {
        console.log('scan code fail')
        this.setData({ status: 'fail!' })
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