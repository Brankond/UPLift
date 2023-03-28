// external dependencies
import {memo, useContext, useState} from 'react';
import {Text, View} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import OctIcon from 'react-native-vector-icons/Octicons';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

// internal dependencies
import {ThemeContext} from 'contexts';
import {
  ActionButton,
  KeyboardDismissSafeAreaView,
  TextField,
  FieldType,
  InputAppearance,
} from 'components';
import Timer from 'utils/Timer';
import {typography} from 'features/global/globalStyles';

const PhoneLogin = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);
  const [number, setNumber] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [confirmationFunc, setConfirmationFunc] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [otp, setOtp] = useState<string>('');

  // timer
  const timer = new Timer(60000, () => {
    setIsSent(false);
    setConfirmationFunc(null);
    console.log('Timer expired');
  });

  return (
    <KeyboardDismissSafeAreaView
      style={[
        {
          paddingHorizontal: 24,
          paddingTop: 32,
        },
      ]}>
      {/* Greeting Text */}
      <Text
        style={[
          typography(theme).lgHeadingText,
          {
            fontSize: 48,
          },
        ]}>
        Hi!
      </Text>
      <Text style={[typography(theme).mdHeadingText]}>Let's login you in</Text>
      {/* Phone / OTP field */}
      <View style={[{marginTop: 32, marginBottom: 24}]}>
        {isSent && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text
              style={[
                typography(theme).lgBodyTextDark,
                {
                  fontSize: 14,
                  marginBottom: 8,
                },
              ]}>
              {`A 6-digit code has been sent to your phone number`}
            </Text>
            <Text
              style={[
                typography(theme).lgBodyTextDark,
                {
                  marginBottom: 12,
                  fontWeight: theme.fontWeights.medium,
                },
              ]}>
              {number}
            </Text>
          </Animated.View>
        )}
        {/* input field */}
        <TextField
          placeholder={isSent ? 'Code' : 'Phone Number'}
          maxLength={isSent ? 6 : 20}
          value={isSent ? otp : number}
          onChangeText={isSent ? setOtp : setNumber}
          fieldType={isSent ? FieldType.OTP : FieldType.Phone}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          icon={
            isSent ? (
              <MaterialIcon
                name="lock"
                color={
                  focusedField === FieldType.OTP
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
              />
            ) : (
              <OctIcon
                name="device-mobile"
                color={
                  focusedField === FieldType.Phone
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
              />
            )
          }
          autoFocus={true}
          appearance={InputAppearance.Round}
        />
      </View>
      {/* Action button */}
      <ActionButton
        text={isSent ? 'Verify & Proceed' : 'Continue'}
        onPress={async () => {
          if (!isSent) {
            setIsSent(true);
            // send verification SMS
            const confirmationFunc = await auth().signInWithPhoneNumber(number);
            setConfirmationFunc(confirmationFunc);

            // start timer
            timer.start();
          } else {
            // verify OTP
            try {
              await confirmationFunc?.confirm(otp);
            } catch {
              console.log('Invalid OTP');
            }
          }
        }}
      />
    </KeyboardDismissSafeAreaView>
  );
});

export {PhoneLogin};
