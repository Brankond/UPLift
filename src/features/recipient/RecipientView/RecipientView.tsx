// external dependencies
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Pressable,
  Image,
  Dimensions,
  Text,
  InteractionManager,
  Modal,
  ModalProps,
  Platform,
} from 'react-native';
import {SvgCss, SvgXml} from 'react-native-svg';
import PagerView from 'react-native-pager-view';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import * as Location from 'expo-location';
import {useAppSelector} from 'hooks';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {RecipientViewProps} from 'navigators/navigation-types';
import {Recipient, selectRecipientById} from 'store/slices/recipientsSlice';
import {
  Collection,
  selectCollectionsByRecipientId,
} from 'store/slices/collectionsSlice';
import {
  selectSetsByCollectionId,
  selectSetById,
  Set,
} from 'store/slices/setsSlice';
import {selectContactsByRecipientId} from 'store/slices/emergencyContactsSlice';
import {AuthContext, ThemeContext} from 'contexts';
import {layout, typography} from 'features/global/globalStyles';
import {ActionButton, FieldType, InputAppearance, TextField} from 'components';
import {ScrollView} from 'react-native-gesture-handler';
import {makePhoneCall} from 'utils/makePhoneCall';
import {getUserLocation} from 'utils/getUserLocation';
import {sendSms} from 'utils/sendSms';

const dangerIconSvg = `<?xml version="1.0" ?><svg fill="#fafaf9" height="24" viewBox="-2 -3 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m12.8 1.613 6.701 11.161c.963 1.603.49 3.712-1.057 4.71a3.213 3.213 0 0 1-1.743.516H3.298C1.477 18 0 16.47 0 14.581c0-.639.173-1.264.498-1.807L7.2 1.613C8.162.01 10.196-.481 11.743.517c.428.276.79.651 1.057 1.096zM10 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0-9a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V6a1 1 0 0 0-1-1z"/></svg>`;

