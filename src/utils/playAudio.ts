import TrackPlayer, {State} from 'react-native-track-player';

export const playAudio = async (state: State) => {
  if (state === State.Playing) {
    await TrackPlayer.pause();
  } else if (state === State.Paused || state === State.Ready) {
    console.log('Attempt to play audio');
    await TrackPlayer.play();
  }
};
