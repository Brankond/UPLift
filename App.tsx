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
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import TrackPlayer from 'react-native-track-player';

// internal dependencies
import {RoleSelection} from 'screens/root-stack/RoleSelection';
import {CaregiverStackNavigator} from 'screens/root-stack/CaregiverStackNavigator';
import {RootStackParamList} from 'screens/navigation-types';
import {ThemeContext, theme} from 'contexts';
import store from 'store';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer();
    })();
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <ThemeContext.Provider value={{theme}}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Role Selection"
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Role Selection" component={RoleSelection} />
              <Stack.Screen
                name="Caregiver"
                component={CaregiverStackNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeContext.Provider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
