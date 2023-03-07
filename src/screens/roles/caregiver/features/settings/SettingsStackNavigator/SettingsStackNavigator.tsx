// external dependencies
import {createContext, useContext, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SettingsStackParamList} from 'screens/navigation-types';
import {SettingsStackNavigatorProps} from 'screens/navigation-types';
import {Platform} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {AddEditRecipientModal} from '../modals/AddEditRecipientModal';
import {AddEditContactModal} from '../modals/AddEditEmergencyContact';
import {RecipientProfile} from '../RecipientProfile';
import {RelationshipSelection} from '../modals/RelationshipSelection';
import {ThemeContext} from 'contexts';

// contexts
type RelationshipContextType = {
  relationship: string;
  setRelationship: React.Dispatch<React.SetStateAction<string>> | undefined;
};

export const RelationshipContext = createContext<RelationshipContextType>({
  relationship: 'NotSet',
  setRelationship: undefined,
});

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator = () => {
  const {theme} = useContext(ThemeContext);

  // share relationship data between 'Add Contact' and 'Select Relationship'
  const [relationship, setRelationship] = useState<string>('NotSet');
  return (
    <RelationshipContext.Provider
      value={{
        relationship,
        setRelationship,
      }}>
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
          headerTitleStyle: {
            color: theme.colors.tintedGrey[900],
          },
          headerTitle: '',
        }}>
        <Stack.Screen name="Recipient Profile" component={RecipientProfile} />
        <Stack.Group
          screenOptions={{
            presentation: 'modal',
          }}>
          <Stack.Screen
            name="Add Recipient"
            component={AddEditRecipientModal}
          />

          <Stack.Screen name="Add Contact" component={AddEditContactModal} />
          <Stack.Screen
            name="Select Relationship"
            component={RelationshipSelection}
          />
        </Stack.Group>
      </Stack.Navigator>
    </RelationshipContext.Provider>
  );
};

export {SettingsStackNavigator};
