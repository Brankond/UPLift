import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {SettingsStackParamList} from "screens/navigation-types";
import {SettingsStackNavigatorProps} from "screens/navigation-types";

import {MainMenu} from "../MainMenu";

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = ({navigation}: SettingsStackNavigatorProps) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen
                name="Main Menu"
                component={MainMenu}
            />
        </Stack.Navigator>
    )
}

export {SettingsStackNavigator}