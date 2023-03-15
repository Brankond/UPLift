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
import {useState, useEffect, useMemo} from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Platform} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import TrackPlayer from 'react-native-track-player';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import store from 'store';
import {AuthContext, ThemeContext, theme} from 'contexts';
import {AuthContextType} from 'contexts/AuthContext/AuthContext';
import {Login} from 'features/global/authentication/Login';
import {Signup} from 'features/global/authentication/Signup';
import {RoleSelection} from 'features/global/RoleSelection';
import {CaregiverStackNavigator} from 'navigators/CaregiverStackNavigator';
import {RootStackParamList} from 'navigators/navigation-types';
import {RecipientStackNavigator} from 'navigators/RecipientStackNavigator';

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  /**
   * states
   */
  // authentication states
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  /**
   * effects
   */
  // listen for user state change
  // for dev: signout everytime app opens
  // useEffect(() => {
  //   auth().signOut();
  // }, []);
  useEffect(() => {
    const service = auth().onAuthStateChanged(user => {
      if (user) {
        if (user.emailVerified) {
          console.log('User set');
          console.log('User Details: ', user);
          setUser(user);
        } else {
          console.log('User email is not verified');
        }
      } else {
        console.log('No user is logged in');
      }
    });
    return service;
  }, []);
  // setup trackplayer
  useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer();
    })();
  }, []);

  // initialize authentication context
  const authContext: AuthContextType = useMemo<AuthContextType>(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <AuthContext.Provider value={authContext}>
          <ThemeContext.Provider value={{theme}}>
            <NavigationContainer>
              <Stack.Navigator
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
                {user ? (
                  <>
                    <Stack.Screen
                      name="Role Selection"
                      component={RoleSelection}
                    />
                    <Stack.Screen
                      name="Caregiver"
                      component={CaregiverStackNavigator}
                    />
                    <Stack.Screen
                      name="Recipient"
                      component={RecipientStackNavigator}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;
