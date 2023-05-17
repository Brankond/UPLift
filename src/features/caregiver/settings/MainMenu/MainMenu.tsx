// external dependencies
import {useContext, useEffect, useCallback, useState, useRef} from 'react';
import {Animated, FlatList, Text} from 'react-native';
import {useAppDispatch, useAppSelector} from 'hooks';
import {useNavigation} from '@react-navigation/native';

// internal dependencies
import {AppDispatch} from 'store';
import {
  MainMenuProps,
  CaregiverBottomTabNavigatorProps,
} from 'navigators/navigation-types';
import {
  Recipient,
  selectRecipients,
  manyRecipientsRemoved,
} from 'store/slices/recipientsSlice';
import {
  selectCollectionIdsByRecipientIds,
  manyCollectionsRemoved,
  selectCollectionsByRecipientIds,
} from 'store/slices/collectionsSlice';
import {
  selectSetIdsByRecipientIds,
  manySetsRemoved,
  selectSetsByRecipientIds,
} from 'store/slices/setsSlice';
import {
  selectContactIdsByRecipientIds,
  manyContactsRemoved,
} from 'store/slices/emergencyContactsSlice';
import {CollectionNames, removeDocuments} from 'services/fireStore';
import {ThemeContext} from 'contexts';
import {
  HeaderEditToolBar,
  Header,
  SwipeableRow,
  SafeAreaContainer,
  TickSelection,
  AnimatedDeleteButton,
} from 'components';
import {removeAssets} from 'services/cloudStorage';

/* handlers */
const headerAddButtonOnPress = (
  navigation: CaregiverBottomTabNavigatorProps['navigation'],
) => {
  navigation.navigate('Settings', {
    screen: 'Add Recipient',
  });
};

const nonEditingSwipeableRowItemOnPress = (
  navigation: CaregiverBottomTabNavigatorProps['navigation'],
  recipient_id: string,
) => {
  navigation.navigate('Settings', {
    screen: 'Recipient Profile',
    params: {recipientId: recipient_id},
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

const deleteRecipients = async (
  dispatch: AppDispatch,
  recipients: string[],
  collections: string[],
  sets: string[],
  contacts: string[],
) => {
  // remove data from store
  dispatch(manySetsRemoved(sets));
  dispatch(manyCollectionsRemoved(collections));
  dispatch(manyContactsRemoved(contacts));
  dispatch(manyRecipientsRemoved(recipients));

  // remove data from firestore
  await removeDocuments(sets, CollectionNames.Sets);
  await removeDocuments(collections, CollectionNames.Categories);
  await removeDocuments(contacts, CollectionNames.Contacts);
  await removeDocuments(recipients, CollectionNames.Recipients);
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
  return recipients.length > 0 ? (
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
                borderColor: theme.colors.tintedGrey[300],
                transform: [{translateY: -theme.sizes[3]}],
              }}
            />
          }
        />
      )}
    />
  ) : (
    <Text
      style={{
        flex: 1,
        fontSize: theme.sizes[3],
        color: theme.colors.tintedGrey[700],
        textAlign: 'center',
      }}>
      No Recipient
    </Text>
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
  const collectionIds = useAppSelector(
    selectCollectionIdsByRecipientIds(selectedRecipients),
  );
  const collections = useAppSelector(
    selectCollectionsByRecipientIds(selectedRecipients),
  );
  const setIds = useAppSelector(selectSetIdsByRecipientIds(selectedRecipients));
  const sets = useAppSelector(selectSetsByRecipientIds(selectedRecipients));
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
            onPress={async () => {
              // remove data from firestore
              await removeDocuments(setIds, CollectionNames.Sets);
              await removeDocuments(collectionIds, CollectionNames.Categories);
              await removeDocuments(contacts, CollectionNames.Contacts);
              await removeDocuments(
                selectedRecipients,
                CollectionNames.Recipients,
              );

              // remove data from cloud storage
              const recipientsPhotosCloudStoragePaths: string[] = [];
              for (const recipientId of selectedRecipients) {
                const recipient = recipients.find(
                  recipient => recipient.id === recipientId,
                );
                if (recipient) {
                  recipientsPhotosCloudStoragePaths.push(
                    recipient.photo.cloudStoragePath,
                  );
                }
              }
              await removeAssets(recipientsPhotosCloudStoragePaths);
              const setsAssetsCloudStoragePaths: string[] = [];
              for (const set of sets) {
                setsAssetsCloudStoragePaths.push(set.image.cloudStoragePath);
                setsAssetsCloudStoragePaths.push(set.audio.cloudStoragePath);
              }
              await removeAssets(setsAssetsCloudStoragePaths);
              const collectionsCoversCloudStoragePaths: string[] = [];
              for (const collection of collections) {
                collectionsCoversCloudStoragePaths.push(
                  collection.cover.cloudStoragePath,
                );
              }
              await removeAssets(collectionsCoversCloudStoragePaths);

              // remove data from store
              dispatch(manySetsRemoved(setIds));
              dispatch(manyCollectionsRemoved(collectionIds));
              dispatch(manyContactsRemoved(contacts));
              dispatch(manyRecipientsRemoved(selectedRecipients));

              // restore local states
              setSelectedRecipients([]);
            }}
          />
        </>
      }
    />
  );
};

export {MainMenu};
