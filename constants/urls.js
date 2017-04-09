const server = 'http://120.132.8.152:8090'
const userAccounts = '/api/apm/security/userAccounts'
const objects = '/hcapmobjecthubservice/api/apm/objectHub/objects'

const urls = {
    basicAuth: userAccounts + '/authenticateBasic',
    weChatBinding: userAccounts + '/weChatBindings',
    weChatAuth: userAccounts+ '/authenticateWeChat',

    obj: objects + '/',
    objSingle: objects + '/single',
    objMutiple: objects + '/multiple',
    objDownload: objects + '/download'
}

Object.keys(urls).forEach(key => urls[key] = server + urls[key])

const secret = '676e03def70993db84044d2a16d2ab50'
const appid = 'wx93fa500d8d386dcc'

urls.getOpenId = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=authorization_code&js_code=`

export default urls