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
import {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {Platform} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {Login} from 'screens/root-stack/Authentication/Login';
import {Signup} from 'screens/root-stack/Authentication/Signup';
import {RoleSelection} from 'screens/root-stack/RoleSelection';
import {CaregiverStackNavigator} from 'screens/root-stack/CaregiverStackNavigator';
import {RootStackParamList} from 'screens/navigation-types';
import {ThemeContext, theme} from 'contexts';
import store from 'store';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // setup trackplayer
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
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
                headerLeftContainerStyle: {
                  paddingLeft: Platform.OS === 'ios' ? 20 : 0,
                },
                headerBackImage: () => (
                  <FeatherIcon
                    name="chevron-left"
                    color={theme.colors.primary[400]}
                    size={theme.sizes[5]}
                  />
                ),
              }}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                  headerShown: true,
                  headerShadowVisible: false,
                  headerStyle: {
                    backgroundColor: theme.colors.light[50],
                  },
                  title: '',
                  headerBackTitleVisible: false,
                }}
              />
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
