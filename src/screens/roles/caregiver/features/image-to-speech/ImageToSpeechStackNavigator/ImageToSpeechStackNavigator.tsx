import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {ImageToSpeechStackParamList} from "screens/navigation-types";
import {ImageToSpeechStackNavigatorProps} from "screens/navigation-types";

import {RecipientSelection} from "screens/roles/caregiver/features/image-to-speech/RecipientSelection/RecipientSelection";

const Stack = createNativeStackNavigator<ImageToSpeechStackParamList>()

const ImageToSpeechStackNavigator = ({navigation}: ImageToSpeechStackNavigatorProps) => {
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