import {Text, View, StyleSheet} from "react-native";

import {MainMenuProps} from "screens/navigation-types";

const MainMenu = ({navigation}: MainMenuProps) => {
    return (
        <View style={styles.container}>
            <Text>
                Main Menu
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export {MainMenu}