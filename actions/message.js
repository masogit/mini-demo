import rest from './rest'
import { urls } from '../constants/index'

class Message {

  test(form) {
    rest.go({
      method: 'POST',
      url: urls.message + form.token,
      data: {
        "touser": form.userId,  
        "template_id": "y44h45NDcMg2P__ltBQONiYS9UvEf_Avg4cJ_d0KmIg", 
        "page": "pages/device/detail/index?id=" + form.randId,          
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
                "value": "设备编号: " + form.randId, 
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
  }
}

export default new Message()