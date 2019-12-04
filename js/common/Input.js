import React from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Dimensions,
    TextInput,
    Text,
    View,
} from 'react-native';


export default class Input extends React.PureComponent {
    static propTypes = {
        label: PropTypes.string,
        onChange: PropTypes.func,
        value: PropTypes.string,
        error: PropTypes.array,
    };
    getError = error => {
        if (error) {
            return error.map(info => {
                return (
                    <Text style={styles.errorInfo} key={info}>
                        {info}
                    </Text>
                );
            });
        }
        return null;
    };

    render() {
        const {label, onChange, value, error, keyboardType, textStyle, labelStyle, unit, autoFocus} = this.props;
        console.log('autoFocus', autoFocus)
        return (
            <View style={styles.inputWrapper}>
                <View style={styles.inputBox}>
                    <View
                        style={{...styles.label, ...labelStyle}}
                    >
                        <Text style={styles.labelText}>
                            {`${label}:`}
                        </Text>
                        {
                            unit &&
                            <Text style={styles.labelText}>{`(${unit})`}</Text>
                        }

                    </View>
                    <TextInput
                        style={{...styles.input, ...textStyle}}
                        value={value || ''}
                        duration={150}
                        onChangeText={onChange}
                        keyboardType={keyboardType}
                        autoFocus={autoFocus}
                    />
                </View>
                <View style={styles.errorBox}>
                    <View style={styles.errorLabel}><Text>{null}</Text></View>
                    <View style={styles.errorInfo}><Text>{this.getError(error)}</Text></View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    inputWrapper: {
        height: 50,
    },
    inputBox: {
        flexDirection: 'row',
    },
    label: {
        flex: 0.3,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 40,
        lineHeight: 40,
    },
    labelText: {
        textAlign: 'right',
    },
    input: {
        flex: 0.7,
        height: 40,
        paddingLeft: 10,
        fontSize: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#40a9ff',
    },
    errorBox: {
        flexDirection: 'row',
        height: 12,
        lineHeight: 12,
    },
    errorLabel: {
        flex: 0.3,
    },
    errorInfo: {
        flex: 0.7,
        fontSize: 12,
        color: 'red',
    },
});
