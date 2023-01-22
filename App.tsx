/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {UserTypeSelection} from 'screens/UserTypeSelection';
import {BottomTabNavigator} from 'screens/Navigators';

import {StackParamList} from 'screens/navigation-types';

const Stack = createNativeStackNavigator<StackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Role Selection'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name='Role Selection'
          component={UserTypeSelection}
        />
        <Stack.Screen
          name='Caregiver'
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
