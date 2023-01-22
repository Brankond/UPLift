import {Text, View, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

import {ImageToSpeechStackParamList} from "screens/navigation-types";

type Props = NativeStackScreenProps<ImageToSpeechStackParamList, 'Recipient Selection'>

const RecipientSelection = ({navigation}: Props) => {
    return (
        <View style={styles.container}>
            <Text>
                IA Edition
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