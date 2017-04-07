import { rest, native } from '../../../actions/index'
import { urls } from '../../../constants/index'

const app = getApp()
Page({
  data:{
    userInfo: null,
    weChatId: null
  },
  Login: (e) => {
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
    })
    .then(res => {

        if (res.data && res.data.bizStatusCode === "OK") {
          if (res.data.data && res.data.data.id_token) {

            rest.setToken(res.data.data.id_token)
            if (res.data && res.data.data && res.data.data.loginName){
              app.globalData.loginName = res.data.data.loginName
            }
            native.navigate('/cmms/index', `绑定成功! ${res.data.message}`)

          }
        }

    }, err => {
        wx.showToast({
            title: `绑定失败! ${err}`,
            duration: 3000
        })
    })

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