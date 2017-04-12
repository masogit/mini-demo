import rest from './rest'
import { urls } from '../constants/index'

const keyImages = 'images'

const image = {
    choose,
    preview,
    upload,
    save,
    load
}

export default image

function choose() {
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
}

function preview(e) {
    const current = e.target.dataset.src
    const list = e.target.dataset.list
    wx.previewImage({
      current,
      urls: list
    })
}

function upload() {
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

        save.call(this, images)
      }, 
      err => console.log(err)
    )
}

function save(images) {
    rest.go({ key: keyImages, data: images }, wx.setStorage)
    .then(() => rest.go({ title: '保存成功', duration: 3000 }, wx.showToast))
    .then(() => load.call(this))
    .then(() => {
      this.data.image.list = []
      this.setData({
        image: this.data.image
      })
    })
}

function load() {
    rest.go({ key: keyImages }, wx.getStorage)
    .then(res => res.data, err => [])
    .then(images => {
      const savedImages = images.map(image => urls.obj + image)
      this.setData({ savedImages })
    }, err => console.log(err))
}