class REST {
    constructor() {
        this.header = {
            'Content-Type': 'application/json'
        }
    }

    setToken(token) {
        this.header.Authentication = token
    }

    // setToken(res, callback) {
    //     console.log(res)
    //     if (res.errMsg === "request:ok" && res.statusCode === 200) {
    //       if (res.data && res.data.bizStatusCode === "OK") {
    //         if (res.data.data && res.data.data.id_token) {
    //           this.header.Authentication = res.data.data.id_token
    //           callback()
    //             // wx.showToast({
    //             //     title: `登录成功! ${res.data.message}`,
    //             //     icon: 'success',
    //             //     duration: 3000,
    //             //     success: () => {
    //             //         wx.navigateTo({
    //             //             url: "/cmms/index"
    //             //         })
    //             //     }
    //             // })
    //         }
    //       }
    //     } else {
    //         wx.showToast({
    //             title: `${res.data.message}`,
    //             icon: 'fail',
    //             duration: 3000
    //         })
    //     }
    // }

    request(param) {
        param.header = this.header
        wx.request({
            header: param.header,
            method: param.method,
            url: param.url,
            data: param.data,
            success: (res) => {
                switch(res.statusCode) {
                    case 401: param.fail('Unauthorized'); break
                    case 403: param.fail('Forbidden'); break
                    case 404: param.fail('Not Found'); break
                    case 500: param.fail('Server error'); break
                    case 200: param.success(res); break
                    default: param.fail(res.statusCode); 
                }
            },
            fail: (err) => {
                console.log(err)
            },
            complete: () => {
                console.log('request complete...')
            }
        })
    }

}

export default new REST()