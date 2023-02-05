// external dependencies
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useContext} from "react";

// internal dependencies
import {ThemeContext} from "contexts";
import {ImageToSpeechStackParamList} from "screens/navigation-types";
import {ImageToSpeechStackNavigatorProps} from "screens/navigation-types";
import {RecipientSelection} from "../RecipientSelection";
import {CollectionSelection} from "../CollectionSelection";
import {Gallery} from "../Gallery";


const Stack = createNativeStackNavigator<ImageToSpeechStackParamList>()

const ImageToSpeechStackNavigator = ({navigation}: ImageToSpeechStackNavigatorProps) => {
    const {theme} = useContext(ThemeContext);

    return (
        <Stack.Navigator
            initialRouteName='Recipient Selection'
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.light[50],
                },
                headerShadowVisible: false,
                headerBackTitleVisible: true,
                headerTitle: ''
            }}
        >
            <Stack.Screen 
                name='Recipient Selection'
                component={RecipientSelection}
            />
            <Stack.Screen 
                name="Collection Selection"
                component={CollectionSelection}
            />
            <Stack.Screen 
                name="Gallery"
                component={Gallery}
            />
        </Stack.Navigator>
    )
};

export {ImageToSpeechStackNavigator};