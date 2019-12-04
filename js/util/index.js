import lodash from 'lodash'
import DataUtil from "./DataUtil";
import {getAlertList} from "../http/api";

/**
 * 将已经删除的基站从数据中过滤掉
 * @param id int 已删除基站ID
 * @param baseList  Array  基站列表数据
 * @returns {*}
 */
export const deleteBaseFromState = (id, baseList) => {
    return baseList.filter(item => item.id !== id)
}

/**
 * 根据时间戳返回 固定时间格式 01:05
 * @param date
 * @returns {string}  00：00
 */
export const getFormateTime = (time) => {
    let hour = time.getHours()
    let minute = time.getMinutes()
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    return hour + ':' + minute
}
/**
 * 根据时间戳返回 固定日期格式 2019-01-01
 * * @param date
 * @returns {string}  00：00
 */
export const getFormateDate = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    return year + '-' + month + '-' + day
}
/**
 * 根据时间戳返回 固定日期时间格式 2019-01-01 18:00
 * * @param date
 * @returns {string}  00：00
 */
export const getFormateDateTime = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}
/**
 * 根据时间戳返回 固定日期时间格式 2019-01-01 18:00:00
 * * @param date
 * @returns {string}  00：00
 */
export const getFormateDateTimeSecond = (date) => {

    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (second < 10) second = '0' + second
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
/**
 * 根据名称获取选项的值
 * @param value  '1'
 * @param options Array //[{name:'a',value:'1'},{name:'b',value:'2'}]
 * @returns name 'a'
 */
export const getNameByOptionValue = (value, options) => {
    if (value === '' || undefined) return ''
    if (options.length < 1) return ''
    let len = options.length
    let obj = {}
    for (let i = 0; i < len; i++) {
        if (options[i].value === value) {
            obj = options[i]
            break
        }
    }
    return obj.name
}
/**
 * 根据地区名称获取地区编号，
 * @param areaPlatObj   Object 地区集合
 * @param pickedValue  Array 地区名称
 * @returns {string} 逗号相连的地区编号
 */
export const getCodeStringByNameArray = (areaPlatObj, pickedValue) => {
    if (Object.prototype.toString.call(areaPlatObj) !== '[object Object]') {
        console.error('param areaObj should be an Object')
    }
    if (Object.prototype.toString.call(pickedValue) !== '[object Array]') {
        console.error('param nameArr should be an Array')
    }
    return areaPlatObj[pickedValue[0]] + ',' + areaPlatObj[pickedValue[1]] + ',' + areaPlatObj[pickedValue[2]]
}
/**
 * 根据地区编号获取地区名称
 * @param areaPlatObj Object 地区集合
 * @param codeString  地区编码
 * @returns {string}  空格相连的地区名称
 */
export const getNameStringFromCodeString = (areaPlatObj, codeString, split = ' ') => {
    if (!codeString) {
        return ''
    }
    if (typeof codeString !== 'string') {
        console.error('param codeString should be a string')
    }
    let invertArea = lodash.invert(areaPlatObj)
    if (Object.prototype.toString.call(areaPlatObj) !== '[object Object]') {
        console.error('param areaObj should be an Object')
    }
    let codeArr = codeString.split(',')
    return invertArea[codeArr[0]] + split + invertArea[codeArr[1]] + split + invertArea[codeArr[2]]
}

export const filterBaseList = (baseList, type) => {
    switch (type) {
        case 'all':
            return baseList
            break;
        case 'outTime':
            return baseList.filter(item => item.power_status === 0)
            break;
        case 'powerOff':
            return baseList.filter(item => item.power_status === 1)
            break;
        case 'normal':
            return baseList.filter(item => item.power_status === 2)
            break;
        default:
    }
}

export const filterSpecifiedBase = (id, baseData) => {
    let data = baseData.filter(item => item.id === id)
    return data[0]
}

export const transferObjToArray = (obj) => {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
        console.error('transferObjToArray function error: params should be object')
    }
    let arr = []
    for (let key in obj) {
        arr.push({
            name: obj[key],
            value: key
        })
    }
    return arr;
}

export const transferArrayToObjArray = (array) => {
    if (Object.prototype.toString.call(array) !== '[object Array]') {
        console.error('transferObjToArray function error: params should be an array')
    }
    let arr = []
    array.forEach(item => {
        arr.push({
            name: item,
            value: item
        })
    })
    return arr;
}


