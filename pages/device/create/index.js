import { rest } from '../../../actions/index'
import { urls } from '../../../constants/index'

const keyImages = 'images'
Page({
  data:{
    image: {
      list: [],
      count: 5
    },
    savedImages: [],
    qrCode: '',
    status: '',
    voice: {
      recording: false,
      playing: false,
      hasRecord: false,
      recordTime: 0,
      playTime: 0,
      formatedRecordTime: '00:00:00',
      formatedPlayTime: '00:00:00'
    }
  },
  chooseImage() {
    console.log('choose Image...')
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      count: this.data.image.count,
      success: res => {
        this.data.image.list = res.tempFilePaths
        this.setData({
          image: this.data.image
        })
      }
    })
  },
  previewImage(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current,
      urls: this.data.image.list
    })
  },
  uploadImages() {
    let promises = []
    const isFile = true
    this.data.image.list.forEach(path => {
      promises.push(
        rest.go({
          url: urls.objSingle,
          filePath: path,
          name: 'file',
        }, wx.uploadFile)
      )
    })

    Promise.all(promises).then(
      results => {
        const images = results.map(result => {
          const data = JSON.parse(result.data)
          return data.data.objectId
        })

        this.saveImages(images)
      }, 
      err => console.log(err)
    )
  },
  saveImages(images) {
    rest.go({ key: keyImages }, wx.getStorage)
    .then(res => res.data, err => [])
    .then(data => data.concat(images))
    .then(data => rest.go({ key: keyImages, data }, wx.setStorage))
    .then(() => rest.go({ title: '保存成功', duration: 3000 }, wx.showToast))
    .then(() => this.loadImages())
    .then(() => {
      this.data.image.list = []
      this.setData({
        image: this.data.image
      })
    })
  },
  loadImages() {
    return rest.go({ key: keyImages }, wx.getStorage)
    .then(res => res.data, err => [])
    .then(images => {
      const savedImages = images.map(image => urls.obj + image)
      this.setData({ savedImages })
    })
  },
  onLoad() {
    console.log('Device Create page onLoad')
    this.loadImages().then()
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