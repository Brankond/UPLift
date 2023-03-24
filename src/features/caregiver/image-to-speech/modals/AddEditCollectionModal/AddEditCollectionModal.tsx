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
import {useContext, useEffect, useState} from 'react';
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
  const [title, setTitle] = useState(collection ? collection.title : '');
  const [cover, setCover] = useState(collection ? collection.cover : '');

  // redux
  const dispatch = useAppDispatch();

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: collection ? 'Edit Collection' : 'Add Collection',
      headerRight: () => (
        <SaveButton
          onPress={() => {
            if (collection) {
              const update: CollectionUpdate = {
                title,
                cover,
              };
              updateCollection(collectionId as string, update, dispatch);
              updateDocument(
                collectionId as string,
                update,
                CollectionNames.Categories,
              );
            } else {
              const newCollection: Collection = {
                id: v4(),
                recipientId,
                caregiverId: (user as FirebaseAuthTypes.User).uid,
                title,
                cover,
              };
              addCollection(newCollection, dispatch);
              addDocument(newCollection, CollectionNames.Categories);
            }
            navigation.goBack();
          }}
        />
      ),
    });
  });

  useHideBottomTab();

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
        {cover.length > 0 && (
          <Image
            source={{uri: cover}}
            style={{
              flex: 1,
              borderRadius: theme.sizes[6],
            }}
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
            setCover(result);
          }
        }}>
        <Text
          style={{
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400],
          }}>
          {cover.length > 0 ? 'Change Cover' : 'Add Cover'}
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