export const setAlertRead = (alertId) => {
    console.log('settingAlertRead')
    return new Promise((resolve, reject) => {
        DataUtil.getLocalData('alertRead')
            .then(alertRead => {
                if (alertRead) {
                    if (!alertRead.some(id => id === alertId)) { //数组中没有该告警id　则添加该告警id
                        alertRead.push(alertId)
                    } else {
                        resolve(0)
                    }
                } else {
                    alertRead = [alertId]  //没有存储该字段说明是第一次，直接该告警id放入数组
                }
                DataUtil.setLocalData('alertRead', alertRead)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
    })
}
export const cancelAlertRead = (alertId) => {
    return new Promise((resolve, reject) => {
        DataUtil.getLocalData('alertRead')
            .then(alertRead => {
                if (alertRead) {
                    alertRead = alertRead.filter(id => id !== alertId)
                } else {
                    alertRead = []
                }
                DataUtil.setLocalData('alertRead', alertRead)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
    })
}

export const wrapData = async (alertList) => {
    if (alertList.length < 1) return alertList
    try {
        let hasReadData = await DataUtil.getLocalData('alertRead')
        let firstUseTime = await DataUtil.getLocalData('firstUseTime')
        firstUseTime = Number(firstUseTime)
        let createTimeStamp, hasRead
        alertList = alertList.map(alert => {
            // alert.create_time = alert.create_time.replace(/-/g,'/') //react-native关闭调试模式后 不支持　new Date('2019-05-04 09:04:05') 可支持　new Date('2019/05/04 09:04:05' )
            createTimeStamp = parseDate(alert.create_time).getTime()
            hasRead = false
            if (hasReadData) {
                hasRead = hasReadData.some(id => id === alert.id)
            }
            if (firstUseTime >= createTimeStamp) {
                hasRead = true
            }
            alert.hasRead = hasRead
            return alert
        })
        return alertList
    } catch (e) {

    }
}

export const setAlertReadInAlertList = (alertList, alertId, type) => {
    let len = alertList.length
    if (len < 1) return alertList
    for (let i = 0; i < len; i++) {
        if (alertList[i].id === alertId) {
            alertList[i]['hasRead'] = type
            break;
        }
    }
    return alertList
}

export function parseDate(date) {
    let isoExp, parts;
    isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s(\d\d):(\d\d):(\d\d)\s*$/;
    try {
        parts = isoExp.exec(date);
    } catch (e) {
        return null;
    }
    if (parts) {
        date = new Date(parts[1], parts[2] - 1, parts[3], parts[4], parts[5], parts[6]);
    } else {
        return null;
    }
    return date;
}

export function isEmptyObj(obj) {
    return Object.keys(obj).length === 0
}

export const filterGroupList = (groupList, districtCode) => {
    let res = [{name: '无', value: "" + 0}]
    // districtCode = Number(districtCode)
    groupList.forEach(item => {
        if (Number(item.divisionCode) === Number(districtCode)) {
            res.push({
                name: item.name,
                value: String(item.id),
            })
        }
    })
    console.log(res)
    return res;
}

export const _generatePersonalAreaList = (divisions, areaPlatObj) => {
    let data = [];
    divisions.forEach(item => {
        let completeCodeStr = item.substr(0, 2) + '0000,' + item.substr(0, 4) + '00,' + item
        let completeNameArr = getNameStringFromCodeString(areaPlatObj, completeCodeStr, ',').split(',')
        console.log(completeNameArr)
        let provinceObj = {}
        provinceObj.name = completeNameArr[0]
        provinceObj.city = []
        let cityObj = {}
        cityObj.name = completeNameArr[1]
        cityObj.area = []
        cityObj.area.push(completeNameArr[2])
        provinceObj.city.push(cityObj)
        data.push(provinceObj)
    })
    removeDuplicate(data)
}


export const generatePersonalAreaList = (divisions, areaPlatObj) => {
    let invertArea = lodash.invert(areaPlatObj)
    let data = []
    divisions.forEach(item => {
        data.push(item.substr(0, 2) + '0000')
        data.push(item.substr(0, 4) + '00')
        data.push(item)
    })
    data = [...new Set(data)].sort((a, b) => a - b).map(item => [item, invertArea[item]])
    return transferPlatAreaToAreaJson(data)
}

const transferPlatAreaToAreaJson = (data) => {
    console.log(data)
    let dataArr = [], provinceObj = {}, cityObj = {}, preTwo, middleTwo
    data.forEach((item) => {
        if (!preTwo || preTwo !== item[0].substr(0, 2)) {
            preTwo = item[0].substr(0, 2)
            middleTwo = null
            provinceObj = {}
            provinceObj.name = item[1]
            provinceObj.city = []
            dataArr.push(provinceObj)
        } else {
            if (!middleTwo || middleTwo !== item[0].substr(2, 2)) {
                middleTwo = item[0].substr(2, 2)
                cityObj = {}
                cityObj.name = item[1]
                cityObj.area = []
                provinceObj.city.push(cityObj)
            } else {
                cityObj.area.push(item[1])
            }
        }
    })
    return dataArr
}

export const transferAppBigVersionToNumber = (appVersion) => {
    let versionReg = new RegExp(/^(\d+)\.(\d+)\.(\d+)$/)
    let res = versionReg.exec(appVersion)
    let versionString = res[1] + '.' + res[2]
    return Number(versionString)
}
export const getTime = (date) => {
    const year = date.getFullYear()
    let month = getOKText(date.getMonth() + 1)
    let day = getOKText(date.getDate())
    let hour = getOKText(date.getHours())
    let minute = getOKText(date.getMinutes())
    let second = getOKText(date.getSeconds())
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
export const getOKText = (number) => {
    if (number < 10) number = `0${number}`
    return number
}

export const sleep = (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
