class REST {
    constructor() {
        this.token = null
    }

    setToken(res, useranme) {
        console.log(res)
        if (res.errMsg === "request:ok" && res.statusCode === 200) {
          if (res.data && res.data.bizStatusCode === "OK") {
            if (res.data.data && res.data.data.id_token) {
              this.token = res.data.data.id_token
                wx.showToast({
                    title: `登录成功! ${res.data.message}`,
                    icon: 'success',
                    duration: 3000,
                    success: () => {
                        wx.navigateTo({
                            url: "/cmms/index"
                        })
                    }
                })
            }
          }
        } else {
            wx.showToast({
                title: `${res.data.message}`,
                icon: 'fail',
                duration: 3000
            })
        }
        console.log(this.token)
    }

    post(param) {
        if (this.token) {
            param.header.Authentication = this.token
        }
        wx.request(param)
    }
}

export default new REST()