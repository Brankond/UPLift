// external dependencies
import {useContext} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {ThemeContext, AuthContext} from 'contexts';
import {RootStackParamList} from 'navigators/navigation-types';
import {Login} from 'features/global/authentication/Login';
import {PhoneLogin} from 'features/global/authentication/PhoneLogin';
import {Signup} from 'features/global/authentication/Signup';
import {RoleSelection} from 'features/global/RoleSelection';
import {CaregiverStackNavigator} from 'navigators/CaregiverStackNavigator';
import {RecipientStackNavigator} from 'navigators/RecipientStackNavigator';
import {useFetchData} from 'hooks/useFetchData';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {user} = useContext(AuthContext);

  useFetchData(user);

  return (
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
            <Stack.Screen name="Role Selection" component={RoleSelection} />
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
            <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
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
  );
};

export {RootNavigator};
