import { rest, native } from '../../../actions/index'
import { urls } from '../../../constants/index'

Page({
  data:{},
  Login: (e) => {
    const data = {
      login_name: e.detail.value.login_name,
      password: e.detail.value.password
    }
    rest.request({
      method: 'POST',
      url: urls.basicAuth,
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
      }
    })
  },
  Input: function(e) {
    console.log(e)
  },
  onLoad:function(options){
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    wx.login({
      success: res => {
        if (res.errMsg === "login:ok" && res.code)
        rest.request({
          method: 'GET',
          url: urls.weChatBinding + '/' + res.code,
          success: res => {
            native.navigate('/cmms/index', `登录成功! ${res.code}`)
          },
          fail: (err) => console.log(err)
        })
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