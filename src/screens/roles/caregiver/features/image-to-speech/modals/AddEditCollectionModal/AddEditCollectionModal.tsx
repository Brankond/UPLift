// external dependencies
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import 'react-native-get-random-values';
import {v4} from 'uuid';

// internal dependencies
import {AddCollectionModalProps} from 'screens/navigation-types';
import {SaveButton} from 'components';
import {ThemeContext} from 'contexts';
import {
  collectionAdded,
  collectionUpdated,
  selectCollectionById,
} from 'store/slices/collectionsSlice';
import {
  recipientUpdated,
  selectRecipientById,
} from 'store/slices/recipientsSlice';
import {RootState} from 'store';
import {useHideBottomTab} from 'hooks/useHideBottomTab';
import pickImage from 'utils/pickImage';

const AddEditCollectionModal = ({
  navigation,
  route,
}: AddCollectionModalProps) => {
  const {theme} = useContext(ThemeContext);

  // route params
  const recipient_id = route.params.recipient_id;
  const collection_id = route.params?.collection_id;
  const recipient = useSelector((state: RootState) =>
    selectRecipientById(state, recipient_id),
  );
  const collection = collection_id
    ? useSelector((state: RootState) =>
        selectCollectionById(state, collection_id),
      )
    : undefined;

  // component states
  const [title, setTitle] = useState(collection ? collection.title : '');
  const [cover, setCover] = useState(collection ? collection.cover_image : '');

  // redux
  const dispatch = useDispatch();

  const addEditCollection = (
    title: string,
    recipient_id: string,
    collection_id: string | undefined,
  ) => {
    if (!collection) {
      dispatch(
        collectionAdded({
          id: v4(),
          cover_image: cover,
          recipient_id: recipient_id,
          title: title.length > 0 ? title : 'untitled',
          set_count: 0,
        }),
      );
      dispatch(
        recipientUpdated({
          id: recipient_id,
          changes: {
            collection_count: recipient
              ? recipient.collection_count + 1
              : undefined,
          },
        }),
      );
    } else {
      dispatch(
        collectionUpdated({
          id: collection.id,
          changes: {
            cover_image: cover,
            title: title.length > 0 ? title : 'untitled',
          },
        }),
      );
    }
  };

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: collection ? 'Edit Collection' : 'Add Collection',
      headerRight: () => (
        <SaveButton
          onPress={() => {
            addEditCollection(title, recipient_id, collection_id);
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
          backgroundColor: theme.colors.warmGray[300],
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
        onPress={() => {
          pickImage(setCover);
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
            placeholder="Title"
            keyboardType="default"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export {AddEditCollectionModal};
