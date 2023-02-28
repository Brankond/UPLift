// external dependencies
import {useContext, useEffect, useCallback} from 'react';
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
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import TrackPlayer, {
  usePlaybackState,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';

// internal dependencies
import {SetEditType, SetProps} from 'screens/navigation-types';
import {RootState} from 'store';
import {selectSetById} from 'store/slices/setsSlice';
import {ThemeContext} from 'contexts';
import {Divider, PlayButton} from 'components';
import {useFocusEffect} from '@react-navigation/native';

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
  const set_id = route.params.set_id;
  const set = useSelector((state: RootState) => selectSetById(state, set_id));

  // audio effect
  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (set) {
          await TrackPlayer.add({
            url: set.audio_path,
            title: set.audio_title,
            artist: 'N.A.',
          });
        }
      })();
    }, [set]),
  );

  useEffect(() => {
    const reset = navigation.addListener('blur', async () => {
      await TrackPlayer.reset();
    });
    return reset;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: set
        ? set.image_title.charAt(0).toUpperCase() + set.image_title.slice(1)
        : undefined,
    });
  }, []);

  const playerState = usePlaybackState();

  useTrackPlayerEvents([Event.PlaybackQueueEnded], async event => {
    if (event.type === Event.PlaybackQueueEnded) {
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
                recipient_id: undefined,
                collection_id: undefined,
                set_id: set_id,
                editType: SetEditType.Image,
              });
            }}
          />
          <View
            style={{
              width: width,
              height: width,
              backgroundColor: theme.colors.warmGray[100],
            }}>
            <Image
              source={{
                uri: set?.image_path,
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
                recipient_id: undefined,
                collection_id: undefined,
                set_id: set_id,
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
                {set.audio_title}
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
