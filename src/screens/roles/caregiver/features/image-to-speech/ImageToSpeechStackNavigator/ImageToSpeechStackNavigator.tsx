// external dependencies
import {createStackNavigator} from '@react-navigation/stack';
import {useContext, useEffect} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Platform} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {ImageToSpeechStackParamList} from 'screens/navigation-types';
import {ImageToSpeechStackNavigatorProps} from 'screens/navigation-types';
import {RecipientSelection} from '../RecipientSelection';
import {CollectionSelection} from '../CollectionSelection';
import {IASet} from '../IASet';
import {AddSetModal} from '../modals/AddSetModal/AddSetModal';
import {AddEditCollectionModal} from '../modals/AddEditCollectionModal';
import {Gallery} from '../Gallery';

const Stack = createStackNavigator<ImageToSpeechStackParamList>();

const ImageToSpeechStackNavigator = ({
  navigation,
  route,
}: ImageToSpeechStackNavigatorProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <Stack.Navigator
      initialRouteName="Recipient Selection"
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
        headerTitleStyle: {
          color: theme.colors.tintedGrey[900],
        },
        headerTitle: '',
      }}>
      <Stack.Screen name="Recipient Selection" component={RecipientSelection} />
      <Stack.Screen
        name="Collection Selection"
        component={CollectionSelection}
      />
      <Stack.Screen name="Gallery" component={Gallery} />
      <Stack.Screen name="Set" component={IASet} />
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
        }}>
        <Stack.Screen
          name="Add Collection"
          component={AddEditCollectionModal}
        />
        <Stack.Screen name="Add Set" component={AddSetModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export {ImageToSpeechStackNavigator};
