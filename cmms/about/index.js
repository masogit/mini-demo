import { rest, native } from '../../actions/index'
import { urls } from '../../constants/index'

var app = getApp()
Page({
  data: {
    motto: '欢迎来到资产云管家',
    userInfo: {},
    status: ''
  },
  onLoad: function () {
    var that = this
    wx.login({
    success: res => {
        // Login WX success and get User Info
        wx.getUserInfo({
            success: function (res) {
                console.log(res.userInfo)

                var app = getApp()
                app.globalData.userInfo = res.userInfo
                that.setData({
                  userInfo: res.userInfo
                })
            }
        })

        // Auth in APM
        if (res.errMsg === "login:ok" && res.code) {
          // get wechat open_id
            rest.request({
                method: 'GET',
                url: urls.weixin + res.code,
                success: res => {
                  if (res.statusCode ===200 && res.data && res.data.openid) {
                    var app = getApp()
                    app.globalData.weChatId = res.data.openid

                    rest.request({
                        method: 'POST',
                        url: urls.weChatAuth,
                        data: {
                            "weChatId": res.data.openid
                        },
                        success: res => {
                            wx.redirectTo({ url: '/cmms/index' })
                        },
                        fail: (err) => {
                            console.log(err)
                            wx.redirectTo({ url: '/cmms/user/login/index' })
                        }
                    })
                  }
                },
                fail: (err) => {
                    console.log(err)
                    // wx.redirectTo({ url: '/cmms/user/login/index' })
                }
            })

        }
    }
    })
  }
})