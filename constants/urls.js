
// const server = 'http://120.132.8.152:8090'
// const server = 'https://my-node.run.aws-jp01-pr.ice.predix.io' 
const server = 'https://apmgw.ittun.com' 

const userAccounts = '/api/apm/security/userAccounts'
const objects = '/hcapmobjecthubservice/api/apm/objectHub/objects'

const apm = {
    basicAuth: userAccounts + '/authenticateBasic',
    weChatBinding: userAccounts + '/weChatBindings',
    weChatAuth: userAccounts+ '/authenticateWeChat',

    obj: objects + '/',
    objSingle: objects + '/single',
    objMutiple: objects + '/multiple',
    objDownload: objects + '/download'
}

Object.keys(apm).forEach(key => apm[key] = server + apm[key])

const secret = '676e03def70993db84044d2a16d2ab50'
const appid = 'wx93fa500d8d386dcc'

// const appid = 'wx6afcb0709ba1a1d0'
// const secret = 'ce53fe3004829bcae9f0c409cd87fe3a'

const wx = {
    openId: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&grant_type=authorization_code&js_code=`,
    accessToken: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`,
    message: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=`
}

const urls = Object.assign(apm, wx)

export default urls