// external dependencies
import {useContext, useEffect, useState, useCallback, useMemo} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  TextInput,
  Keyboard,
  InteractionManager,
  Platform,
} from 'react-native';
import {v4} from 'uuid';
import TrackPlayer, {
  Track,
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

// internal dependencies
import {AddSetModalProps, SetEditType} from 'navigators/navigation-types';
import {useAppSelector, useAppDispatch} from 'hooks';
import {
  Set,
  SetUpdate,
  selectSetById,
  setAdded,
  setUpdated,
} from 'store/slices/setsSlice';
import {ThemeContext, AuthContext} from 'contexts';
import {Divider, SaveButton, PlayButton} from 'components';
import {dimensions} from 'features/global/globalStyles';
import pickSingleImage from 'utils/pickImage';
import pickDocument from 'utils/pickDocument';
import {trimSuffix} from 'utils/trimSuffix';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {updateDocument, addDocument, CollectionNames} from 'services/fireStore';
import {AppDispatch} from 'store';

const updateStates = async (
  result: {
    type: 'success';
    name: string;
    size?: number | undefined;
    uri: string;
    mimeType?: string | undefined;
    lastModified?: number | undefined;
    file?: any;
    output?: any;
  },
  setAudioTitle: React.Dispatch<React.SetStateAction<string>>,
  setAudio: React.Dispatch<React.SetStateAction<string>>,
): Promise<Track> => {
  setAudioTitle(trimSuffix(result.name));
  setAudio(result.uri);
  const track: Track = {
    url: result.uri,
    title: result.name,
    artist: 'N.A',
  };
  return track;
};

/**
 * Handles creation or update of a set
 */
const addSet = (newSet: Set, dispatch: AppDispatch) => {
  dispatch(setAdded(newSet));
};

const updateSet = (id: string, update: SetUpdate, dispatch: AppDispatch) => {
  dispatch(
    setUpdated({
      id,
      changes: update,
    }),
  );
};

const AddSetModal = ({navigation, route}: AddSetModalProps) => {
  // context values
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const {user} = useContext(AuthContext);

  // route parameters
  const collectionId = route.params.collectionId;
  const recipientId = route.params.recipientId;
  const setId = route.params.setId;
  const editType = route.params.editType;

  // memoized values
  const isUpdate = useMemo(() => {
    if (collectionId && recipientId && !setId && !editType) {
      return false;
    }
    if (!collectionId && !recipientId && setId && editType) {
      return true;
    }
    throw new Error('Invalid route parameters');
  }, [collectionId, recipientId, setId, editType]);

  // redux
  const dispatch = useAppDispatch();
  const set = setId
    ? useAppSelector(state => selectSetById(state, setId))
    : undefined;

  // component state
  const [image, setImage] = useState(set ? set.image : '');
  const [audio, setAudio] = useState(set ? set.audio : '');
  const [imageTitle, setImageTitle] = useState(set ? set.imageTitle : '');
  const [audioTitle, setAudioTitle] = useState(set ? set.audioTitle : '');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const isSaveable = useMemo(() => {
    return image.length > 0 && audio.length > 0 && imageTitle.length > 0;
  }, [image, audio, imageTitle]);

  const playerState = usePlaybackState();

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Set',
      headerRight: () =>
        isEditing ? (
          // 'Done' button
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              setIsEditing(false);
            }}
            style={{
              paddingRight: theme.sizes[4],
            }}>
            <Text
              style={{
                color: theme.colors.primary[400],
                fontWeight: theme.fontWeights.semibold,
              }}>
              Done
            </Text>
          </Pressable>
        ) : (
          <SaveButton
            disabled={!isSaveable}
            onPress={() => {
              if (isUpdate) {
                const update: SetUpdate = {
                  image,
                  audio,
                  imageTitle,
                  audioTitle,
                };
                updateSet(setId as string, update, dispatch);
                updateDocument(setId as string, update, CollectionNames.Sets);
              } else {
                const newSet: Set = {
                  id: v4(),
                  collectionId: collectionId as string,
                  recipientId: recipientId as string,
                  caregiverId: (user as FirebaseAuthTypes.User).uid,
                  image,
                  audio,
                  imageTitle,
                  audioTitle,
                };
                addSet(newSet, dispatch);
                addDocument(newSet, CollectionNames.Sets);
              }
              navigation.goBack();
            }}
          />
        ),
    });
  }, [image, audio, imageTitle, audioTitle, isEditing]);

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
            url: set.audio,
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
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <ScrollView>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}>
          {(editType === undefined || editType === SetEditType.Image) && (
            <View
              style={{
                marginTop: theme.sizes[8],
                alignItems: 'center',
                marginBottom: theme.sizes[8],
              }}>
              <View
                style={{
                  width: width - theme.sizes[7],
                  height: width - theme.sizes[7],
                  backgroundColor: theme.colors.tintedGrey[300],
                  borderRadius: theme.sizes[6],
                }}>
                {image.length > 0 && (
                  <Image
                    source={{uri: image}}
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
                    setImage(result);
                  }
                }}>
                <Text
                  style={{
                    fontSize: theme.sizes[3],
                    color: theme.colors.primary[400],
                  }}>
                  {image.length > 0 ? 'Change Photo' : 'Add Photo'}
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
                    value={imageTitle}
                    placeholderTextColor={theme.colors.tintedGrey[500]}
                    onFocus={() => {
                      setIsEditing(true);
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                      setIsEditing(false);
                    }}
                    onChangeText={setImageTitle}
                    placeholder="Image Title"
                    inputMode="text"
                    style={[
                      Platform.OS === 'android' &&
                        dimensions(theme).androidTextSize,
                    ]}
                  />
                </View>
              </View>
            </View>
          )}
          {editType === undefined && (
            <Divider
              style={{
                opacity: 0.2,
                marginHorizontal: theme.sizes['3.5'],
                marginVertical: 0,
              }}
            />
          )}
          {(editType === undefined || editType === SetEditType.Audio) && (
            <View
              style={{
                marginTop: theme.sizes[8],
                paddingHorizontal: theme.sizes['3.5'],
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  borderRadius: theme.sizes['9'],
                  padding: theme.sizes[3],
                  backgroundColor: theme.colors.primary[400],
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <PlayButton state={playerState} />
                  <Text
                    style={{
                      fontWeight: theme.fontWeights.semibold,
                      color: theme.colors.light[50],
                      textTransform: 'capitalize',
                    }}>
                    {audioTitle.length > 0 ? audioTitle : 'Untitled'}
                  </Text>
                </View>
              </View>
              <Pressable
                style={{
                  marginTop: theme.sizes[3],
                  marginBottom: theme.sizes[6],
                }}
                onPress={async () => {
                  const result = await pickDocument();
                  if (result) {
                    const newTrack = await updateStates(
                      result,
                      setAudioTitle,
                      setAudio,
                    );
                    await TrackPlayer.reset();
                    await TrackPlayer.add(newTrack);
                  }
                }}>
                <Text
                  style={{
                    fontSize: theme.sizes[3],
                    color: theme.colors.primary[400],
                  }}>
                  {audio.length > 0 ? 'Change Audio' : 'Add Audio'}
                </Text>
              </Pressable>
              <View
                style={{
                  width: '100%',
                  marginBottom: theme.sizes[6],
                }}>
                <View
                  style={{
                    paddingVertical: theme.sizes[4],
                    borderRadius: theme.sizes[4],
                    backgroundColor: theme.colors.light[50],
                    paddingHorizontal: theme.sizes[5],
                  }}>
                  <TextInput
                    value={audioTitle}
                    placeholderTextColor={theme.colors.tintedGrey[500]}
                    onFocus={() => {
                      setIsEditing(true);
                    }}
                    onBlur={() => {
                      Keyboard.dismiss();
                      setIsEditing(false);
                    }}
                    onChangeText={setAudioTitle}
                    placeholder="Audio Title"
                    inputMode="text"
                    style={[
                      Platform.OS === 'android' &&
                        dimensions(theme).androidTextSize,
                    ]}
                  />
                </View>
              </View>
            </View>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export {AddSetModal};