const playButtonIconSvg = `<svg width="192" height="90" viewBox="0 0 192 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M-4.36353 44.7272C96.0001 -98.8755 96.0001 188.33 196.364 44.7272" stroke="#4690FF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
interface RecipientViewContextProps {
  recipientId: string;
  currentCollectionId: string;
  currentSetId: string;
  setCurrentSetId?: React.Dispatch<React.SetStateAction<string>>;
  setCurrentCollectionId?: React.Dispatch<React.SetStateAction<string>>;
}

const RecipientViewContext = createContext<RecipientViewContextProps>({
  recipientId: '',
  currentCollectionId: '',
  currentSetId: '',
});

const CollectionItem = memo(({collection}: {collection: Collection}) => {
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

  const cover = useMemo(() => collection.cover, [collection]);

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
        {cover.url.length > 0 && (
          <Image
            source={{uri: cover.url}}
            style={[
              {
                flex: 1,
                borderRadius: isSelected ? 12 - 1.5 : 12,
              },
            ]}
          />
        )}
      </Pressable>
    )) || <></>
  );
});

const CollectionList = memo(({collections}: {collections: Collection[]}) => {
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

  // ref
  const pagerViewRef = useRef<PagerView>(null);

  useEffect(() => {
    if (sets.length === 0) return;
    setCurrentSetId && setCurrentSetId(sets[0].id);
  }, [collectionId, sets.length]);

  return (
    (setCurrentSetId && (
      <PagerView
        key={sets.toString()}
        ref={pagerViewRef}
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
              source={{uri: set.image.url}}
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
              {set.imageTitle}
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

  // redux
  const set = useAppSelector(state => selectSetById(state, currentSetId));

  // reset player progress upon reaching the end of the queue
  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    if (event.type === Event.PlaybackQueueEnded) {
      TrackPlayer.seekTo(0);
    }
  });

  useFocusEffect(
    useCallback(() => {
      const addTrack = InteractionManager.runAfterInteractions(async () => {
        if (set) {
          await TrackPlayer.add({
            url: set.audio.url,
            title: set.audioTitle,
            artist: 'N.A.',
          });
        }
      });

      return async () => {
        addTrack.cancel();
        await TrackPlayer.reset();
      };
    }, [set]),
  );

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
        <Pressable
          onPress={async () => {
            // play audio
            await TrackPlayer.seekTo(0);
            await TrackPlayer.play();
          }}
          style={[
            layout(theme).centered,
            {
              flex: 1,
              overflow: 'hidden',
            },
          ]}>
          <SvgXml xml={playButtonIconSvg} />
        </Pressable>
      </View>
    </View>
  );
});

const ExitGuardModal = memo(
  ({
    visible,
    setVisible,
    onRequestClose,
    exitCodeValid,
    setExitCodeValid,
  }: ModalProps & {
    exitCodeValid: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setExitCodeValid: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    // context values
    const {theme} = useContext(ThemeContext);
    const {recipientId} = useContext(RecipientViewContext);
    const navigation = useNavigation<RecipientViewProps['navigation']>();

    // states
    const [exitCode, setExitCode] = useState<string>('');
    const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);

    // redux
    const recipient = useAppSelector(state =>
      selectRecipientById(state, recipientId),
    ) as Recipient;

    // useEffects
    useEffect(() => {
      if (exitCodeValid) {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    }, [exitCodeValid]);

    return (
      <Modal
        animationType="fade"
        visible={visible}
        onRequestClose={onRequestClose}>
        <Pressable
          onPress={() => {
            setVisible(false);
          }}
          style={[layout(theme).centered, {paddingHorizontal: 32, flex: 1}]}>
          <TextField
            placeholder={'Enter exit code'}
            value={exitCode}
            onChangeText={setExitCode}
            fieldType={FieldType.Password}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            icon={
              <MaterialIcon
                name="lock"
                color={
                  focusedField === FieldType.OTP
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
              />
            }
            autoFocus={true}
            appearance={InputAppearance.Round}
          />
          <View
            style={[
              {
                marginTop: 16,
                width: '100%',
              },
            ]}>
            <ActionButton
              text="Exit"
              onPress={() => {
                if (exitCode !== recipient.exitCode) {
                  return;
                }
                setExitCodeValid(true);
                setVisible(false);
              }}
            />
          </View>
        </Pressable>
      </Modal>
    );
  },
);

const RecipientView = memo(({navigation, route}: RecipientViewProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // navigation params
  const recipientId = route.params.recipientId;

  // states
  const [currentCollectionId, setCurrentCollectionId] = useState<string>('');
  const [currentSetId, setCurrentSetId] = useState<string>('');
  const [exitGuardModalVisible, setExitGuardModalVisible] =
    useState<boolean>(false);
  const [exitCodeValid, setExitCodeValid] = useState<boolean>(false);
  const [pageHeight, setPageHeight] = useState<number>(0);

  // styles
  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      height: pageHeight,
    },
  });

  // redux
  const recipient = useAppSelector(state =>
    selectRecipientById(state, recipientId),
  ) as Recipient;
  const contacts = useAppSelector(selectContactsByRecipientId(recipientId));
  const collections = useAppSelector(
    selectCollectionsByRecipientId(recipientId),
  );

  // useEffect
  // set initial collection
  useEffect(() => {
    if (collections.length > 0) setCurrentCollectionId(collections[0].id);
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (exitCodeValid) {
          console.log('exit code valid');
          return;
        }
        console.log('exit code invalid');
        e.preventDefault();
        setExitGuardModalVisible(true);
      }),
    [navigation, exitCodeValid],
  );

  return (
    <RecipientViewContext.Provider
      value={{
        recipientId,
        currentCollectionId,
        currentSetId,
        setCurrentCollectionId,
        setCurrentSetId,
      }}>
      <ScrollView
        pagingEnabled
        style={[{flex: 1}]}
        onLayout={e => setPageHeight(e.nativeEvent.layout.height)}>
        <View
          style={[
            styles.pageContainer,
            {paddingTop: Platform.OS === 'ios' ? 48 : 0},
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
          <ExitGuardModal
            visible={exitGuardModalVisible}
            setVisible={setExitGuardModalVisible}
            exitCodeValid={exitCodeValid}
            setExitCodeValid={setExitCodeValid}
          />
        </View>
        <View
          style={[
            styles.pageContainer,
            {backgroundColor: theme.colors.red[50]},
          ]}>
          <View style={[layout(theme).centered, {flex: 1}]}>
            <Pressable
              onPress={async () => {
                const contact = contacts[0];
                const location = await getUserLocation();
                // await makePhoneCall(contact.contactNumbers[0]);
                await sendSms(
                  contact.contactNumbers[0],
                  recipient.firstName,
                  recipient.lastName,
                  contact.firstName,
                  contact.lastName,
                  JSON.stringify(location),
                );
              }}
              style={[
                layout(theme).centered,
                {
                  backgroundColor: theme.colors.red[500],
                  width: 240,
                  height: 240,
                  borderRadius: 240 / 2,
                  shadowColor: theme.colors.red[600],
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.4,
                  shadowRadius: 25,
                  elevation: 10,
                },
              ]}>
              <SvgCss xml={dangerIconSvg} height={'60%'} width={'60%'} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </RecipientViewContext.Provider>
  );
});

export {RecipientView};
