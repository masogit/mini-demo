import { util, rest } from '../../../actions/index'


const randId = util.rand()
Page({
  data: {
    name: randId
  },
  onLoad(param) {
    if (param && param.id) {
      this.setData({
        name: param.id
      })
    }
  },
  onShareAppMessage(obj) {

    return {
      title: '查看设备, 编号: ' + randId,
      path: '/pages/device/detail/index?id=' + randId,
      success: function(res) {
        rest.go({ title: '分享设备成功, 编号:' + randId }, wx.showToast)
        .then()
      },
      fail: function(res) {
        rest.go({ title: '分享设备失败' }, wx.showToast)
        .then()
      }
    }
  }
})
