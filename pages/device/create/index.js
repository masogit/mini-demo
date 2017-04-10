import { rest, util, image } from '../../../actions/index'
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
  image,
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
    const current = e.target.dataset.src
    const list = e.target.dataset.list
    wx.previewImage({
      current,
      urls: list
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

  /** Voice */
  startRecord () {
    this.data.voice.recording = true
    this.setData({ voice: this.data.voice })

    recordTimeInterval = setInterval(() => {
      this.data.voice.recordTime += 1
      this.data.voice.formatedRecordTime = util.formatTime(this.data.voice.recordTime)
      this.setData({ voice: this.data.voice })
    }, 1000)

    wx.startRecord({
      success: res => {
        console.log('voice tempFilePath:' + res.tempFilePath)
        this.data.voice = Object.assign(this.data.voice, {
          hasRecord: true,
          tempFilePath: res.tempFilePath,
          formatedPlayTime: util.formatTime(this.data.playTime)
        })
        this.setData({ voice: this.data.voice })
      },
      complete: () => {
        this.data.voice.recording = false
        // thid.data.voice.playing = false
        this.setData({ voice: this.data.voice })
        clearInterval(recordTimeInterval)
      }
    })
  },
  stopRecord() {
    wx.stopRecord()
  },
  stopRecordUnexpectedly () {
    wx.stopRecord({
      success: () => {
        console.log('stop record success')
        clearInterval(recordTimeInterval)
        this.data.voice = {
          recording: false,
          hasRecord: false,
          recordTime: 0,
          formatedRecordTime: util.formatTime(0)
        }
        this.setData({ voice: this.data.voice })
      }
    })
  },
  playSavedVoice() {
    if (this.data.savedVoice) {
      const voicePath = urls.obj + this.data.savedVoice + '.silk'
      console.log(voicePath)
      wx.playVoice({ filePath: voicePath })
    }
  },
  stopVoice() {
    wx.pauseVoice()
  },
  playVoice() {
    playTimeInterval = setInterval(() => {
      var playTime = this.data.voice.playTime + 1
      console.log('update playTime', playTime)
      this.data.voice = Object.assign(this.data.voice, {
        playing: true,
        formatedPlayTime: util.formatTime(playTime),
        playTime: playTime
      })
      this.setData({ voice: this.data.voice })
    }, 1000)
    wx.playVoice({
      filePath: this.data.voice.tempFilePath,
      success: () => {
        clearInterval(playTimeInterval)
        var playTime = 0
        console.log('play voice finished')
        this.data.voice = Object.assign(this.data.voice, {
          playing: false,
          formatedPlayTime: util.formatTime(playTime),
          playTime: playTime
        })
        this.setData({ voice: this.data.voice })
      }
    })
  },
  pauseVoice() {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.data.voice.playing = false
    this.setData({ voice: this.data.voice })
  },
  stopVoice() {
    clearInterval(playTimeInterval)
    this.data.voice = Object.assign(this.data.voice, {
      playing: false,
      formatedPlayTime: util.formatTime(0),
      playTime: 0
    })
    this.setData({ voice: this.data.voice })
    wx.stopVoice()
  },
  clear() {
    clearInterval(playTimeInterval)
    wx.stopVoice()
    this.data.voice = Object.assign(this.data.voice, {
      playing: false,
      hasRecord: false,
      tempFilePath: '',
      formatedRecordTime: util.formatTime(0),
      recordTime: 0,
      playTime: 0
    })
    this.setData({ voice: this.data.voice })
  },
  uploadVoice() {
    if (this.data.voice.tempFilePath) {
        rest.go({
            url: urls.objSingle,
            filePath: this.data.voice.tempFilePath,
            name: 'file'
        }, wx.uploadFile).then(res => {
          const voice = JSON.parse(res.data);

          if (voice.data.objectId)
            this.saveVoice(voice.data.objectId)
        })
    }
  },
  saveVoice(data) {
    rest.go({ key: keyVoice, data }, wx.setStorage)
    .then(() => rest.go({ title: '保存成功', duration: 3000}, wx.showToast))
    .then(() => this.loadVoice())
    .then(() => this.clear())
  },
  loadVoice() {
    return rest.go({ key: keyVoice }, wx.getStorage)
    .then(res => res.data, err => '')
    .then(voice => {
      // this.setData({ savedVoice: urls.obj + voice + '.silk' })
      this.setData({ savedVoice: 'http://apm.hcdigital.com.cn/clip.mp3' })
    })
  },
  onLoad() {
    console.log('Device Create page onLoad')
    this.loadImages().then()
    this.loadVoice().then()
    this.scanCode()
  },
  clearSaved(e) {
    const media = e.target.dataset.media
    rest.go({ key: media, data: '' }, wx.setStorage)
    .then(() => {
      if (media === keyImages)
        this.setData({ savedImages: '' })
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