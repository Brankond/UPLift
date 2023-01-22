import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {ImageToSpeechStackParamList} from "screens/navigation-types";
import {TabParamList} from "screens/navigation-types";
import {RecipientSelection} from "screens/ImageToSpeech/RecipientSelection/RecipientSelection";

const Stack = createNativeStackNavigator<ImageToSpeechStackParamList>()

type Props = BottomTabScreenProps<TabParamList, 'Image to Speech'>

const ImageToSpeechStackNavigator = ({navigation}: Props) => {
    return (
        <Stack.Navigator
            initialRouteName='Recipient Selection'
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen 
                name='Recipient Selection'
                component={RecipientSelection}
            />
        </Stack.Navigator>
    )
}

export {ImageToSpeechStackNavigator}