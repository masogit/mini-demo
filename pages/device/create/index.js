Page({
  data:{
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  
    btnlabel: 'Load',
    qrCode: '',
    status: '',
    sites: []
  },
  sourceTypeChange(e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },
  sizeTypeChange(e) {
    this.setData({
      sizeTypeIndex: e.detail.value
    })
  },
  countChange(e) {
    this.setData({
      countIndex: e.detail.value
    })
  },
  chooseImage() {
    console.log('choose Image...')
    wx.chooseImage({
      sourceType: 2,
      sizeType: 2,
      count: this.data.count[this.data.countIndex],
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
      current: current,
      urls: this.data.imageList
    })
  },
  onLoad: () => {},
  onReady:function(){
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