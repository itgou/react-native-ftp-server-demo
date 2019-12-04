import React from 'react'
import {
    View,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions,
    DeviceEventEmitter,
    Text,
    AsyncStorage,
} from 'react-native'
import Input from "../common/Input"
import {createForm} from 'rc-form';
import TopBar from "../common/TopBar"
import {IMPORTANT_TEXT_COLOR} from "../config/constant"

const {height} = Dimensions.get('window')

class Setting extends React.Component {
    state={
        updateUrl: '',
    }

    saveUrl = (value) => {
        const testReg = /^https?:\/\/\S+$/
        if (testReg.test(value) !== true) return
        AsyncStorage.setItem('updateUrl', value)
        AsyncStorage.getItem('updateUrl',(err,value)=>{
            console.log('value:',value)
        })
    }

    componentDidMount() {
        AsyncStorage.getItem('updateUrl', (err, updateUrl) => {
            if (!err) {
                console.log('updateUrl from storage',updateUrl)
                this.setState({
                    updateUrl,
                })
            }
        })
    }

    render() {
        const {getFieldDecorator, getFieldError} = this.props.form
        const {updateUrl} = this.state

        return <View>
            <TopBar params={{title: '设置'}}/>
            <View
                style={styles.formContainer}
                height={height - 90}
            >
                {getFieldDecorator('checkUpdateUrl', { //名称

                    validateFirst: true,
                    initialValue: updateUrl || '',
                    rules: [
                        {
                            pattern: /^https?:\/\/\S+$/,
                            message: '保存失败, 请输入正确的url地址'
                        }
                    ],
                })(
                    <Input
                        error={getFieldError('checkUpdateUrl')}
                        label={"检测url"}
                        textStyle={styles.inputStyle}
                        onChange={this.saveUrl}
                    />
                )}
                <Text style={styles.description}>
                    {
`说明1: app启动时会发起get请求,获取该url数据, 根据返回数据决定是否下载文件. url为空时则不检测. 填写正确后自动保存
该url需要返回如下数据格式: 
{
    status: 0,   //必须返回0
    data: {
        url: 'http://xxx.yyy.com/filepath/filename'  //需要下载的文件的静态url地址, 
        name: 'filename', //文件名,须与url字段路径中的filename相同, 如果检测到手机内存放ftp服务器文件的文件夹内已经包含该文件,则认为该文件已经下载过,不会重新下载
        force: '1', //等于1时, 强制下载, 如果检测到手机内存放ftp服务器文件的文件夹内已经包含该文件, 会先删除该文件后重新下载.
    }
}

说明2: 获取到数据后, app会对是否下载进行判断, 如果需要下载, 则对该文件url发起get请求 进行下载.
`
                    }
                </Text>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    inputStyle: {
        color: IMPORTANT_TEXT_COLOR,
    },
    description: {
        marginTop: 20,
    },
});
export default createForm()(Setting)
