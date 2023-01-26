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

import {NativeBaseProvider} from 'native-base';

import {RoleSelection} from 'screens/root-stack/RoleSelection';
import {CaregiverBottomTabNavigator} from 'screens/root-stack/CaregiverBottomTabNavigator';

import {RootStackParamList} from 'screens/navigation-types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName='Role Selection'
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name='Role Selection'
            component={RoleSelection}
          />
          <Stack.Screen
            name='Caregiver'
            component={CaregiverBottomTabNavigator}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
