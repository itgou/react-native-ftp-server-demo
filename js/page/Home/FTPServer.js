import React, {useEffect, useState} from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    Button,
    PermissionsAndroid,
    NativeModules,
    NativeEventEmitter,
    DeviceEventEmitter,
    Alert,
    AsyncStorage,
} from 'react-native'
import {NetworkInfo} from 'react-native-network-info';
import Toast from "react-native-easy-toast"
import RNFS from 'react-native-fs'
import http from "../../http"
import {sleep} from "../../util"

const underlayColor = "#eee"
const waitTime = 200
const {FTPServerModule} = NativeModules
const eventEmitter = new NativeEventEmitter(FTPServerModule);
export default class FTPServer extends React.Component {

    state = {
        ipAddress: '',
        ftpServerStatus: 'off',
        //log:{type:'1', }
        logList: []
    }

    changeFTPServerStatus = () => {

    }
    goToFileListPage = () => {
        this.props.goPage('FileList')
    }
    requestFileWritePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'write external storage Permission',
                    message: '需要开启读写文件的权限, 才能提供下载和读取功能',
                    buttonNeutral: '稍后开启',
                    buttonNegative: '取消',
                    buttonPositive: '开启',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                try {
                    await sleep(waitTime)
                    let res = await this.checkNeedDownloadFileFromServer()
                    await sleep(waitTime)
                    console.log(res)
                    if (res && res.needDownload === true) {
                        await this.downloadFileFromServer(res.file)
                        await sleep(waitTime)
                        this.startServer()
                    } else {
                        this.startServer()
                    }
                } catch (e) {
                    await sleep(waitTime)
                    this.startServer()
                }
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    checkNeedDownloadFileFromServer = () => {
        // let url = 'http://192.168.101.109:8099/getUpdateInfo'
        let url = ''
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem('updateUrl', (err, updateUrl) => {
                console.log('resUrl', updateUrl)
                if (!err) url = updateUrl
                if (!url) {
                    console.log("no url and start server")
                    resolve(false)
                }
                DeviceEventEmitter.emit('otherEvent', {
                    type: 'otherEvent',
                    message: "检测是否有新文件需要下载",
                })
                http.get(url).then(async res => {
                    console.log('res', res)
                    const {url, name, force} = res.data
                    let needDownload = false
                    if (Number(force) === 1) { //强制下载
                        needDownload = true
                    }
                    let filepath = RNFS.ExternalStorageDirectoryPath + '/ftpServerFileDir/' + name
                    let fileExist = await RNFS.exists(filepath)
                    if (!fileExist) { //不存在同名文件则下载
                        needDownload = true
                    }
                    if (needDownload) {
                        resolve({needDownload, file: {url, name}})
                    } else {
                        DeviceEventEmitter.emit('otherEvent', {
                            type: 'otherEvent',
                            message: "不需要下载新文件",
                        })
                        resolve(false)
                    }
                }).catch(e => {
                    console.log(e)
                    DeviceEventEmitter.emit('otherEvent', {
                        type: 'otherEvent',
                        message: "网络出错,或者地址配置错误,检测失败",
                    })
                    reject(e)
                })
            })
        })
    }

    beginDownload = () => {
        DeviceEventEmitter.emit('otherEvent', {
            type: 'otherEvent',
            message: "开始下载新文件",
        })
    }
    downloadFileFromServer = (file) => {
        DeviceEventEmitter.emit('otherEvent', {
            type: 'otherEvent',
            message: "准备下载新文件",
        })
        let filepath = RNFS.ExternalStorageDirectoryPath + '/ftpServerFileDir/' + file.name
        console.log('filepath:', filepath)
        return new Promise(async (resolve, reject) => {
            try {
                let exist = await RNFS.exists(filepath)
                console.log('exist:', exist)
                if (exist) {
                    let delres = await RNFS.unlink(filepath)
                    console.log(delres)
                }
                let downloadOptions = {
                    fromUrl: file.url,
                    toFile: filepath,
                    begin: this.beginDownload,
                }
                let res = RNFS.downloadFile(downloadOptions)
                res.promise.then(downloadRes => {
                    DeviceEventEmitter.emit('otherEvent', {
                        type: 'otherEvent',
                        message: "下载文件: " + file.name + " 完成. 共" + downloadRes.bytesWritten + "bytes",
                    })
                    resolve(true)
                }).catch(e => {
                    DeviceEventEmitter.emit('otherEvent', {
                        type: 'otherEvent',
                        message: "下载文件: " + file.name + " 出错, 请检查需要下载的文件地址是否正确",
                    })
                    reject()
                })
            } catch (e) {
                reject(e)
                console.log('download err:', e)
            }
        })
    }


    async componentDidMount() {
        try {
            let ipAddress = await NetworkInfo.getIPV4Address()
            this.setState({ipAddress})
            await this.requestFileWritePermission()
        } catch (e) {

        }
    }

    startServer = async () => {
        try {
            let res = await FTPServerModule.startServer()
            console.log('res', res)
            if (res === 1) {
                this.setState({ftpServerStatus: 'on'})
                DeviceEventEmitter.emit('ftpServerStartSuccess')
            }
        } catch (e) {
            this.setState({ftpServerStatus: 'off'})
            DeviceEventEmitter.emit('ftpServerStartFailure')
        }
    }

    reStartServer = async () => {
        try {
            let res = await FTPServerModule.reStartServer()
            console.log('res', res)
            if (res === 1) {
                this.setState({ftpServerStatus: 'on'})
                DeviceEventEmitter.emit('ftpServerRestartSuccess')
            }
        } catch (e) {
            this.setState({ftpServerStatus: 'off'})
            DeviceEventEmitter.emit('ftpServerRestartFailure')
        }
    }

    componentWillUnmount() {
    }

    render() {
        const {ftpServerStatus} = this.state
        const {ipAddress} = this.state
        return <View style={styles.wrapper}>
            <View style={styles.left}>
                <Image
                    style={{width: 100, height: 120}}
                    source={require('../../res/icons/color/ftp_server.png')}
                />
                <Text>本机IP: {ipAddress}</Text>
            </View>
            <View style={styles.right}>
                <View style={styles.ftpStatusBox}>
                    <Image
                        style={{width: 50, height: 50}}
                        source={ftpServerStatus === 'on'
                            ? require('../../res/icons/color/server-on.png')
                            : require('../../res/icons/color/server-off.png')
                        }
                    />
                    <Text>{ftpServerStatus === 'on' ? '运行中' : '已关闭'}</Text>
                </View>
                {
                    ftpServerStatus === 'on'
                        ? <TouchableHighlight onPress={this.reStartServer}
                                              underlayColor={underlayColor}
                                              style={styles.changeStatusBtn}
                                              activeOpacity={0.2}>
                            <Text style={styles.changeStatusBtnText}>
                                重启
                            </Text>
                        </TouchableHighlight>
                        : <TouchableHighlight onPress={this.startServer}
                                              underlayColor={underlayColor}
                                              style={styles.changeStatusBtn}
                                              activeOpacity={0.2}>
                            <Text style={styles.changeStatusBtnText}>
                                启动
                            </Text>
                        </TouchableHighlight>
                }
                <TouchableHighlight onPress={this.goToFileListPage}
                                    underlayColor={'#ddd'}
                                    style={styles.changeStatusBtn}
                                    activeOpacity={0.2}>
                    <Text style={styles.changeStatusBtnText}>
                        查看下载地址
                    </Text>
                </TouchableHighlight>

            </View>
            <Toast ref={toast => this.toast = toast}/>
        </View>
    }


}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        padding: 10,
        height: 160,
    },
    left: {
        flex: 0.5,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 0.4,
        height: 160,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    ftpStatusBox: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    changeStatusBtn: {
        height: 30,
        width: 120,
        borderWidth: 1,
        borderColor: underlayColor,
        borderRadius: 10,

    },
    changeStatusBtnText: {
        textAlign: 'center',
        lineHeight: 30,
    },

})
