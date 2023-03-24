// external dependencies
import 'react-native-gesture-handler';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {Provider} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {NativeBaseProvider} from 'native-base';
import TrackPlayer from 'react-native-track-player';

// internal dependencies
import store from 'store';
import {addCaregiver} from 'services/fireStore';
import {AuthContext, ThemeContext, theme} from 'contexts';
import {AuthContextType} from 'contexts/AuthContext/AuthContext';
import {RootNavigator} from 'navigators/RootNavigator';

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
  useEffect(() => {
    const service = auth().onAuthStateChanged(user => {
      if (user) {
        // handle phone login users
        if (user.phoneNumber) {
          console.log('User set');
          console.log('User Details: ', user);
          setUser(user);
          addCaregiver(user);
          return;
        }

        // handle email login users
        if (user.emailVerified) {
          console.log('User set');
          console.log('User Details: ', user);
          setUser(user);
          addCaregiver(user);
        } else {
          console.log('User email is not verified');
        }
      } else {
        console.log('No user is logged in');
        setUser(null);
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
            <RootNavigator />
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </NativeBaseProvider>
    </Provider>
  );
}

export default App;
