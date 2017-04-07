import { rest, native } from '../../actions/index'
import { urls } from '../../constants/index'

var app = getApp()
Page({
  data: {
    motto: '欢迎来到资产云管家',
    userInfo: {},
    status: ''
  },

  setStatus(msg) {
    console.log(msg)
    this.setData({
      status: msg
    })
  },

  onLoad: function () {
    var that = this

    wx.login({
    success: res => {

        // Login WX success and get User Info
        that.setStatus('wx login success')
        wx.getUserInfo({
            success: function (res) {
                that.setStatus('got userInfo: ' + res.userInfo)

                var app = getApp()
                app.globalData.userInfo = res.userInfo
                that.setData({
                  userInfo: res.userInfo
                })
            }
        })

        // Auth in APM
        if (res.errMsg === "login:ok" && res.code) {

            rest.go({ method: 'GET', url: urls.getOpenId + res.code })
                .then(
                  res => {

                    const openid = res.data.openid
                    var app = getApp()
                    app.globalData.weChatId = openid

                    const param = {
                      method: 'POST',
                      url: urls.weChatAuth,
                      data: {
                          "weChatId": openid
                      }
                    }

                    return rest.go(param) 

                  }, (err) => wx.redirectTo({ url: '/pages/user/login/index' })

                ).then(
                    (res) => {
                      if (res.data && res.data.data && res.data.data.loginName){
                        app.globalData.loginName = res.data.data.loginName
                      }
                      wx.redirectTo({ url: '/pages/index' })
                    }, 
                    (err) => { console.log(err); wx.redirectTo({ url: '/pages/user/login/index' }) }
                )

        }
    }
    })
  }
})