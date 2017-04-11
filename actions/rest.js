class REST {
    constructor() {
        this.header = {
            Authorization: null
        }
    }

    setHeader(res) {
        
        console.log('response:')
        console.log(res)
        
        if(res && res.data && res.data.data) {

            if (res.data.data.id_token) {
                this.header.Authorization = res.data.data.id_token
            }

            if (res.data.data.loginId) {
                this.header.loginId = res.data.data.loginId
            }
        }

    }

    go(param, fn = wx.request) {

        if (this.header.Authorization) {
            param.header = this.header
        }
            
        return new Promise((resolve, reject) => {

            param.success = res => {
                this.setHeader(res)
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

            param.complete = () => {
                console.log('request param:')
                console.log(param)
            }

            fn(param)  
        })
    }

}

export default new REST()