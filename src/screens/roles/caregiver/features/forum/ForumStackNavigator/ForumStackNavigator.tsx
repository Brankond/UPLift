import {createStackNavigator} from "@react-navigation/stack";

import {ForumStackParamList} from "screens/navigation-types";
import {ForumStackNavigatorProps} from "screens/navigation-types";

import {Home} from "../Home";

const Stack = createStackNavigator<ForumStackParamList>();

const ForumStackNavigator = ({navigation}: ForumStackNavigatorProps) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen 
                name="Home"
                component={Home}
            />   
        </Stack.Navigator>
    )
}

export {ForumStackNavigator}