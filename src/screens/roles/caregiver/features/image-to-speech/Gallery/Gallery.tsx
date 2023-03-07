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
import {GalleryProps} from 'screens/navigation-types';
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

const Gallery = ({navigation, route}: GalleryProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const grid_dimension = (width - 2 * theme.sizes[4]) / 4;
  const collection_id = route.params.collection_id;
  const recipient_id = route.params.recipient_id;
  const collection_title = route.params.collection_title;

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
              recipient_id: recipient_id,
              collection_id: collection_id,
              set_id: undefined,
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
  const sets = useSelector(selectSetsByCollectionId(collection_id));

  const deleteSelectedSets = (setsIds: string[]) => {
    dispatch(manySetsRemoved(setsIds));
  };

  return (
    <SafeAreaContainer
      child={
        <>
          <Header title={collection_title} />
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
                          navigation.navigate('Set', {set_id: item.id});
                        }
                  }>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: theme.colors.tintedGrey[300],
                    }}>
                    {item.image_path.length > 0 && (
                      <Image
                        source={{
                          uri: item.image_path,
                        }}
                        style={{
                          flex: 1,
                        }}
                      />
                    )}
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
            onPress={() => {
              deleteSelectedSets(selectedSets);
              setSelectedSets([]);
            }}
          />
        </>
      }
    />
  );
};

export {Gallery};
