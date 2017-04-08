import { rest, native } from '../../../actions/index'
import { urls } from '../../../constants/index'

const app = getApp()
Page({
  data:{
    userInfo: null,
    weChatId: null
  },
  Login(e) {
    const app = getApp()
    const data = {
      loginName: e.detail.value.login_name,
      password: e.detail.value.password,
      newPassword: e.detail.value.password,
      weChatId: app.globalData.weChatId
    }

    rest.go({
      method: 'POST',
      url: urls.weChatBinding,
      data
    }).then(res => res.data.data.loginName)
      .then(loginName => {
        app.globalData.loginName = loginName
        return rest.go({ title: `${loginName} 绑定成功!`, duration: 3000}, wx.showToast)
      })
      .then(() => wx.navigateTo({ url: '/pages/index' })
      , err => wx.showToast({ title: `绑定失败! ${JSON.stringify(err)}`, duration: 5000 }))

  },
  onLoad:function(options){
  },
  onReady:function(){
  },
  onShow:function(){
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo,
      loginName: app.globalData.loginName
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})