const server = 'http://120.132.8.152:8090'
const urls = {
    basicAuth: '/api/apm/security/userAccounts/authenticateBasic',
    weChatBinding: '/api/apm/security/userAccounts/weChatBindings'
}

Object.keys(urls).forEach(key => urls[key] = server + urls[key])

export default urls