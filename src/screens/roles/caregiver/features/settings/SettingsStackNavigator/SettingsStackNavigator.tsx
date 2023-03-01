// external dependencies
import {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SettingsStackParamList} from 'screens/navigation-types';
import {SettingsStackNavigatorProps} from 'screens/navigation-types';
import {Platform} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {MainMenu} from '../MainMenu';
import {AddEditRecipientModal} from '../modals/AddEditRecipientModal';
import {AddEditContactModal} from '../modals/AddEditEmergencyContact';
import {RecipientProfile} from '../RecipientProfile';
import {ThemeContext} from 'contexts';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = ({navigation}: SettingsStackNavigatorProps) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Stack.Navigator
      initialRouteName="Main Menu"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.light[50],
        },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: Platform.OS === 'ios' ? theme.sizes[3] : 0,
        },
        headerBackImage: () => (
          <FeatherIcon
            name="chevron-left"
            color={theme.colors.primary[400]}
            size={theme.sizes[5]}
          />
        ),
        headerTitle: '',
      }}>
      <Stack.Screen name="Recipient Profile" component={RecipientProfile} />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
        }}>
        <Stack.Screen name="Add Recipient" component={AddEditRecipientModal} />
        <Stack.Screen name="Add Contact" component={AddEditContactModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export {SettingsStackNavigator};
