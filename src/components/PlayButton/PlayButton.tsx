// external dependencies
import TrackPlayer, {State} from 'react-native-track-player';
import {Pressable} from 'react-native';
import {useContext} from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from 'contexts';
import {playAudio} from 'utils/playAudio';

const PlayButton = ({state}: {state: State}) => {
  const {theme} = useContext(ThemeContext);
  const isPlaying = state === State.Playing;

  return (
    <Pressable
      style={{
        backgroundColor: theme.colors.light[50],
        height: theme.sizes[12],
        width: theme.sizes[12],
        borderRadius: theme.sizes[6],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.sizes[4],
      }}
      onPress={() => {
        playAudio(state);
      }}>
      {(isPlaying && (
        <MaterialIcon
          name="pause"
          color={theme.colors.primary[400]}
          size={theme.sizes[6]}
        />
      )) ||
        (!isPlaying && (
          <MaterialIcon
            name="play-arrow"
            color={theme.colors.primary[400]}
            size={theme.sizes[6]}
          />
        ))}
    </Pressable>
  );
};

export {PlayButton};
