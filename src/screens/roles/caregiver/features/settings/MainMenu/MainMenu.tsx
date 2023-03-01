// external dependencies
import {useContext, useEffect, useCallback, useState, useRef} from 'react';
import {Animated, FlatList} from 'react-native';
import {useAppDispatch, useAppSelector} from 'hooks';
import {useNavigation} from '@react-navigation/native';

// internal dependencies
import {AppDispatch} from 'store';
import {
  MainMenuProps,
  CaregiverBottomTabNavigatorProps,
} from 'screens/navigation-types';
import {
  Recipient,
  selectRecipients,
  manyRecipientsRemoved,
} from 'store/slices/recipientsSlice';
import {
  selectCollectionIdsByRecipientIds,
  manyCollectionsRemoved,
} from 'store/slices/collectionsSlice';
import {
  selectSetIdsByRecipientIds,
  manySetsRemoved,
} from 'store/slices/setsSlice';
import {
  selectContactIdsByRecipientIds,
  manyContactsRemoved,
} from 'store/slices/emergencyContactsSlice';
import {ThemeContext} from 'contexts';
import {
  HeaderEditToolBar,
  Header,
  SwipeableRow,
  SafeAreaContainer,
  TickSelection,
  AnimatedDeleteButton,
} from 'components';

/* handlers */
const headerAddButtonOnPress = (
  navigation: CaregiverBottomTabNavigatorProps['navigation'],
) => {
  navigation.navigate('Settings', {
    screen: 'Add Recipient',
    params: {recipient_id: undefined},
  });
};

const nonEditingSwipeableRowItemOnPress = (
  navigation: CaregiverBottomTabNavigatorProps['navigation'],
  recipient_id: string,
) => {
  navigation.navigate('Settings', {
    screen: 'Recipient Profile',
    params: {recipient_id},
  });
};

const editingSwipeableRowItemOnPress = (
  recipientId: string,
  selectedRecipients: string[],
  setSelectedRecipients: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  if (!selectedRecipients.includes(recipientId)) {
    setSelectedRecipients([...selectedRecipients, recipientId]);
  } else {
    setSelectedRecipients(selectedRecipients.filter(id => id !== recipientId));
  }
};

const deleteRecipients = (
  dispatch: AppDispatch,
  recipients: string[],
  collections: string[],
  sets: string[],
  contacts: string[],
) => {
  dispatch(manySetsRemoved(sets));
  dispatch(manyCollectionsRemoved(collections));
  dispatch(manyContactsRemoved(contacts));
  dispatch(manyRecipientsRemoved(recipients));
};
/* end of handlers */
interface RecipientListProps {
  recipients: Recipient[];
  selectedRecipients: string[];
  setSelectedRecipients: React.Dispatch<React.SetStateAction<string[]>>;
  isEditing: boolean;
}

const RecipientList = ({
  recipients,
  selectedRecipients,
  setSelectedRecipients,
  isEditing,
}: RecipientListProps) => {
  const navigation =
    useNavigation<CaregiverBottomTabNavigatorProps['navigation']>();
  const {theme} = useContext(ThemeContext);
  return (
    <FlatList
      data={recipients}
      renderItem={({item}) => (
        <SwipeableRow
          isEditable={true}
          isEditing={isEditing}
          recipient={item}
          onItemPress={
            isEditing
              ? () => {
                  editingSwipeableRowItemOnPress(
                    item.id,
                    selectedRecipients,
                    setSelectedRecipients,
                  );
                }
              : () => {
                  nonEditingSwipeableRowItemOnPress(navigation, item.id);
                }
          }
          tick={
            <TickSelection
              ticked={selectedRecipients.includes(item.id)}
              style={{
                top: '50%',
                borderColor: theme.colors.warmGray[300],
                transform: [{translateY: -theme.sizes[3]}],
              }}
            />
          }
        />
      )}
    />
  );
};

const MainMenu = ({navigation}: MainMenuProps) => {
  const parentNav =
    useNavigation<CaregiverBottomTabNavigatorProps['navigation']>();

  // component states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  // redux
  const dispatch = useAppDispatch();
  const recipients = useAppSelector(selectRecipients);
  const collections = useAppSelector(
    selectCollectionIdsByRecipientIds(selectedRecipients),
  );
  const sets = useAppSelector(selectSetIdsByRecipientIds(selectedRecipients));
  const contacts = useAppSelector(
    selectContactIdsByRecipientIds(selectedRecipients),
  );

  // animation
  const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;
  const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;

  // effects
  useEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <HeaderEditToolBar
            setIsEditing={setIsEditing}
            itemsNumber={selectedRecipients.length}
            itemType="Recipient"
            addButtonOnPress={() => {
              headerAddButtonOnPress(parentNav);
            }}
            nonEditingUiAnimatedVal={nonEditingUiAnimatedVal}
            editingUiAnimatedVal={editingUiAnimatedVal}
          />
        ),
      });
    }, [selectedRecipients, nonEditingUiAnimatedVal, editingUiAnimatedVal]),
  );

  return (
    <SafeAreaContainer
      child={
        <>
          <Header title="Manage Recipients" />
          <RecipientList
            recipients={recipients}
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
            isEditing={isEditing}
          />
          <AnimatedDeleteButton
            isEditing={isEditing}
            editingUiAnimatedVal={editingUiAnimatedVal}
            onPress={() => {
              deleteRecipients(
                dispatch,
                selectedRecipients,
                collections,
                sets,
                contacts,
              );
              setSelectedRecipients([]);
            }}
          />
        </>
      }
    />
  );
};

export {MainMenu};
