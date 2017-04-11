import { rest } from '../actions/index'

Page({
    data: {
        userInfo: null,
        list: [
            {
                id: 'form',
                name: '设备管理',
                open: false,
                pages: [
                    { key: '扫码建档', event: 'scanCode' }, 
                    { key: '扫码查看', page: '/pages/device/detail/index?name=abababab' },
                    { key: '设备查询', page: '/pages/device/list/index' }
                ]
            },
            {
                id: 'widget',
                name: '设备报修',
                open: false,
                pages: ['扫码报修', '报修单查询']
            },
            {
                id: 'feedback',
                name: '工单管理',
                open: false,
                pages: ['扫码处理', '工单查询']
            },
            {
                id: 'nav',
                name: '系统管理',
                open: false,
                pages: [
                    { key: '绑定用户', page: '/pages/user/login/index' }
                ]
            },
        ]
    },
    scanCode() {
        rest.go({}, wx.scanCode).then(res => {
            if (res.result && res.scanType === "QR_CODE")
                rest.go({
                    url: `/pages/device/create/index?qrCode=${res.result}`
                }, wx.navigateTo).then()
        }, err => console.log(err))
    },
    kindToggle: function (e) {
        var id = e.currentTarget.id, list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            list: list
        });
    },
    onLoad: function(options) {
    },
    onShow() {
        this.setData({
            userInfo: getApp().globalData.userInfo
        })
    }
});
