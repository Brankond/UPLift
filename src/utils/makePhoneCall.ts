// external dependencies
import {Linking, Platform} from 'react-native';

export const makePhoneCall = async (phoneNumber: string) => {
  const url =
    Platform.OS === 'android'
      ? `tel:${phoneNumber}`
      : `telprompt:${phoneNumber}`;

  if (await Linking.canOpenURL(url)) {
    Linking.openURL(url);
  } else {
    console.log(`Unable to call ${phoneNumber}`);
  }
};
