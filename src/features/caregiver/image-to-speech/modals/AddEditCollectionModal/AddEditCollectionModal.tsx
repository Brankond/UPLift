// external dependencies
import 'react-native-get-random-values';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import {useContext, useEffect, useMemo, useState} from 'react';
import {v4} from 'uuid';

// internal dependencies
import {AddCollectionModalProps} from 'navigators/navigation-types';
import {SaveButton} from 'components';
import {AuthContext, ThemeContext} from 'contexts';
import {useHideBottomTab} from 'hooks/useHideBottomTab';
import {useAppSelector, useAppDispatch} from 'hooks';
import {
  Collection,
  CollectionUpdate,
  collectionAdded,
  collectionUpdated,
  selectCollectionById,
} from 'store/slices/collectionsSlice';
import {dimensions} from 'features/global/globalStyles';
import pickSingleImage from 'utils/pickImage';
import {AppDispatch} from 'store';
import {CollectionNames, addDocument, updateDocument} from 'services/fireStore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {Asset} from 'utils/types';
import {COVERS_FOLDER, removeAsset, uploadAsset} from 'services/cloudStorage';
import {getFileNameFromLocalUri} from 'utils/getFileNameFromLocalUri';

/**
 * Handles the logic for adding and editing collections
 */
const addCollection = (newCollection: Collection, dispatch: AppDispatch) => {
  dispatch(collectionAdded(newCollection));
};

const updateCollection = (
  id: string,
  update: CollectionUpdate,
  dispatch: AppDispatch,
) => {
  dispatch(collectionUpdated({id, changes: update}));
};

const AddEditCollectionModal = ({
  navigation,
  route,
}: AddCollectionModalProps) => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {user} = useContext(AuthContext);

  // route params
  const recipientId = route.params.recipientId;
  const collectionId = route.params?.collectionId;
  const collection = collectionId
    ? useAppSelector(state => selectCollectionById(state, collectionId))
    : undefined;

  // component states
  const id = useMemo(() => v4(), []);
  const cover = useMemo(() => collection?.cover || undefined, [collection]);
  const [title, setTitle] = useState(collection ? collection.title : '');
  const [coverSource, setCoverSource] = useState(cover ? cover.url : '');
  const isEditSaveable = useMemo(
    () => cover?.url !== coverSource || collection?.title !== title,
    [cover, coverSource, collection, title],
  );

  // redux
  const dispatch = useAppDispatch();

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: collection ? 'Edit Collection' : 'Add Collection',
      headerRight: () => (
        <SaveButton
          disabled={!isEditSaveable}
          onPress={async () => {
            // create a new asset
            const newCover: Asset = {
              cloudStoragePath: '',
              url: '',
              localUri: coverSource,
            };

            // if a cover image is selected, upload it to cloud storage
            if (coverSource.length > 0) {
              // if previous cover image exists, delete it from cloud storage
              if (cover) {
                console.log(newCover);
                await removeAsset(cover.cloudStoragePath);
              }

              // upload the new cover image to cloud storage
              const {url, cloudStoragePath} = await uploadAsset(
                recipientId,
                coverSource,
                COVERS_FOLDER,
                getFileNameFromLocalUri(coverSource),
              );
              newCover.url = url;
              newCover.cloudStoragePath = cloudStoragePath;
            }

            if (collection) {
              // construct the update object
              const update: CollectionUpdate = {
                title,
                cover: newCover,
              };

              // update the collection in the store and firestore
              updateCollection(collectionId as string, update, dispatch);
              updateDocument(
                collectionId as string,
                update,
                CollectionNames.Categories,
              );
            } else {
              // create a new collection
              const newCollection: Collection = {
                id,
                recipientId,
                caregiverId: (user as FirebaseAuthTypes.User).uid,
                title,
                cover: newCover,
              };

              // add the new collection to the store and firestore
              addCollection(newCollection, dispatch);
              addDocument(newCollection, CollectionNames.Categories);
            }
            navigation.goBack();
          }}
        />
      ),
    });
  }, [title, coverSource, collection, id, cover]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <View
        style={{
          height: theme.sizes[40],
          width: theme.sizes[40],
          borderRadius: theme.sizes[6],
          backgroundColor: theme.colors.tintedGrey[300],
          marginTop: theme.sizes[8],
        }}>
        {coverSource.length > 0 && (
          <Image
            source={{uri: coverSource}}
            style={{flex: 1, borderRadius: 24}}
          />
        )}
      </View>
      <Pressable
        style={{
          marginTop: theme.sizes[3],
          marginBottom: theme.sizes[6],
        }}
        onPress={async () => {
          const result = await pickSingleImage();
          if (result) {
            setCoverSource(result);
          }
        }}>
        <Text
          style={{
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400],
          }}>
          {coverSource.length > 0 ? 'Change Cover' : 'Add Cover'}
        </Text>
      </Pressable>
      <View
        style={{
          width: '100%',
          paddingHorizontal: theme.sizes['3.5'],
        }}>
        <View
          style={{
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: theme.sizes[5],
          }}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={theme.colors.tintedGrey[500]}
            placeholder="Title"
            inputMode="text"
            style={[
              Platform.OS === 'android' && dimensions(theme).androidTextSize,
            ]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export {AddEditCollectionModal};
