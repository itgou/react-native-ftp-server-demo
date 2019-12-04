import React from 'react'
import {
    View,
    Text,
    StyleSheet,
} from 'react-native'
import {
    BACK_GROUND,
    BOTTOM_BORDER_COLOR, IMPORTANT_TEXT_COLOR,
} from "../../config/constant";
import Ionicons from 'react-native-vector-icons/Ionicons'

export default props => {
    const {icon, message, time} = props
    const getBottomLeftIcon = () => (
        <Ionicons
            name={'md-time'}
            size={12}
            color={BACK_GROUND}
        />
    )
    return <>
        <View style={{...styles.baseItem}}>
            <View style={styles.itemLeft}>
                {icon}
            </View>
            <View style={styles.itemRight}>
                <Text>
                    {message}
                </Text>
                <View style={styles.itemRightBottom}>
                    {getBottomLeftIcon()}
                    <Text style={styles.itemTime}>{time}</Text>
                </View>
            </View>
        </View>
    </>
}
const styles = StyleSheet.create({
    baseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: BOTTOM_BORDER_COLOR,
    },
    itemLeft: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemRight: {
        flex: 0.9,
        justifyContent: 'center',
    },
    itemRightBottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTime: {
        fontSize: 14,
        marginLeft: 4,
    },
});
