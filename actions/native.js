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
  const showToast = wxPromisify(wx.showToast)
  showToast({
    title: title,
    icon: 'success',
    duration: 3000,
  }).then(() => {
    wx.navigateTo({ url: page })
  })
}

function wxPromisify(fn) {  
  return function (obj = {}) {    
    return new Promise((resolve, reject) => {      
      obj.success = function (res) {        
        resolve(res)      
      }      

      obj.fail = function (res) {        
        reject(res)      
      }      

      fn(obj)    
    })  
  }
}

export {
    wxPromisify,
    navigate,
    scan
}