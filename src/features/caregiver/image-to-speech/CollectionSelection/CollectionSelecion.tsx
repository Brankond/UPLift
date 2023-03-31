// external dependencies
import {useContext, useEffect, useRef, useState, useMemo} from 'react';
import {
  Text,
  View,
  Pressable,
  Animated,
  useWindowDimensions,
  Image,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {Box, FlatList} from 'native-base';
import {createSelector} from '@reduxjs/toolkit';
import {useRoute, useNavigation} from '@react-navigation/native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {CollectionSelectionProps} from 'navigators/navigation-types';
import {useAppSelector, useAppDispatch} from 'hooks';
import {
  Collection,
  selectCollections,
  selectCollectionsByRecipientId,
  manyCollectionsRemoved,
} from 'store/slices/collectionsSlice';
import {
  selectSetsByCollectionId,
  selectSetIdsByCollectionIds,
  manySetsRemoved,
  selectSetsByCollectionIds,
} from 'store/slices/setsSlice';

import {
  Header,
  SafeAreaContainer,
  HeaderEditToolBar,
  AnimatedDeleteButton,
  TickSelection,
} from 'components';
import {CollectionNames, removeDocuments} from 'services/fireStore';
import {removeAssets} from 'services/cloudStorage';

interface CollectionCardProps {
  collection: Collection;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCollections: string[];
  setSelectedCollections: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCollectionsCoverCloudStoragePaths: string[];
  setSelectedCollectionsCoverCloudStoragePaths: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

const CollectionCard = ({
  collection,
  isEditing,
  selectedCollections,
  setSelectedCollections,
  selectedCollectionsCoverCloudStoragePaths,
  setSelectedCollectionsCoverCloudStoragePaths,
}: CollectionCardProps) => {
  // import theme
  const {theme} = useContext(ThemeContext);

  // set grid size
  const {width} = useWindowDimensions();
  const grid_dimension = (width - theme.sizes[12]) / 2;

  // route parameters
  const route = useRoute<CollectionSelectionProps['route']>();
  const navigation = useNavigation<CollectionSelectionProps['navigation']>();
  const recipientId = route.params.recipientId;
  const recipientFirstName = route.params.recipientFirstName;

  // redux data
  const setCount = useAppSelector(
    selectSetsByCollectionId(collection.id),
  ).length;

  // states
  const cover = useMemo(() => collection.cover, [collection]);

  return (
    <Pressable
      key={collection.id}
      style={{
        height: grid_dimension + 26,
        width: grid_dimension,
        marginHorizontal: theme.sizes[1],
        marginBottom: theme.sizes[2],
      }}
      onLongPress={() => {
        navigation.navigate('Add Collection', {
          recipientId: recipientId,
          collectionId: collection.id,
        });
      }}
      onPress={
        isEditing
          ? () => {
              // add item to selected collections array
              if (!selectedCollections.includes(collection.id)) {
                setSelectedCollections([...selectedCollections, collection.id]);
              } else {
                setSelectedCollections(
                  selectedCollections.filter(id => id != collection.id),
                );
              }

              // add item to selected collections cover cloud storage paths array
              if (
                !selectedCollectionsCoverCloudStoragePaths.includes(
                  cover.cloudStoragePath,
                )
              ) {
                setSelectedCollectionsCoverCloudStoragePaths([
                  ...selectedCollections,
                  cover.cloudStoragePath,
                ]);
              }
            }
          : () => {
              navigation.navigate('Gallery', {
                recipientId: recipientId,
                recipientFirstName: recipientFirstName,
                collectionId: collection.id,
                collectionTitle: collection.title,
              });
            }
      }>
      {isEditing && (
        <TickSelection ticked={selectedCollections.includes(collection.id)} />
      )}
      <View
        style={{
          height: grid_dimension,
          width: '100%',
          backgroundColor: theme.colors.tintedGrey[300],
          borderRadius: 16,
          marginBottom: theme.sizes['1.5'],
        }}>
        {cover.url.length > 0 && (
          <Image
            source={{uri: cover.url}}
            style={{
              flex: 1,
              borderRadius: 16,
            }}
          />
        )}
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: theme.fontSizes.sm,
            textTransform: 'capitalize',
          }}>
          {collection.title}
        </Text>
        <Box flexDirection="row" alignItems="center">
          <Text
            style={{
              color: theme.colors.tintedGrey[600],
              marginRight: 2,
            }}>
            {setCount}
          </Text>
          <SimpleLineIcon
            name="arrow-right"
            size={11}
            color={theme.colors.tintedGrey[600]}
          />
        </Box>
      </View>
    </Pressable>
  );
};

