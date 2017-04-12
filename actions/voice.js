import rest from './rest'
import * as util from './util'
import { urls } from '../constants/index'

const keyVoice = 'voice'
let playTimeInterval
let recordTimeInterval

const voice = {

    recordStart,
    recordStop,
    recordStopUnexpectedly,

    playSaved,
    play,
    pause,
    stop,

    clear,
    upload,
    save,
    load
}

export default voice

function recordStart () {
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
}

function recordStop() {
    wx.stopRecord()
}

function recordStopUnexpectedly () {
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
}

function playSaved() {
    if (this.data.savedVoice) {
      const voicePath = urls.obj + this.data.savedVoice + '.silk'
      console.log(voicePath)
      wx.playVoice({ filePath: voicePath })
    }
}

function play() {
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
}

function pause() {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.data.voice.playing = false
    this.setData({ voice: this.data.voice })
}

function stop() {
    clearInterval(playTimeInterval)
    this.data.voice = Object.assign(this.data.voice, {
      playing: false,
      formatedPlayTime: util.formatTime(0),
      playTime: 0
    })
    this.setData({ voice: this.data.voice })
    wx.stopVoice()
}

function clear() {
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
}

function upload() {
    if (this.data.voice.tempFilePath) {
        rest.go({
            url: urls.objSingle,
            filePath: this.data.voice.tempFilePath,
            name: 'file'
        }, wx.uploadFile).then(res => {
          const voice = JSON.parse(res.data);

          if (voice.data.objectId)
            save.call(this, voice.data.objectId)
        })
    }
}

function save(data) {
    console.log('saveVoice' + data)
    rest.go({ key: keyVoice, data }, wx.setStorage)
    .then(() => rest.go({ title: '保存成功', duration: 3000}, wx.showToast))
    .then(() => load.call(this))
    .then(() => clear.call(this))
}

function load() {
    rest.go({ key: keyVoice }, wx.getStorage)
    .then(res => res.data, err => '')
    .then(voice => {
      this.setData({ savedVoice: voice })
      console.log('fetch audio data')
      return rest.go({ url: urls.obj + voice, type: 'audio' }, wx.request)
    })
    .then(res => {
      console.log('audio response: ')
      console.log(res)
      this.setData({ savedVoiceData: res.data })
    })
}