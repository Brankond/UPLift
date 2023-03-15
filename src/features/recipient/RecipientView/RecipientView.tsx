// external dependencies
import {createContext, memo, useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Pressable,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import PagerView from 'react-native-pager-view';
import {useAppSelector} from 'hooks';

// internal dependencies
import {RecipientViewProps} from 'navigators/navigation-types';
import {
  IACollection,
  selectCollectionsByRecipientId,
} from 'store/slices/collectionsSlice';
import {selectSetsByCollectionId, selectSetById} from 'store/slices/setsSlice';
import {ThemeContext} from 'contexts';
import {layout, typography} from 'features/global/globalStyles';

interface RecipientViewContextProps {
  currentCollectionId: string;
  currentSetId: string;
  setCurrentSetId?: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCollectionId?: React.Dispatch<React.SetStateAction<string>>;
}

const RecipientViewContext = createContext<RecipientViewContextProps>({
  currentCollectionId: '',
  currentSetId: '',
});

const CollectionItem = memo(({collection}: {collection: IACollection}) => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {currentCollectionId, setCurrentCollectionId} =
    useContext(RecipientViewContext);

  // states
  const [isSelected, setIsSelected] = useState<boolean>(false);

  // effects
  // update isSelected flag
  useEffect(() => {
    setIsSelected(currentCollectionId === collection.id);
  }, [currentCollectionId, collection.id]);

  const cover = collection.cover_image;

  return (
    (setCurrentCollectionId && (
      <Pressable
        onPress={() => {
          setCurrentCollectionId(collection.id);
        }}
        style={[
          {
            height: 48,
            width: 48,
            borderRadius: 12,
            backgroundColor: theme.colors.tintedGrey[100],
            borderColor: theme.colors.primary[400],
            borderWidth: isSelected ? 1.5 : 0,
          },
        ]}>
        {cover.length > 0 && (
          <Image
            source={{uri: cover}}
            style={[
              {
                flex: 1,
              },
            ]}
          />
        )}
      </Pressable>
    )) || <></>
  );
});

const CollectionList = memo(({collections}: {collections: IACollection[]}) => {
  return (
    <FlatList
      data={collections}
      renderItem={({item, index}) => (
        <CollectionItem collection={item} key={index} />
      )}
      ItemSeparatorComponent={_ => (
        <View style={[{marginHorizontal: 4, width: 0}]}></View>
      )}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{paddingVertical: 8}]}
    />
  );
});

const SetGallery = memo(({collectionId}: {collectionId: string}) => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {setCurrentSetId} = useContext(RecipientViewContext);

  // dimensions
  const [textHeight, setTextHeight] = useState<number>(0);

  // redux
  const sets = useAppSelector(selectSetsByCollectionId(collectionId));
  return (
    (setCurrentSetId && (
      <PagerView
        style={[
          {
            height: Dimensions.get('window').width - 16 + textHeight + 12,
          },
        ]}
        initialPage={0}
        onPageSelected={event => {
          setCurrentSetId(sets[event.nativeEvent.position].id);
        }}>
        {sets.map((set, index) => (
          <View
            style={[
              {
                height: '100%',
                width: '100%',
              },
            ]}
            key={index}>
            <Image
              source={{uri: set.image_path}}
              style={[
                {
                  height: Dimensions.get('window').width - 16,
                  width: Dimensions.get('window').width - 16,
                  borderRadius: 12,
                },
              ]}
            />
            <Text
              onLayout={event => setTextHeight(event.nativeEvent.layout.height)}
              style={[
                typography(theme).lgHeadingText,
                {
                  textAlign: 'center',
                  textTransform: 'capitalize',
                  marginTop: 12,
                },
              ]}>
              {set.image_title}
            </Text>
          </View>
        ))}
      </PagerView>
    )) || <></>
  );
});

const PlayButton = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {currentSetId} = useContext(RecipientViewContext);

  // svg
  const xml = `<svg width="192" height="90" viewBox="0 0 192 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M-4.36353 44.7272C96.0001 -98.8755 96.0001 188.33 196.364 44.7272" stroke="#4690FF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // redux
  const set = useAppSelector(state => selectSetById(state, currentSetId));

  return (
    <View
      style={[
        layout(theme).centered,
        {
          flex: 1,
        },
      ]}>
      {/* button */}
      <View
        style={[
          {
            width: 192,
            height: 192,
            backgroundColor: theme.colors.light[50],
            borderRadius: 192 / 2,
            shadowColor: theme.colors.tintedGrey[400],
            shadowOffset: {
              width: -2.5,
              height: 5,
            },
            elevation: 10,
            shadowOpacity: 0.4,
            shadowRadius: 8,
          },
        ]}>
        <View
          style={[
            layout(theme).centered,
            {
              flex: 1,
              overflow: 'hidden',
            },
          ]}>
          <SvgXml xml={xml} />
        </View>
        {/* <View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: 'black',
              borderRadius: 192 / 2,
            },
          ]}></View> */}
      </View>
    </View>
  );
});

const RecipientView = memo(({navigation, route}: RecipientViewProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // navigation params
  const recipientId = route.params.recipientId;

  // states
  const [currentCollectionId, setCurrentCollectionId] = useState<string>('');
  const [currentSetId, setCurrentSetId] = useState<string>('');

  // redux
  const collections = useAppSelector(
    selectCollectionsByRecipientId(recipientId),
  );

  // useEffect
  // set initial collection
  useEffect(() => {
    if (collections.length > 0) setCurrentCollectionId(collections[0].id);
  }, []);

  return (
    <RecipientViewContext.Provider
      value={{
        currentCollectionId,
        currentSetId,
        setCurrentCollectionId,
        setCurrentSetId,
      }}>
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor: theme.colors.light[50],
          },
        ]}>
        <View
          style={[
            {
              paddingHorizontal: 8,
            },
          ]}>
          <CollectionList collections={collections} />
          <SetGallery collectionId={currentCollectionId} />
        </View>
        <PlayButton />
      </SafeAreaView>
    </RecipientViewContext.Provider>
  );
});

export {RecipientView};
