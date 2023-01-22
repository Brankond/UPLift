import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Ioicons from 'react-native-vector-icons/Ionicons'

import {TabParamList} from "screens/navigation-types";

import {ImageToSpeechStackNavigator, ForumStackNavigator, SettingsStackNavigator} from "screens/Navigators";

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName='Image to Speech'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Forum"
                component={ForumStackNavigator}
            />
            <Tab.Screen
                name='Image to Speech'
                component={ImageToSpeechStackNavigator}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsStackNavigator}
            />
        </Tab.Navigator>
    )
}

export {BottomTabNavigator}