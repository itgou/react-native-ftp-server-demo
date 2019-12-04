import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions, DeviceEventEmitter,
    Image,
    NativeEventEmitter, NativeModules, ScrollView, RefreshControl
} from 'react-native'
import {getTime} from "../../util"
import {
    BACK_GROUND,
    BASE_STATUS_COLOR_RED,
    BASE_STATUS_COLOR_YELLOW,
} from "../../config/constant";
import LogItem from './LogItem'

const {FTPServerModule} = NativeModules
const eventEmitter = new NativeEventEmitter(FTPServerModule);

const logTypes = {
    'start': '启动',
    'restart': '重启',
    'stop': '停止',
    'downloadStart': '开始下载',
    'downloadEnd': '下载完成',
}

const {width, height} = Dimensions.get('window')
export default class LatestLog extends React.Component {
    state = {
        logList: []
    }
    getLeftIcon = (type) => {
        let imgSrc
        if (type === 'start') {
            imgSrc = require(`../../res/icons/color/start.png`)
        } else if (type === 'restart') {
            imgSrc = require(`../../res/icons/color/restart.png`)
        } else if (type === 'downloadStart') {
            imgSrc = require(`../../res/icons/color/downloadStart.png`)
        } else if (type === 'downloadEnd') {
            imgSrc = require(`../../res/icons/color/downloadEnd.png`)
        } else if (type ===  'otherEvent'){
            imgSrc = require(`../../res/icons/color/otherEvent.png`)
        }
        return <Image source={imgSrc} style={{width: 20, height: 20}}/>
    }

    addLogToLogList = (log, callback) => {
        this.setState({
            ...this.state,
            logList: [
                ...this.state.logList,
                log
            ]
        }, () => {
            callback()
        })
    }


    componentDidMount() {
        this.ftpServerStartSucess = DeviceEventEmitter.addListener('ftpServerStartSuccess', () => {
            this.addLogToLogList({
                type: 'start',
                message: '启动FTP服务器成功',
                time: getTime(new Date())
            }, this.logListRef.scrollToEnd)
        })
        this.ftpServerStartFailure = DeviceEventEmitter.addListener('ftpServerStartFailure', () => {
            this.addLogToLogList({
                type: 'start',
                message: '启动FTP服务器失败',
                time: getTime(new Date())
            }, this.logListRef.scrollToEnd)
        })
        this.ftpServerRestartSucess = DeviceEventEmitter.addListener('ftpServerRestartSuccess', () => {
            this.addLogToLogList({
                type: 'restart',
                message: '重启FTP服务器成功',
                time: getTime(new Date())
            }, this.logListRef.scrollToEnd)
        })
        this.otherEventListener = DeviceEventEmitter.addListener('otherEvent', (data) => {
            const {type, message} = data
            this.addLogToLogList({
                type,
                message,
                time: getTime(new Date())
            }, this.logListRef.scrollToEnd)
        })
        this.ftpServerRestartFailure = DeviceEventEmitter.addListener('ftpServerRestartFailure', () => {
            this.addLogToLogList({
                type: 'restart',
                message: '重启FTP服务器失败',
                time: getTime(new Date())
            }, this.logListRef.scrollToEnd)
        })

        eventEmitter.addListener('downloadStart', (data) => {
            console.log(data) // "someValue"
            let clientIP = data.originIP
            let reg = /^\/([\d+\.]+):\d+$/
            let regRes = reg.exec(clientIP)
            if (regRes && regRes[1]) clientIP = regRes[1]

            let filename = data.requestLine
            let tmpArr = filename.split(' ')
            if (tmpArr[1]) filename = tmpArr[1]
            let type = data.type
            let log = {
                type,
                message: `${clientIP} 下载 ${filename} 开始`,
                time: getTime(new Date())
            }
            this.addLogToLogList(log, this.logListRef.scrollToEnd)
        })
        eventEmitter.addListener('downloadEnd', (data) => {
            let clientIP = data.originIP
            let reg = /^\/([\d+\.]+):\d+$/
            let regRes = reg.exec(clientIP)
            if (regRes && regRes[1]) clientIP = regRes[1]

            let filename = data.requestLine
            let tmpArr = filename.split(' ')
            if (tmpArr[1]) filename = tmpArr[1]

            let type = data.type
            let log = {
                type,
                message: `${clientIP} 下载 ${filename} 结束`,
                time: getTime(new Date())
            }
            this.addLogToLogList(log, this.logListRef.scrollToEnd)
        })
        eventEmitter.addListener('disconnect', (event) => {
            console.log(event) // "someValue"
        })
        eventEmitter.addListener('login', (data) => {
            console.log("onLogin")
            console.log(data)
            let clientIP = data.originIP
            let reg = /^\/([\d+\.]+):\d+$/
            let regRes = reg.exec(clientIP)
            if (regRes && regRes[1]) clientIP = regRes[1]

            let filename = data.requestLine
            console.log('filename:',filename)
            let tmpArr = filename.split(' ')
            if (tmpArr[1]) filename = tmpArr[1]
            console.log('filename:',filename)

            let type = data.type
            let log = {
                type,
                message: `来自 ${clientIP} 的连接`,
                time: getTime(new Date())
            }
            this.addLogToLogList(log, this.logListRef.scrollToEnd)
        })
        eventEmitter.addListener('disconnect', (event) => {
            console.log(event) // "someValue"
        })
    }


    componentWillUnmount() {
        this.ftpServerRestartFailure.remove()
        this.ftpServerRestartSucess.remove()
        this.ftpServerStartFailure.remove()
        this.ftpServerStartSucess.remove()
        this.otherEventListener.remove()
        eventEmitter.removeAllListeners('downloadStart')
        eventEmitter.removeAllListeners('downloadEnd')
        eventEmitter.removeAllListeners('disconnect')
    }


    render() {
        const {logList} = this.state
        return <>
            <View style={styles.baseListWrapper}>
                <View style={styles.baseListTitleWrapper}>
                    <Text style={styles.baseListTitle}>最新日志</Text>
                </View>
                <ScrollView
                    style={styles.scrollWrapper}
                    scrollEnabled={true}
                    height={height - 326}
                    ref={ref => this.logListRef = ref}
                >
                    {
                        logList && logList.length > 0 && logList.map((log, key) => {
                                return (
                                    <TouchableOpacity
                                        key={key}
                                    >
                                        <LogItem
                                            icon={this.getLeftIcon(log.type)}
                                            message={log.message}
                                            time={log.time}
                                        />
                                    </TouchableOpacity>
                                )
                            }
                        )
                    }
                    {
                        logList && logList.length === 0 &&
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 30}}>
                            <Text>暂无日志</Text>
                        </View>
                    }
                </ScrollView>
            </View>
        </>
    }
}
const styles = StyleSheet.create({
    scrollWrapper: {
        marginBottom: 20,
        paddingBottom: 20,
    },
    baseListWrapper: {
        width: width,
        paddingVertical: 6,
        marginTop: 20,
        marginBottom: 60,
        borderTopColor: BASE_STATUS_COLOR_YELLOW,
        borderTopWidth: 1,
    },
    baseListTitleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    baseListTitle: {
        textAlign: 'left',
        fontSize: 16,
        color: BACK_GROUND,
    },
});

