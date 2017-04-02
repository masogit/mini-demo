function scan() {
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
  }

export {
    scan
}