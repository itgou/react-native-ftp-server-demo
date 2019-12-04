export default class NavigationUtil {

    static goPage(page, params) {
        const navigation = NavigationUtil.navigation
        console.log("goPage:", page)
        if (!navigation) {
            console.log('NavigationUtil.navigation can not be null')
            return
        }
        navigation.navigate(page, {...params})
    }

    static goBack(navigation) {
        navigation.goBack()
    }
}
