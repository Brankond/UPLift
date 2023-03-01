// external dependencies
import {createStackNavigator} from '@react-navigation/stack';

// internal dependencies
import {
  CaregiverStackNavigatorProps,
  CaregiverStackParamList,
} from 'screens/navigation-types';
import {ImageToSpeechStackNavigator} from 'screens/roles/caregiver/features/image-to-speech/ImageToSpeechStackNavigator';
import {ForumStackNavigator} from 'screens/roles/caregiver/features/forum/ForumStackNavigator';
import {SettingsStackNavigator} from 'screens/roles/caregiver/features/settings/SettingsStackNavigator';
import {CaregiverBottomTabNavigator} from '../CaregiverBottomTabNavigator';

const Stack = createStackNavigator<CaregiverStackParamList>();
const CaregiverStackNavigator = ({
  navigation,
}: CaregiverStackNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Caregiver Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Caregiver Home"
        component={CaregiverBottomTabNavigator}
      />
      <Stack.Screen name="Forum" component={ForumStackNavigator} />
      <Stack.Screen
        name="Image to Speech"
        component={ImageToSpeechStackNavigator}
      />
      <Stack.Screen name="Settings" component={SettingsStackNavigator} />
    </Stack.Navigator>
  );
};

export {CaregiverStackNavigator};
