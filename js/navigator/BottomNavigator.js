import React from 'react'
import {createBottomTabNavigator, createAppContainer} from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Home from '../page/Home/Home'
import {ACTIVATE_COLOR} from "../config/constant";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FileList from '../page/FileList'
import Setting from "../page/Setting"

const bottomNavigator = createBottomTabNavigator({
        Home: {
            screen: ({navigation}) => <Home navigation={navigation}/>,
            navigationOptions: {
                tabBarLabel: "首页",
                tabBarIcon: ({tintColor, focused}) =>
                    <Ionicons
                        name={'md-home'}
                        size={20}
                        color={tintColor}
                    />
            }
        },
        FileList: {
            screen: ({navigation}) => <FileList navigation={navigation}/>,
            navigationOptions: {
                tabBarLabel: "文件",
                tabBarIcon: ({tintColor, focused}) =>
                    <MaterialCommunityIcons
                        name={'format-list-bulleted'}
                        size={20}
                        color={tintColor}
                    />
            }
        },
        Setting: {
            screen: ({navigation}) => <Setting navigation={navigation}/>,
            navigationOptions: {
                tabBarLabel: "设置",
                tabBarIcon: ({tintColor, focused}) =>
                    <Ionicons
                        name={'md-settings'}
                        size={20}
                        color={tintColor}
                    />
            }
        },
    },
    {
        tabBarOptions: {
            activeTintColor: ACTIVATE_COLOR,
            labelStyle: {
                fontSize: 13,
            },
        }
    }
)
export default createAppContainer(bottomNavigator)
