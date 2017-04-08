class REST {
    constructor() {
        this.header = {
            // 'Content-Type': 'application/json',
            Authentication: null
        }
    }

    setToken(res) {
        if (!this.header.Authentication) {
            if(res && res.data && res.data.data && res.data.data.id_token) {
                const token = res.data.data.id_token
                this.header.Authentication = token
                // this.header.Authorization = token
                getApp().globalData.token = token 
            }
        }
    }

    go(param, fn = wx.request) {
        if (this.header.Authentication) {
            param.header = this.header
        }
            
        return new Promise((resolve, reject) => {
            param.success = res => {
                this.setToken(res)
                switch(res.statusCode) {
                    case 400: reject('Bad Request'); break
                    case 401: reject('Unauthorized'); break
                    case 403: reject('Forbidden'); break
                    case 404: reject('Not Found'); break
                    case 500: reject('Server error'); break
                    case 200: resolve(res); break
                    default: resolve(res); 
                }
            }

            param.fail = err => {
                reject(err)
            }

            fn(param)  
        })
    }

}

export default new REST()