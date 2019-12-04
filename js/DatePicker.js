import React from 'react'
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Button, TextInput} from 'react-native'
import {BACK_GROUND, ACTIVATE_COLOR, BOTTOM_BORDER_COLOR} from '../config/constant'
import TopBar from './TopBar'
import NavigationUtil from '../navigator/NavigationUtil'
import AntDesign from 'react-native-vector-icons/AntDesign'
import DateTimePicker from 'react-native-modal-datetime-picker';

export default class DatePicker extends React.Component {
    state = {
        datePickerVisible: false,
        testValue: '',
    }

    render() {
        // const {route} = this.props.navigation.state.params
        // console.log('route:', route)
        const params = {
            title: 'MY',
        }
        const rightIcon = this.getRightIcon()
        return <View>
            <TopBar
                // leftIcon={route.renderLeftButton()}
                params={params}
                // rightIcon={rightIcon}
            />
            {/*{route.renderScene()}*/}
            <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text>Show DatePicker</Text>
            </TouchableOpacity>
            <TextInput
                value={this.state.testValue}
            />
            <DateTimePicker
                isVisible={this.state.datePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
            />
        </View>
    }

    _showDateTimePicker = () => this.setState({datePickerVisible: true});

    _hideDateTimePicker = () => this.setState({datePickerVisible: false});

    _handleDatePicked = (date) => {
        console.log('A date has been picked: ', date);
        this._hideDateTimePicker();
        this.setState({testValue: date.getFullYear()+''})
    };

    getRightIcon() {
        // const {route} = this.props.navigation.state.params
        return <TouchableOpacity
            onPress={() => {
            }}
        >
            <AntDesign
                name={'check'}
                size={20}
                color={'white'}
            />
        </TouchableOpacity>
    }
}

