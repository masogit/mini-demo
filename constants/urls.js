const server = 'http://120.132.8.152:8090'
const urls = {
    basicAuth: '/api/apm/security/userAccounts/authenticateBasic',
    weChatBinding: '/api/apm/security/userAccounts/weChatBindings',
    weChatAuth: '/api/apm/security/userAccounts/authenticateWeChat',

    objSingle: '/api/apm/objectHub/objects/single'
}

Object.keys(urls).forEach(key => urls[key] = server + urls[key])

const secret = '676e03def70993db84044d2a16d2ab50'
const appid = 'wx93fa500d8d386dcc'

urls.getOpenId = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=authorization_code&js_code=`

export default urls