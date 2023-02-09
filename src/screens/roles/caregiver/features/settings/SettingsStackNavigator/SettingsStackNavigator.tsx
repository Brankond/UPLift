import {createStackNavigator} from "@react-navigation/stack";

import {SettingsStackParamList} from "screens/navigation-types";
import {SettingsStackNavigatorProps} from "screens/navigation-types";

import {MainMenu} from "../MainMenu";

const Stack = createStackNavigator<SettingsStackParamList>();

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