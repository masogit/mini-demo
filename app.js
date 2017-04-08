App({
    onLaunch: () => console.log('app start...'),
    onShow: function () {
    },
    onHide: function () {
        console.log('App Hide')
    },
    globalData: {
        userInfo: null,
        weChatId: null,
        loginName: null
    }
});