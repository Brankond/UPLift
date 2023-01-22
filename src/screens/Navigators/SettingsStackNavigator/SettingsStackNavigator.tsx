import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";

import {ForumStackParamList} from "screens/navigation-types";
import {TabParamList} from "screens/navigation-types";

const Stack = createNativeStackNavigator<ForumStackParamList>();
type Props = BottomTabScreenProps<TabParamList, 'Settings'>

const SettingsStackNavigator = ({navigation}: Props) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            
        </Stack.Navigator>
    )
}

export {SettingsStackNavigator}