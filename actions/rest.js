class REST {
    constructor() {
        this.header = {
            'Content-Type': 'application/json'
        }
    }

    setToken(token) {
        this.header.Authentication = token
    }

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