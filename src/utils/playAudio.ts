import TrackPlayer, {State} from 'react-native-track-player';

export const playAudio = (state: State) => {
  if (state === State.Playing) {
    TrackPlayer.pause();
  } else if (state === State.Paused || state === State.Ready) {
    TrackPlayer.play();
  }
};
