// external dependencies
import {createStackNavigator} from '@react-navigation/stack';

// internal dependencies
import {
  RecipientStackNavigatorProps,
  RecipientStackParamList,
} from 'navigators/navigation-types';
import {RecipientVerification} from 'features/recipient/RecipientVerification';
import {RecipientView} from 'features/recipient/RecipientView';

const Stack = createStackNavigator<RecipientStackParamList>();
const RecipientStackNavigator = ({
  navigation,
}: RecipientStackNavigatorProps) => {
  return (
    <Stack.Navigator
      initialRouteName="Recipient Verification"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Recipient Verification"
        component={RecipientVerification}
      />
      <Stack.Screen name="Recipient View" component={RecipientView} />
    </Stack.Navigator>
  );
};

export {RecipientStackNavigator};
