import React from 'react'
import {StyleSheet, Dimensions, DeviceEventEmitter, Alert} from 'react-native'
import Toast from 'react-native-easy-toast'
import Main from "./Main"
import NavigationUtil from '../navigator/NavigationUtil'
import SplashScreen from 'react-native-smart-splash-screen'

const {width} = Dimensions.get('window')
export default class AppContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasGotLoginStatus: false,
            isLogin: false,
            unReadAlertNum: 0,
        }
    }


    componentDidMount() {
        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 350,
            delay: 100,
        })

        this.ftpServerStartSucess = DeviceEventEmitter.addListener('ftpServerStartSuccess', () => {
            this.toast.show('FTP服务器启动成功',3000)
        })
        this.ftpServerStartFailure = DeviceEventEmitter.addListener('ftpServerStartFailure', () => {
            this.toast.show('FTP服务器启动失败',3000)
        })
        this.ftpServerRestartSucess = DeviceEventEmitter.addListener('ftpServerRestartSuccess', () => {
            this.toast.show('FTP服务器重启成功',3000)
        })
        this.ftpServerRestartFailure = DeviceEventEmitter.addListener('ftpServerRestartFailure', () => {
            this.toast.show('FTP服务器重启失败',3000)
        })
    }

    componentWillUnmount() {
        this.ftpServerRestartFailure.remove()
        this.ftpServerRestartSucess.remove()
        this.ftpServerStartFailure.remove()
        this.ftpServerStartSucess.remove()
    }


    render() {
        NavigationUtil.navigation = this.props.navigation
        return <>
            <Main/>
            <Toast ref={toast => this.toast = toast}/>
        </>
    }
}


