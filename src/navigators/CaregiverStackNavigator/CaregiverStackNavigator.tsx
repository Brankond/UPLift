// external dependencies
import {createStackNavigator} from '@react-navigation/stack';

// internal dependencies
import {
  CaregiverStackNavigatorProps,
  CaregiverStackParamList,
} from 'navigators/navigation-types';
import {ImageToSpeechStackNavigator} from 'navigators/ImageToSpeechStackNavigator';
import {ForumStackNavigator} from 'navigators/ForumStackNavigator';
import {SettingsStackNavigator} from 'navigators/SettingsStackNavigator';
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
