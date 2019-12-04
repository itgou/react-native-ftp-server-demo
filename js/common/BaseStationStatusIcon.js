import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {
    BASE_STATUS_COLOR_GREEN,
    BASE_STATUS_COLOR_RED,
    BASE_STATUS_COLOR_YELLOW,
} from "../config/constant";

export default class BaseStationStatusIcon extends React.Component {
    render() {
        const {statusType, size, color} = this.props
        return <>
            {
                statusType === 1 &&
                <MaterialCommunityIcons
                    name={'power-plug-off'}
                    color={color || BASE_STATUS_COLOR_RED}
                    size={size || 30}
                />
            }
            {
                statusType === 2 &&
                <MaterialCommunityIcons
                    name={'power-plug'}
                    color={color || BASE_STATUS_COLOR_GREEN}
                    size={size || 30}
                />
            }
            {
                (statusType === 3 || statusType === 0) &&
                <MaterialCommunityIcons
                    name={'clock-outline'}
                    color={color || BASE_STATUS_COLOR_YELLOW}
                    size={size || 30}
                />
            }
            {
                statusType === 4 &&
                <MaterialCommunityIcons
                    name={'clock-outline'}
                    color={color || BASE_STATUS_COLOR_YELLOW}
                    size={size || 30}
                />
            }
        </>
    }
}
