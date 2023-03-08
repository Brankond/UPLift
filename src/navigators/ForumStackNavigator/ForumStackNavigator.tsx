import {createStackNavigator} from '@react-navigation/stack';

import {ForumStackParamList} from 'navigators/navigation-types';
import {ForumStackNavigatorProps} from 'navigators/navigation-types';

import {Home} from '../../features/caregiver/forum/Home';

const Stack = createStackNavigator<ForumStackParamList>();

const ForumStackNavigator = ({navigation}: ForumStackNavigatorProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

export {ForumStackNavigator};
