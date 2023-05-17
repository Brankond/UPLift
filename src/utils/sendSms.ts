// external dependencies
import {Linking, Platform} from 'react-native';

export const sendSms = async (
  phoneNumber: string,
  recipientFirstName: string,
  recipientLastName: string,
  contactFirstName: string,
  contactLastName: string,
  locationString: string,
) => {
  const message = `[UPlift Emergency Alert]\n\nDear ${contactFirstName} ${contactLastName}, you are receiving this message because you are registered as an emergency contact of ${recipientFirstName} ${recipientLastName}.\n\n${recipientFirstName} ${recipientLastName} is possibly in emergent situation at:\n\n${locationString}.\n\nPlease take actions immediately.`;

  const url = `sms:${phoneNumber}${
    Platform.OS === 'ios' ? '&' : '?'
  }body=${encodeURIComponent(message)}`;

  if (await Linking.canOpenURL(url)) {
    Linking.openURL(url);
  } else {
    console.log('Unable to send SMS.');
  }
};
