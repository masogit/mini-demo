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

function navigate(page, title) {
  wx.showToast({
      title: title,
      icon: 'success',
      duration: 3000,
      success: () => {
          wx.navigateTo({
              url: page
          })
      }
  })
}

export {
    navigate,
    scan
}