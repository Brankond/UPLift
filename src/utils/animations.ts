import {Animated} from 'react-native';

export const fadeIn = (value: Animated.Value) => {
  Animated.timing(value, {
    toValue: 1,
    useNativeDriver: true,
    duration: 150,
  }).start();
};

export const fadeOut = (value: Animated.Value) => {
  Animated.timing(value, {
    toValue: 0,
    useNativeDriver: true,
    duration: 150,
  }).start();
};
