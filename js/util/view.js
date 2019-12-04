import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import {BACK_GROUND, BOTTOM_BORDER_COLOR} from '../config/constant'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {BASE_STATUS_COLOR_GREEN, BASE_STATUS_COLOR_RED, BASE_STATUS_COLOR_YELLOW} from '../config/constant'

export const getLoadMoreIndicator = () =>
    <View style={styles.loadMoreIndicatorContainer}>
        <ActivityIndicator style={styles.loadMoreIndicator}/>
        <Text>正在加载更多</Text>
    </View>
export const getTopComponent = (params, leftIcon, rightIcon) =>
    <View style={styles.topComponent}>
        <View style={styles.topComponentLeft}>
            {leftIcon ? leftIcon : null}
        </View>
        <Text style={styles.topComponentTitle}>{params.title}</Text>
        <View style={styles.topComponentRight}>
            {rightIcon ? rightIcon : null}
        </View>
    </View>
export const getLeftIcon = (navigation) => {
    return <TouchableOpacity
        style={styles.leftIconWrapper}
        onPress={() => {
            navigation.goBack()
        }}
    >
        <Feather
            name={'arrow-left'}
            size={20}
            color={'white'}
        />
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    loadMoreIndicator: {
        marginBottom: 4,
    },
    loadMoreIndicatorContainer: {
        margin: 10,
        alignItems: 'center',
        paddingBottom: 30,
    },
    topComponent: {
        flexDirection: 'row',
        backgroundColor: BACK_GROUND,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topComponentLeft: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topComponentTitle: {
        flex: 0.6,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    topComponentRight: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftIconWrapper: {
        padding: 6,
        // borderWidth: 1,
        // borderColor: 'green',
    },
    topActivityIndicator: {
        marginTop: 10,
        // alignSelf: 'center',
        // justifySelf: 'center'
    }
})