const CollectionSelection = ({navigation, route}: CollectionSelectionProps) => {
  // import theme
  const {theme} = useContext(ThemeContext);

  // route parameters
  const recipientId = route.params.recipientId;
  const recipientFirstName = route.params.recipientFirstName;

  // animation
  const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;
  const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;

  // component states
  const initialCollections: string[] = [];
  const [selectedCollections, setSelectedCollections] =
    useState<string[]>(initialCollections);
  const [
    selectedCollectionsCoverCloudStoragePaths,
    setSelectedCollectionsCoverCloudStoragePaths,
  ] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // onload effect
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderEditToolBar
          setIsEditing={setIsEditing}
          itemsNumber={selectedCollections.length}
          itemType="Collection"
          nonEditingUiAnimatedVal={nonEditingUiAnimatedVal}
          editingUiAnimatedVal={editingUiAnimatedVal}
          addButtonOnPress={() => {
            navigation.navigate('Add Collection', {
              recipientId: recipientId,
              collectionId: undefined,
            });
          }}
        />
      ),
    });
  }, [isEditing, selectedCollections]);

  // redux
  const collections = useAppSelector(
    selectCollectionsByRecipientId(recipientId),
  );
  const setIds = useAppSelector(
    selectSetIdsByCollectionIds(selectedCollections),
  );
  const sets = useAppSelector(selectSetsByCollectionIds(selectedCollections));
  const dispatch = useAppDispatch();

  return (
    <SafeAreaContainer
      child={
        <>
          <Header
            title={
              recipientFirstName.slice(-1) == 's'
                ? `${recipientFirstName}' collections`
                : `${recipientFirstName}'s collections`
            }
          />
          {/* body (list display) */}
          {collections.length > 0 ? (
            <FlatList
              data={collections}
              numColumns={2}
              renderItem={({item}) => (
                <CollectionCard
                  collection={item}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  selectedCollections={selectedCollections}
                  setSelectedCollections={setSelectedCollections}
                  selectedCollectionsCoverCloudStoragePaths={
                    selectedCollectionsCoverCloudStoragePaths
                  }
                  setSelectedCollectionsCoverCloudStoragePaths={
                    setSelectedCollectionsCoverCloudStoragePaths
                  }
                />
              )}
            />
          ) : (
            <Text
              style={{
                flex: 1,
                fontSize: theme.sizes[3],
                color: theme.colors.tintedGrey[600],
                textAlign: 'center',
              }}>
              No Collection
            </Text>
          )}

          {/* edition panel */}
          <AnimatedDeleteButton
            isEditing={isEditing}
            editingUiAnimatedVal={editingUiAnimatedVal}
            onPress={async () => {
              // remove collection and corresponding sets from store
              dispatch(manyCollectionsRemoved(selectedCollections));
              dispatch(manySetsRemoved(setIds));

              // remove data from firestore
              await removeDocuments(
                selectedCollections,
                CollectionNames.Categories,
              );
              await removeDocuments(setIds, CollectionNames.Sets);

              // remove data from cloud storage
              // remove cover images
              await removeAssets(selectedCollectionsCoverCloudStoragePaths);

              // remove sets images and audio
              const setsAssetsCloudStoragePaths: string[] = [];
              for (const setId of setIds) {
                const set = sets.find(set => set.id == setId);
                if (set) {
                  const imageCloudStoragePath = set.image.cloudStoragePath;
                  const audioCloudStoragePath = set.audio.cloudStoragePath;
                  setsAssetsCloudStoragePaths.push(imageCloudStoragePath);
                  setsAssetsCloudStoragePaths.push(audioCloudStoragePath);
                }
              }
              await removeAssets(setsAssetsCloudStoragePaths);

              setSelectedCollections([]);
            }}
          />
        </>
      }
    />
  );
};

export {CollectionSelection};
