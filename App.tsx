/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// external dependencies
import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';

// internal dependencies
import {RoleSelection} from 'screens/root-stack/RoleSelection';
import {CaregiverBottomTabNavigator} from 'screens/root-stack/CaregiverBottomTabNavigator';
import {RootStackParamList} from 'screens/navigation-types';
import store from 'store';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
