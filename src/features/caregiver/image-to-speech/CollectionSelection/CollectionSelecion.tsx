// external dependencies
import {useContext, useEffect, useRef, useState} from 'react';
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
  manyCollectionsRemoved,
} from 'store/slices/collectionsSlice';
import {
  selectSetsByCollectionId,
  selectSetIdsByCollectionIds,
  manySetsRemoved,
} from 'store/slices/setsSlice';

import {
  Header,
  SafeAreaContainer,
  HeaderEditToolBar,
  AnimatedDeleteButton,
  TickSelection,
} from 'components';

interface CollectionCardProps {
  collection: Collection;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCollections: string[];
  setSelectedCollections: React.Dispatch<React.SetStateAction<string[]>>;
}

const CollectionCard = ({
  collection,
  isEditing,
  selectedCollections,
  setSelectedCollections,
}: CollectionCardProps) => {
  // import theme
  const {theme} = useContext(ThemeContext);

  // set grid size
  const {width} = useWindowDimensions();
  const grid_dimension = (width - theme.sizes[12]) / 2;

  // route parameters
  const route = useRoute<CollectionSelectionProps['route']>();
  const navigation = useNavigation<CollectionSelectionProps['navigation']>();
  const recipient_id = route.params.recipientId;
  const recipient_first_name = route.params.recipientFirstName;

  // redux data
  const setCount = useAppSelector(
    selectSetsByCollectionId(collection.id),
  ).length;

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
          recipientId: recipient_id,
          collectionId: collection.id,
        });
      }}
      onPress={
        isEditing
          ? () => {
              if (!selectedCollections.includes(collection.id)) {
                setSelectedCollections([...selectedCollections, collection.id]);
              } else {
                setSelectedCollections(
                  selectedCollections.filter(id => id != collection.id),
                );
              }
            }
          : () => {
              navigation.navigate('Gallery', {
                recipientId: recipient_id,
                recipientFirstName: recipient_first_name,
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
        {collection.cover.length > 0 && (
          <Image
            source={{uri: collection.cover}}
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
  const recipient_id = route.params.recipientId;
  const recipient_first_name = route.params.recipientFirstName;

  // animation
  const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;
  const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;

  // component states
  const initialCollections: string[] = [];
  const [selectedCollections, setSelectedCollections] =
    useState(initialCollections);
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
              recipientId: recipient_id,
              collectionId: undefined,
            });
          }}
        />
      ),
    });
  }, [isEditing, selectedCollections]);

  // redux data
  const selectCollectionByRecipientId = createSelector(
    selectCollections,
    collections => {
      return collections.filter(collection => {
        return collection.recipientId === recipient_id;
      });
    },
  );

  const collections = useAppSelector(selectCollectionByRecipientId);
  const sets = useAppSelector(selectSetIdsByCollectionIds(selectedCollections));
  const dispatch = useAppDispatch();

  const deleteSelectedCollections = (
    selectedCollectionIds: string[],
    setIds: string[],
  ) => {
    dispatch(manyCollectionsRemoved(selectedCollectionIds));
    dispatch(manySetsRemoved(setIds));
    setSelectedCollections([]);
  };

  return (
    <SafeAreaContainer
      child={
        <>
          <Header
            title={
              recipient_first_name.slice(-1) == 's'
                ? `${recipient_first_name}' collections`
                : `${recipient_first_name}'s collections`
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
            onPress={() => {
              deleteSelectedCollections(selectedCollections, sets);
            }}
          />
        </>
      }
    />
  );
};

export {CollectionSelection};
