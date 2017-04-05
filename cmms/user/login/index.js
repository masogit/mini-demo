import { rest } from '../../../actions/index'
Page({
  data:{
    login_name: 'admin',
    password: 'admin',
    rememberMe: true
  },
  Login: (e) => {
    const data = {
      login_name: e.detail.value.login_name,
      password: e.detail.value.password,
      rememberMe: true
    }
    rest.post({
      header: { 'Content-Type': 'application/json'},
      method: 'POST',
      url: 'http://120.132.8.152:8090/api/apm/security/userAccounts/authenticateBasic',
      data,
      success: res => {
        rest.setToken(res)
        let app = getApp()
        console.log(app)
        app.globalData.username = data.login_name
      }
    })
  },
  Input: function(e) {
    console.log(e)
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})