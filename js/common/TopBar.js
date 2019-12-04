import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {BACK_GROUND} from '../config/constant'

export default class TopBar extends React.Component {
    render() {
        const {leftIcon, rightIcon, params, style} = this.props
        return <View style={{...styles.topBar, ...style}}>
            <View style={styles.topBarLeft}>
                {leftIcon ? leftIcon : null}
            </View>
            <Text style={styles.topBarTitle}>{params.title}</Text>
            <TouchableOpacity
                style={styles.topBarRight}
                onPress={() => {
                    console.log(123)
                }}>
                {rightIcon ? rightIcon : null}
            </TouchableOpacity>
        </View>
    }
}
const styles = StyleSheet.create({
    topBar: {
        backgroundColor: BACK_GROUND,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    topBarLeft: {
        flex: 0.2,
    },
    topBarTitle: {
        flex: 0.6,
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    topBarRight: {
        flex: 0.2,
        alignItems: 'flex-end',
    },
})
