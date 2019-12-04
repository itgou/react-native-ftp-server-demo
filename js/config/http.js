const __env__ = 'local'
let url, port, protocol
if (__env__ === 'dev') {
    protocol = 'http'
    url = '183.222.39.240'
    port = '8090'
} else if (__env__ === 'home') {
    protocol = 'http'
    url = '192.168.101.109'
    port = '8090'
} else if (__env__ === 'redmi') {
    protocol = 'http'
    url = '192.168.43.245'
    port = '8090'
} else if (__env__ === 'local') {
    protocol = 'http'
    url = '192.168.2.254'
    port = '8090'
} else {
    protocol = 'https'
    url = 'ems2.lockcloud.cn'
    port = '443'
}
const wsPort = '9501'
const bigUpdateAppLink = protocol + '://' + url + ':' + port + '/downloadApp.html'
export {protocol, url, port, wsPort, bigUpdateAppLink}


