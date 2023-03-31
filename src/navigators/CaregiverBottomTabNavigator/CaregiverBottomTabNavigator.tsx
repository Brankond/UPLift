// external dependencies
import {useContext} from 'react';
import {Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from 'contexts';
import {CaregiverTabParamList} from 'navigators/navigation-types';
import {RecipientSelection} from 'features/caregiver/image-to-speech/RecipientSelection';
import {MainMenu} from 'features/caregiver/settings/MainMenu';
import {Home} from 'features/caregiver/forum/Home';

const Tab = createBottomTabNavigator<CaregiverTabParamList>();

const CaregiverBottomTabNavigator = () => {
  const {theme} = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="Recipient Selection"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          const icons = {
            Home: 'forum',
            'Recipient Selection': 'dashboard-customize',
            'Main Menu': 'settings',
          };
          return (
            <MaterialIcons name={icons[route.name]} color={color} size={size} />
          );
        },
        headerStyle: {
          backgroundColor: theme.colors.light[50],
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary[400],
        tabBarInactiveTintColor: theme.colors.tintedGrey[700],
        headerTitle: '',
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Recipient Selection" component={RecipientSelection} />
      <Tab.Screen name="Main Menu" component={MainMenu} />
    </Tab.Navigator>
  );
};

export {CaregiverBottomTabNavigator};
