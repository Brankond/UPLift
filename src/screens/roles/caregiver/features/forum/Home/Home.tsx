import {Text, View, StyleSheet} from "react-native";

import {HomeProps} from "screens/navigation-types";

const Home = ({navigation}: HomeProps) => {
    return (
        <View style={styles.container}>
            <Text>
                Forum Home
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

export {Home}