// external dependencies
import {useContext, useEffect, useState, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  TextInput,
  InteractionManager,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {v4} from 'uuid';
import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

// internal dependencies
import {AddSetModalProps, SetEditType} from 'screens/navigation-types';
import {RootState} from 'store';
import {selectSetById, setAdded, setUpdated} from 'store/slices/setsSlice';
import {ThemeContext} from 'contexts';
import {Divider, SaveButton, PlayButton} from 'components';
import {useHideBottomTab} from 'hooks/useHideBottomTab';
import pickImage from 'utils/pickImage';
import pickDocument from 'utils/pickDocument';
import {trimSuffix} from 'utils/trimSuffix';

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

const AddSetModal = ({navigation, route}: AddSetModalProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const collectionId = route.params.collection_id;
  const recipientId = route.params.recipient_id;
  const setId = route.params.set_id;
  const editType = route.params.editType;

  // redux
  const dispatch = useDispatch();
  const set = setId
    ? useSelector((state: RootState) => selectSetById(state, setId))
    : undefined;

  const addSet = (
    image: string,
    audio: string,
    imageTitle: string,
    audioTitle: string,
    setId?: string,
    collectionId?: string,
    recipientId?: string,
  ) => {
    if (collectionId && recipientId) {
      dispatch(
        setAdded({
          id: v4(),
          collection_id: collectionId,
          recipient_id: recipientId,
          image_title: imageTitle,
          audio_title: audioTitle,
          image_path: image,
          audio_path: audio,
        }),
      );
    } else if (setId) {
      dispatch(
        setUpdated({
          id: setId,
          changes: {
            image_title: imageTitle,
            audio_title: audioTitle,
            image_path: image,
            audio_path: audio,
          },
        }),
      );
    }
  };

  // component state
  const [image, setImage] = useState(set ? set.image_path : '');
  const [audio, setAudio] = useState(set ? set.audio_path : '');
  const [imageTitle, setImageTitle] = useState(set ? set.image_title : '');
  const [audioTitle, setAudioTitle] = useState(set ? set.audio_title : '');

  const playerState = usePlaybackState();

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Set',
      headerRight: () => (
        <SaveButton
          onPress={() => {
            addSet(
              image,
              audio,
              imageTitle,
              audioTitle,
              setId,
              collectionId,
              recipientId,
            );
            navigation.goBack();
          }}
        />
      ),
    });
  }, [image, audio, imageTitle, audioTitle]);

  useHideBottomTab();

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
            url: set.audio_path,
            title: set.audio_title,
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
                const result = await pickImage();
                if (result.canceled) return;
                setImage(result.assets[0].uri);
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
                  onChangeText={setImageTitle}
                  placeholder="Image Title"
                  keyboardType="default"
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
                  onChangeText={setAudioTitle}
                  placeholder="Audio Title"
                  keyboardType="default"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export {AddSetModal};
