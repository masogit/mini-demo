class REST {
    constructor() {
        this.header = {
            'Content-Type': 'application/json'
        }
    }

    setToken(token) {
        this.header.Authentication = token
    }

    go(param) {
        return new Promise((resolve, reject) => {

            param.header = this.header
            wx.request({
                header: param.header,
                method: param.method,
                url: param.url,
                data: param.data,
                success: (res) => {
                    console.log('request response... :')
                    console.log(res)

                    switch(res.statusCode) {
                        case 400: reject('Bad Request'); break
                        case 401: reject('Unauthorized'); break
                        case 403: reject('Forbidden'); break
                        case 404: reject('Not Found'); break
                        case 500: reject('Server error'); break
                        case 200: resolve(res); break
                        default: reject(res.statusCode); 
                    }
                },
                fail: (err) => {
                    reject(err)
                },
                complete: () => {
                    console.log('request complete... param:')
                    console.log(param)
                }
            })    
        })
    }

}

export default new REST()