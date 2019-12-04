import React from 'react'
import {
    Alert,
    View,
    StatusBar,
    DeviceEventEmitter,
} from 'react-native'
import TopBar from '../../common/TopBar'
import {
    BACK_GROUND,
} from "../../config/constant";
import NavigationUtil from "../../navigator/NavigationUtil";
import PropTypes from 'prop-types'
import LatestLog from './LatestLog'
import FadeInView from '../../common/FadeInView'
import FTPServer from './FTPServer'

class Home extends React.Component {

    goPage = (url, params) => {
        this.props.navigation.navigate(url, params)
    }

    goBaseDetail = (params) => {
        NavigationUtil.goPage('BaseDetail', params)
    }

    componentDidMount() {

    }
    render() {
        const params = {
            title: 'FTP 服务器'
        }
        return (
            <View style={{alignItems: 'center'}}>
                <StatusBar
                    hidden={false}
                    barStyle={'line-content'}
                    backgroundColor={BACK_GROUND}
                />
                <TopBar params={params}/>
                <FadeInView>
                    <FTPServer ftpServerStatus={'off'} goPage={this.goPage}/>
                    <LatestLog/>
                </FadeInView>
            </View>
        )
    }
}

export default Home

Home.contextTypes = {
    setUnReadAlertNum: PropTypes.func,
}
