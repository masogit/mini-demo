import rest from './rest'
import { urls } from '../constants/index'

let playTimeInterval
let recordTimeInterval
const keyImages = 'images'

function image(e) {
    const eventName = e.target.dataset.action
    switch(eventName) {
        case 'choose': choose.call(this); break;
        case 'preview': preview.call(this, e); break;
        case 'upload': upload.call(this); break;
        case 'save': save.call(this); break;
        case 'load': load.call(this); break;
        default: break;
    }
}

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

    if (this.data.voice.tempFilePath) {
        promises.push(
            rest.go({
                url: urls.objSingle,
                filePath: this.data.voice.tempFilePath,
                name: 'file'
            }, wx.uploadFile)
        )
    }

    Promise.all(promises).then(
    results => {
        const images = results.map(result => {
        const data = JSON.parse(result.data)
        return data.data.objectId
        })

        save(images).call(this)
    }, 
    err => console.log(err)
    )
}

function save(images) {
    rest.go({ key: keyImages }, wx.getStorage)
    .then(res => res.data, err => [])
    .then(data => data.concat(images))
    .then(data => rest.go({ key: keyImages, data }, wx.setStorage))
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
    return rest.go({ key: keyImages }, wx.getStorage)
    .then(res => res.data, err => [])
    .then(images => {
    const savedImages = images.map(image => urls.obj + image)
    this.setData({ savedImages })
    })
}

export default image