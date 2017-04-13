import { urls } from '../../../constants/index'
import { util, rest, message } from '../../../actions/index'

Page({
  data:{
    userId: '',
    message: '',
    token: ''
  },
  messageSend(e) {
    const form = {
      userId: getApp().globalData.weChatId, //e.detail.value.userId,
      message: e.detail.value.message,
      formId: e.detail.formId,
      randId: util.rand(),
      token: this.data.token
    }

    message.test(form)
  },
  onLoad:function(options){
    rest.go({ method: 'GET', url: urls.accessToken })
    .then(res => res.data.access_token)
    .then(token => this.setData({ token })
    , err => console.log(err))
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