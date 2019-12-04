import http from './index'


export const updatePassword = (values) => {
    return http.post('app/updatePassword', values)
}
export const login = (params) => {
    return http.post('/app/login', params)
}

export const getMpFields = () => {
    return http.get('/app/mpFields')
}

export const createBaseStation = (params) => {
    return http.post('/app/bs/create', params)
}
export const updateBaseStation = async (params) => {
    return http.post('/app/bs/update', params)
}
export const getBaseList = (params) => {
    return http.get('/app/bs/list', params)
}
export const getBaseDetail = (params) => {
    return http.get('/app/bs/detail', params)
}
export const getMeterDetail = (params) => {
    return http.get('/app/bs/meterInfo', params)
}
export const deleteBase = (id) => {
    return http.post('/app/bs/delete', {id})
}

export const getGroupList = () => {
    return http.get('/app/bs/getGroupList')
}

export const bindMeterBySn = (params) => {
    return http.post('/app/bs/bindBySN', params)
}
export const unbindMeter = (params) => {
    return http.post('/app/bs/unbind', params)
}
export const getStatistics = (params) => {
    return http.get('/app/bs/statistics', params)
}
export const getAlertList = (params) => {
    return http.get('/app/alert/list', params)
}

export const getUserInfo = () => {
    return http.get('/app/getUserInfo')
}
export const getLatestBigVersion = () => {
    return http.get('/app/getLatestBigVersion')
}
