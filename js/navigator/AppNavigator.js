import React from 'react'
import {createStackNavigator, createAppContainer} from 'react-navigation'
import AppContainer from '../page/AppContainer'


const appNavigator = createStackNavigator({
        AppContainer: {
            screen: AppContainer,
            navigationOptions: {
                header: null,
            }
        },
    }, {
        initialRouteName: 'AppContainer'
    }
)

export default createAppContainer(appNavigator)
