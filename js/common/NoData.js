import React from 'react'

import {ScrollView, Text, StyleSheet, Dimensions,RefreshControl} from 'react-native'


const {height} = Dimensions.get('window')
export default class NoData extends React.PureComponent {
    state={
        isRefreshing: false,
    }
    render() {
        return <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.props.refreshData()}
                />
            }
            contentContainerStyle={styles.wrapper}>
            <Text>暂无数据</Text>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: height-80,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})