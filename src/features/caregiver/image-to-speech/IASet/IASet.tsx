// external dependencies
import {useContext, useEffect, useCallback, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
} from 'react-native';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

// internal dependencies
import {SetEditType, SetProps} from 'navigators/navigation-types';
import {selectSetById} from 'store/slices/setsSlice';
import {ThemeContext} from 'contexts';
import {Divider, PlayButton} from 'components';
import {useFocusEffect} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from 'hooks';
import {Set} from 'store/slices/setsSlice';

interface SectionHeaderProps {
  title: string;
  onEditButtonPressed: () => void;
}

const SectionHeader = ({title, onEditButtonPressed}: SectionHeaderProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <>
      <Divider
        style={{
          marginVertical: 0,
          marginHorizontal: theme.sizes[4],
          marginBottom: theme.sizes[3],
          backgroundColor: theme.colors.primary[300],
        }}
      />
      <View
        style={{
          paddingHorizontal: theme.sizes[4],
          marginBottom: theme.sizes[4],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontWeight: theme.fontWeights.bold,
            fontSize: theme.sizes[6],
            textTransform: 'capitalize',
            color: theme.colors.primary[400],
          }}>
          {title}
        </Text>
        <Pressable
          onPress={() => {
            onEditButtonPressed();
          }}>
          <Text
            style={{
              fontSize: theme.sizes['3.5'],
              color: theme.colors.primary[400],
            }}>
            Edit
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const IASet = ({navigation, route}: SetProps) => {
  const {width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const recipientId = route.params.recipientId;
  const setId = route.params.setId;
  const set = useAppSelector(state => selectSetById(state, setId));
  const image = useMemo(() => (set as Set).image, [set]);
  const audio = useMemo(() => (set as Set).audio, [set]);

  // audio effect
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (set) {
          console.log('Audio Uri', set.audio);
          const addResult = await TrackPlayer.add({
            url: audio.url,
            title: set.audioTitle,
            artist: 'N.A.',
          });
          console.log('Add track result', addResult);
        }
      })();
    }, [set]),
  );

  useEffect(() => {
    const reset = navigation.addListener('blur', async () => {
      console.log('blur effect executed');
      await TrackPlayer.reset();
    });
    return reset;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (set as Set).imageTitle,
    });
  }, []);

  const playerState = usePlaybackState();

  useEffect(() => {
    console.log(playerState);
  }, [playerState]);

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    if (event.type === Event.PlaybackQueueEnded) {
      console.log('PlaybackQueueEnded');
      TrackPlayer.seekTo(0);
    }
  });

  return set ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.light[50],
      }}>
      <ScrollView>
        <View
          style={{
            marginBottom: theme.sizes[6],
          }}>
          <SectionHeader
            title="image"
            onEditButtonPressed={() => {
              navigation.navigate('Add Set', {
                collectionId: undefined,
                recipientId,
                setId: setId,
                editType: SetEditType.Image,
              });
            }}
          />
          <View
            style={{
              width: width,
              height: width,
              backgroundColor: theme.colors.tintedGrey[100],
            }}>
            <Image
              source={{
                uri: image.url,
              }}
              style={{
                flex: 1,
              }}
            />
          </View>
        </View>
        <View>
          <SectionHeader
            title="audio"
            onEditButtonPressed={() => {
              navigation.navigate('Add Set', {
                collectionId: undefined,
                recipientId,
                setId: setId,
                editType: SetEditType.Audio,
              });
            }}
          />
          <View
            style={{
              padding: theme.sizes[4],
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
                {set.audioTitle}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <></>
  );
};

export {IASet};
