import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {ForumStackParamList} from "screens/navigation-types";
import {ForumStackNavigatorProps} from "screens/navigation-types";

import {Home} from "../Home";

const Stack = createNativeStackNavigator<ForumStackParamList>();

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