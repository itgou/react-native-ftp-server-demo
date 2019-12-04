import {AsyncStorage} from 'react-native'

export default class DataUtil {
    static getLocalData(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, value) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(value))
                    } catch (e) {
                        reject(e)
                        console.error('JSON.parse Error:', e)
                    }
                } else {
                    reject(error)
                    console.error('AsyncStorage.get(' + key + ') Error:', error)
                }
            })
        })
    }

    static multiGetLocalData(keys) {
        let res = {};
        return new Promise((resolve, reject) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
                if (!error) {
                    try {
                        stores.map(store => {
                            res[store[0]] = JSON.parse(store[1])
                        })
                        resolve(res)
                    } catch (e) {
                        reject(e)
                        console.error('multiGet JSON.parse Error:', e)
                    }
                } else {
                    reject(error)
                    console.error('AsyncStorage.multiGet(' + keys + ') Error:', error)
                }
            })
        })
    }

    static setLocalData(key, value) {
        return new Promise((resolve, reject) => {
            value = JSON.stringify(value)
            AsyncStorage.setItem(key, value, (error) => {
                if (!error) {
                    resolve(1)
                } else {
                    reject(error)
                    console.error('AsyncStorage.set(' + key + ') Error:', error)
                }
            })
        })
    }
}