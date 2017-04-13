import { rest, native } from '../../actions/index'
import { urls } from '../../constants/index'

var app = getApp()
Page({
  data: {
    motto: '欢迎来到资产云管家',
    userInfo: {},
    status: ''
  },

  onLoad() {

    /**
     * 微信登录 > 取openid > 自动登录APM, 保存openid, 保存用户资料, 用户名
     **/
    rest.go({}, wx.login)
      .then(res => res.code)                                                                          // 登录微信, 取code
      .then(code => rest.go({ method: 'GET', url: urls.openId + code }))                           // 取openid
      .then(res => res.data.openid)                                                                   // 获得openid
      .then(openid => { getApp().globalData.weChatId = openid; return openid })                       // 存openid
      .then(openid => rest.go({ method: 'POST', url: urls.weChatAuth, data: { weChatId: openid } }))  // 验证openid在APM
      .then(res => res.data.data.loginName)                                                           // 如果存在APM, 取loginName; 否则登录页面
      .then(loginName => getApp().globalData.loginName = loginName)                                   // 存APM登录名
      .then(() => rest.go({}, wx.getUserInfo))                                                        // 取微信用户资料
      .then(res => res.userInfo)                                                                      // 获得微信用户资料
      .then(userInfo => { this.setData({ userInfo }); return userInfo })                              // 显示用户资料
      .then(userInfo => getApp().globalData.userInfo = userInfo)                                      // 保存用户资料
      .then(
        () => wx.redirectTo({ url: '/pages/index' })                                                  // 存GlobalData, 并跳转首页
        ,err => { console.log(err); wx.redirectTo({ url: '/pages/user/login/index' })}                // 失败跳转登录页面
      )
  }
})