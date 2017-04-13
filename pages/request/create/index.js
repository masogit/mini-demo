import { urls } from '../../../constants/index'
import { util, rest } from '../../../actions/index'

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
      formId: e.detail.formId
    }
    const randId = util.rand()
    rest.go({
      method: 'POST',
      url: urls.message + this.data.token,
      data: {
        "touser": form.userId,  
        "template_id": "y44h45NDcMg2P__ltBQONiYS9UvEf_Avg4cJ_d0KmIg", 
        "page": "pages/device/detail/index?id=" + randId,          
        "form_id": form.formId,         
        "data": {
            "keyword1": {
                "value": form.message, 
                "color": "#173177"
            }, 
            "keyword2": {
                "value": "新增报修", 
                "color": "#173177"
            }, 
            "keyword3": {
                "value": "设备编号: " + randId, 
                "color": "#173177"
            } , 
            "keyword4": {
                "value": "某某医院临床科室", 
                "color": "#173177"
            } 
        },
        "emphasis_keyword": "keyword3.DATA" 
      }
    }).then(res => console.log(res))
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