// external dependencies
import {useContext, useEffect, useState, useRef} from 'react';
import {
  Pressable,
  View,
  useWindowDimensions,
  Text,
  Image,
  Animated,
} from 'react-native';
import {FlatList} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';

// internal dependencies
import {GalleryProps} from 'navigators/navigation-types';
import {
  Header,
  SafeAreaContainer,
  HeaderEditToolBar,
  AnimatedDeleteButton,
} from 'components';
import {ThemeContext} from 'contexts';
import {
  selectSetsByCollectionId,
  manySetsRemoved,
} from 'store/slices/setsSlice';
import {TickSelection} from 'components';
import {CollectionNames, removeDocuments} from 'services/fireStore';
import {removeAssets} from 'services/cloudStorage';

const Gallery = ({navigation, route}: GalleryProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const grid_dimension = (width - 2 * theme.sizes[4]) / 4;
  const collectionId = route.params.collectionId;
  const recipientId = route.params.recipientId;
  const collectionTitle = route.params.collectionTitle;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);

  // animation
  const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;
  const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderEditToolBar
          setIsEditing={setIsEditing}
          itemsNumber={selectedSets.length}
          itemType="Set"
          addButtonOnPress={() => {
            navigation.navigate('Add Set', {
              recipientId: recipientId,
              collectionId: collectionId,
              setId: undefined,
              editType: undefined,
            });
          }}
          nonEditingUiAnimatedVal={nonEditingUiAnimatedVal}
          editingUiAnimatedVal={editingUiAnimatedVal}
        />
      ),
    });
  }, [isEditing, selectedSets.length]);

  // redux
  const dispatch = useDispatch();
  const sets = useSelector(selectSetsByCollectionId(collectionId));

  return (
    <SafeAreaContainer
      child={
        <>
          <Header title={collectionTitle} />
          {sets.length > 0 ? (
            <FlatList
              data={sets}
              numColumns={4}
              renderItem={({item}) => (
                <Pressable
                  key={item.id}
                  style={{
                    width: grid_dimension,
                    height: grid_dimension,
                    padding: 2,
                  }}
                  onPress={
                    isEditing
                      ? () => {
                          if (!selectedSets.includes(item.id)) {
                            setSelectedSets([...selectedSets, item.id]);
                          } else {
                            setSelectedSets(
                              selectedSets.filter(set => set !== item.id),
                            );
                          }
                        }
                      : () => {
                          navigation.navigate('Set', {
                            recipientId,
                            setId: item.id,
                          });
                        }
                  }>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: theme.colors.tintedGrey[300],
                    }}>
                    <Image
                      source={{
                        uri: item.image.url,
                      }}
                      style={{
                        flex: 1,
                      }}
                    />
                  </View>
                  {isEditing && (
                    <TickSelection ticked={selectedSets.includes(item.id)} />
                  )}
                </Pressable>
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
              No Set
            </Text>
          )}

          <AnimatedDeleteButton
            isEditing={isEditing}
            editingUiAnimatedVal={editingUiAnimatedVal}
            onPress={async () => {
              // remove sets from redux
              dispatch(manySetsRemoved(selectedSets));

              // remove sets from firestore
              await removeDocuments(selectedSets, CollectionNames.Sets);

              // remove assets from cloud storage;
              const selectedSetsAssetsCloudStoragePaths: string[] = [];
              for (const setId of selectedSets) {
                const set = sets.find(set => set.id === setId);
                if (set) {
                  selectedSetsAssetsCloudStoragePaths.push(
                    set.image.cloudStoragePath,
                  );
                  selectedSetsAssetsCloudStoragePaths.push(
                    set.audio.cloudStoragePath,
                  );
                }
              }
              await removeAssets(selectedSetsAssetsCloudStoragePaths);

              // restore local state
              setSelectedSets([]);
            }}
          />
        </>
      }
    />
  );
};

export {Gallery};
