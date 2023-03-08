// external dependencies
import {createStackNavigator} from '@react-navigation/stack';
import {useContext, useEffect} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Platform} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {ImageToSpeechStackParamList} from 'navigators/navigation-types';
import {ImageToSpeechStackNavigatorProps} from 'navigators/navigation-types';
import {RecipientSelection} from '../../features/caregiver/image-to-speech/RecipientSelection';
import {CollectionSelection} from '../../features/caregiver/image-to-speech/CollectionSelection';
import {IASet} from '../../features/caregiver/image-to-speech/IASet';
import {AddSetModal} from '../../features/caregiver/image-to-speech/modals/AddSetModal/AddSetModal';
import {AddEditCollectionModal} from '../../features/caregiver/image-to-speech/modals/AddEditCollectionModal';
import {Gallery} from '../../features/caregiver/image-to-speech/Gallery';

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
