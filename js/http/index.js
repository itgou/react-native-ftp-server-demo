import axios from 'axios'
import qs from 'qs'
import {AsyncStorage, DeviceEventEmitter} from 'react-native'
import {url, port, protocol} from '../config/http'

const CancelToken = axios.CancelToken
const source = axios.CancelToken.source();
let service = axios.create({
    baseURL: protocol + "://" + url + ':' + port,
    timeout: 10000
})
const setToken = async (config) => {
    try {
        let token = await AsyncStorage.getItem('token')
        config.headers['Authorization'] = token;
        return config
    } catch (error) {
        console.log('error')
    }
}
//添加请求拦截器
service.interceptors.request.use(
    config => {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data)
        }

        config = setToken(config)
        return config
    },
    error => {
        return Promise.reject(error)
    })
//添加响应拦截器
service.interceptors.response.use(
    response => {
        /**
         *
         * 下面的注释为通过在response里，自定义code来标示请求状态
         * 当code返回如下情况则说明权限有问题，登出并返回到登录页
         * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
         */

        // response => {
        //   const res = response.data
        //   if (res.code !== 20000) {
        //     })

        //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        //       }).then(() => {
        //         })

        //       })
        //     }
        //     return Promise.reject('error')
        //   } else {

        //     return response.data
        //   }
        // },
        return response.data
    },
    error => {

        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误'
                    break

                case 401:
                    error.message = '未授权，请登录'
                    DeviceEventEmitter.emit('tokenExpired', error)
                    return Promise.reject(error)

                case 403:
                    error.message = '拒绝访问'

                    break

                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`

                    break

                case 408:
                    error.message = '请求超时'
                    break

                case 500:
                    error.message = '服务器内部错误'
                    break

                case 501:
                    error.message = '服务未实现'
                    break

                case 502:
                    error.message = '网关错误'
                    break

                case 503:
                    error.message = '服务不可用'
                    break

                case 504:
                    error.message = '网关超时'
                    break

                case 505:
                    error.message = 'HTTP版本不受支持'
                    break

                default:
                    error.message = '出错啦！'
            }
        }
        console.log('error info:' + error)
        // DeviceEventEmitter.emit('networkError', error)
        return Promise.reject(error)
    }
)
const http = {
    //get请求
    get(url, param, showLoading = true) {
        return new Promise((resolve, reject) => {
            service({
                method: 'get',
                url,
                params: param,
                showLoading,
                cancelToken: source.token,
            }).then(res => {  //axios返回的是一个promise对象
                resolve(res)  //resolve在promise执行器内部
            }).catch(err => {
                reject(err)
            })

        })
    },
    //post请求
    post(url, param) {
        return new Promise((resolve, reject) => {
            service({
                method: 'post',
                url,
                data: param,
                cancelToken: source.token,
                // cancelToken: new CancelToken(c => {
                //     cancel = c
                // })
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    //delete请求
    delete(url, param) {
        return new Promise((resolve, reject) => {
            service({
                method: 'delete',
                url,
                data: param,
                cancelToken: source.token,
                // cancelToken: new CancelToken(c => {
                //     cancel = c
                // })
            }).then(res => {
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    }
}
// export default service
export default http
