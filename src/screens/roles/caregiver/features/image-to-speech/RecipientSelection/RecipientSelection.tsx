import {Text, View, StyleSheet} from "react-native";

import {RecipientSelectionProps} from "screens/navigation-types";

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
    return (
        <View style={styles.container}>
            <Text>
                Recipient Selection
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

export {RecipientSelection}