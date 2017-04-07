import { rest, native } from '../../../actions/index'
import { urls } from '../../../constants/index'

Page({
  data:{
    userInfo: null,
    weChatId: null
  },
  Login: (e) => {
    const app = getApp()
    const data = {
      login_name: e.detail.value.login_name,
      password: e.detail.value.password,
      newPassword: e.detail.value.password,
      weChatId: app.globalData.weChatId
    }
    rest.request({
      method: 'POST',
      url: urls.weChatBinding,
      data,
      success: res => {
        if (res.errMsg === "request:ok" && res.statusCode === 200) {
          if (res.data && res.data.bizStatusCode === "OK") {
            if (res.data.data && res.data.data.id_token) {
              rest.setToken(res.data.data.id_token)
              native.navigate('/cmms/index', `登录成功! ${res.data.message}`)
            }
          }
        } else {
            wx.showToast({
                title: `${res.data.message}`,
                icon: 'fail',
                duration: 3000
            })
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  onLoad:function(options){
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    const app = getApp()
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})