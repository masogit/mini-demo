import { rest, util, image, voice } from '../../../actions/index'
import { urls } from '../../../constants/index'

let playTimeInterval
let recordTimeInterval
const keyImages = 'images'
const keyVoice = 'voice'

Page({

  data:{

    image: {
      list: [],
      count: 5
    },

    savedImages: [],
    savedVoice: '',
    savedVoiceData: '',

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

  /** Images */
  image(e) { util.exec.call(this, e, image) },

  /** Voice */
  voice(e) { util.exec.call(this, e, voice) },


  upload() {
    voice.upload.call(this)
    image.upload.call(this)
  },
  onLoad(param) {
    console.log('Device Create page onLoad')
    image.load.call(this)
    voice.load.call(this)
    this.setData({
      userInfo: getApp().globalData.userInfo,
      qrCode: param.qrCode
    })
  },
  clearSaved(e) {
    const media = e.target.dataset.media
    rest.go({ key: media, data: null }, wx.setStorage)
    .then(() => {
      if (media === keyImages)
        this.setData({ savedImages: [] })
      if (media === keyVoice)
        this.setData({ savedVoice: '' })
    })
  },
  onReady() {
    // 页面渲染完成
  },
  scanCode() {
    console.log('scan code')
    this.setData({ status: 'scanning...' })
    rest.go({}, wx.scanCode).then(res => {
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
    }, err => {
        console.log('scan code fail')
        this.setData({ status: 'fail!' })
    })
  },
  onShow() {
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})