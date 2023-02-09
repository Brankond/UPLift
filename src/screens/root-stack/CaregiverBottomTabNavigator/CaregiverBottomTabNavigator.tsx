// external dependencies
import {useContext} from "react";
import {Platform} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from "contexts";
import {CaregiverTabParamList} from "screens/navigation-types";
import {ImageToSpeechStackNavigator} from "screens/roles/caregiver/features/image-to-speech/ImageToSpeechStackNavigator";
import {ForumStackNavigator} from "screens/roles/caregiver/features/forum/ForumStackNavigator";
import {SettingsStackNavigator} from "screens/roles/caregiver/features/settings/SettingsStackNavigator";

const Tab = createBottomTabNavigator<CaregiverTabParamList>();

const CaregiverBottomTabNavigator = () => {
    const {theme} = useContext(ThemeContext);

    return (
        <Tab.Navigator 
            initialRouteName='Image to Speech'
            screenOptions={
                ({route}) => ({
                    tabBarIcon: ({color, size}) => {
                        const icons =  {
                            'Forum': 'forum',
                            'Image to Speech': 'dashboard-customize',
                            'Settings': 'settings'
                        }

                        return (
                            <MaterialIcons 
                                name={icons[route.name]}
                                color={color}
                                size={size}
                            />
                        )
                    },
                    tabBarStyle: {
                        height: Platform.OS === 'ios' ? 100 : 75
                    },
                    tabBarActiveTintColor: theme.colors.primary[400],
                    tabBarInactiveTintColor: 'grey',
                    headerShown: false,
                    tabBarShowLabel: false
                })
            }
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

export {CaregiverBottomTabNavigator}