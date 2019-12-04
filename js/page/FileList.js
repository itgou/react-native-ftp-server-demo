import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Button,
    StatusBar,
    FlatList,
    RefreshControl,
    StyleSheet,
    DeviceEventEmitter,
    Dimensions,
    Alert,
} from 'react-native'
import {getTime} from "../util"
import {
    ALERT_TYPE,
    BACK_GROUND,
    BASE_STATUS_COLOR_YELLOW,
    BOTTOM_BORDER_COLOR
} from "../config/constant";
// import {StatusBar} from 'react-navigation'
import Toast from 'react-native-easy-toast'
import RNFS from 'react-native-fs'
import NavigationUtil from "../navigator/NavigationUtil";
import NoData from "../common/NoData";
import BackPressComponent from '../common/BackPressComponent'
import TopBar from "../common/TopBar";
import BaseStationStatusIcon from '../common/BaseStationStatusIcon'
import FadeInView from '../common/FadeInView'
import {NetworkInfo} from "react-native-network-info"

const {width, height} = Dimensions.get('window')

class FileList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activityIndicatorSpinShow: false,
            fileList: [],
            ipAddress: '',
            isLoading: false,
        }
        this.toast = React.createRef()
        this.backPress = new BackPressComponent({backPress: () => this.handleBackPress()})
    }

    handleBackPress() {
        this.onBack()
        return true
    }

    onBack() {
        NavigationUtil.goBack(this.props.navigation)
    }

    getTopBar() {
        const params = {
            title: 'FTP服务器文件列表',
        }
        return <TopBar params={params}/>
    }

    getLeftIcon = item => <BaseStationStatusIcon statusType={item.type}/>

    confirmDeleteFile = file => {
        Alert.alert(
            "操作确认：",
            `确认删除文件 ${file.name} 吗？`,
            [
                {text: '取消', style: 'cancel'},
                {
                    text: '确认删除', onPress: async () => {
                        await this.deleteFile(file)
                    }
                }
            ],
            {cancelable: true}
        )
    }
    deleteFile = async file => {
        let filepath = RNFS.ExternalStorageDirectoryPath + '/ftpServerFileDir/' + file.name
        try {
            await RNFS.unlink(filepath)
            this.toast.show('删除文件成功')
            this.refreshData()
        } catch (e) {
            this.toast.show('删除文件失败')
        }
    }

    _renderItem(data) {
        const {item, index} = data
        return (
            <TouchableOpacity style={styles.itemWrapper} onLongPress={() => this.confirmDeleteFile(item)}>
                <View style={styles.itemLeft}>
                    <Text>{index + 1}</Text>
                </View>
                <View style={styles.itemRight}>
                    <Text>名称: {item.name}</Text>
                    <Text>大小: {item.size} bytes</Text>
                    <Text>下载地址: {item.url}</Text>
                    <Text>更新时间: {getTime(item.mtime)}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    refreshData() {
        const {ipAddress} = this.state
        RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/ftpServerFileDir') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                let fileList = []
                result && result.length > 0 && result.map(item => {
                    if (item.isFile()) {
                        let file = {}
                        file.name = item.name
                        file.mtime = item.mtime
                        file.size = item.size
                        file.url = `ftp://${ipAddress}:2222/${item.name}`
                        fileList.push(file)
                    }
                })
                console.log(fileList)
                this.setState({
                    ...this.state,
                    fileList,
                })
            }).catch().finally(e => {
            this.setState({
                ...this.state,
                isLoading: false
            })
        })
    }


    render() {
        const {fileList, activityIndicatorSpinShow} = this.state
        return <View>
            <StatusBar
                hidden={false}
                barStyle={'line-content'}
                backgroundColor={BACK_GROUND}
            />
            {this.getTopBar()}
            {
                fileList.length > 0 &&
                <FadeInView>
                    <FlatList
                        height={height - 260}
                        data={fileList}
                        renderItem={data => this._renderItem(data)}
                        keyExtractor={item => item.name}
                        refreshControl={
                            <RefreshControl
                                title={'loading'}
                                titleColor={['blue']}
                                refreshing={this.state.isLoading}
                                onRefresh={() => this.refreshData()}
                            />
                        }
                        onEndReachedThreshold={0.1}
                    />
                    <View style={styles.description}>
                        <Text>
                            {
                                `
说明: 下载时请带上用户名amdin,密码admin
例如linux使用命令行执行wget下载: 
wget 下载地址 --ftp-user=admin --ftp-password=admin
                            `
                            }
                        </Text>
                    </View>
                </FadeInView>
            }
            {
                activityIndicatorSpinShow === false && fileList.length < 1 &&
                <NoData
                    refreshData={() => this.refreshData()}
                />
            }
            <Toast ref={toast => this.toast = toast}/>
        </View>
    }

    async componentDidMount() {
        try {
            let ipAddress = await NetworkInfo.getIPV4Address()
            this.setState({ipAddress})
        } catch (e) {

        }
        this.refreshData()
    }


    componentWillUnmount() {
    }
}

export default FileList


const styles = StyleSheet.create({
    itemWrapper: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: BOTTOM_BORDER_COLOR,
        paddingVertical: 10,
    },
    itemLeft: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemRight: {
        flex: 0.9,
        justifyContent: 'space-around',
    },
    description: {
        height: 200,
        borderTopWidth: 1,
        borderTopColor: BACK_GROUND,
        paddingLeft: 10,
    },
})
