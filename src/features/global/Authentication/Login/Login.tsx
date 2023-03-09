// external dependencies
import {useContext, useState, memo, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import OctIcon from 'react-native-vector-icons/Octicons';
import ReactNativeBiometrics, {BiometryType} from 'react-native-biometrics';
import {useNavigation} from '@react-navigation/native';

// internal dependencies
import {LoginProps} from 'navigators/navigation-types';
import {ThemeContext} from 'contexts';
import {generalStyles, fieldStyles} from '../authStyles';
import {
  ActionButton,
  Appearance,
} from '../../../../components/ActionButton/ActionButton';
import {
  TextField,
  FieldType,
  InputAppearance,
} from '../../../../components/TextField/TextField';
import {TextDivider} from '../../../../components/TextDivider/TextDivider';
import {ExternalLogin} from '../components/ExternalLogin';

// login method enum
enum LoginMethod {
  Credentials,
  OTP,
}

// biometrics login
const iosFaceIDPrompt = async (bio: ReactNativeBiometrics) => {
  const result = await bio.simplePrompt({
    promptMessage: 'Login with Face ID',
  });

  const {success, error} = result;
  if (error) {
    Alert.alert('Face ID Login Failed', `Error: ${error}`);
    return;
  }
};

const BiometricsLogin = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  // biometrics
  const biometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  const [bioType, setBioType] = useState<BiometryType | undefined>(undefined);

  // check available biometrics types
  useEffect(() => {
    (async () => {
      const {available, biometryType, error} =
        await biometrics.isSensorAvailable();

      if (!available) {
        setBioType(undefined);
        return;
      }
      setBioType(biometryType);
    })();
  }, []);

  return (
    <View>
      <TextDivider text="Biometrics" width="100%" />
      <View
        style={[
          {
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        {bioType === 'FaceID' && (
          <Pressable onPress={() => iosFaceIDPrompt(biometrics)}>
            <MaterialComIcon
              name="face-recognition"
              color={theme.colors.primary[400]}
              size={42}
            />
          </Pressable>
        )}
        {bioType === 'TouchID' && (
          <MaterialIcon
            name="fingerprint"
            color={theme.colors.primary[400]}
            size={48}
            style={{marginLeft: 24}}
          />
        )}
      </View>
    </View>
  );
});

// username login form
const EmailLoginForm = memo(() => {
  // navigation
  const navigation = useNavigation<LoginProps['navigation']>();

  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.Email);

  return (
    <>
      {/* email */}
      <View style={[{marginBottom: 20}]}>
        <Text
          style={[
            generalStyles(theme).text,
            {
              marginBottom: 8,
            },
            fieldStyles(theme, focusedField === FieldType.Email).fieldText,
          ]}>
          Email
        </Text>
        <TextField
          placeHolder="Enter Email"
          value={email}
          setValue={setEmail}
          fieldType={FieldType.Email}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          icon={
            <MaterialIcon
              name="account-circle"
              color={
                focusedField === FieldType.Email
                  ? theme.colors.primary[400]
                  : theme.colors.tintedGrey[700]
              }
              size={18}
              style={[
                {
                  marginHorizontal: 8,
                },
              ]}
            />
          }
          autoFocus={true}
        />
      </View>
      {/* password */}
      <View style={[{marginBottom: 36}]}>
        <View
          style={[
            generalStyles(theme).row,
            {
              marginBottom: 8,
              alignItems: 'flex-end',
            },
          ]}>
          <Pressable>
            <Text
              style={[
                generalStyles(theme).text,
                fieldStyles(theme, focusedField === FieldType.Password)
                  .fieldText,
              ]}>
              Password
            </Text>
          </Pressable>
          <Text
            style={[
              generalStyles(theme).text,
              {
                fontSize: 14,
                textDecorationLine: 'underline',
              },
              fieldStyles(theme, focusedField === FieldType.Password).fieldText,
            ]}>
            Forget Password?
          </Text>
        </View>
        <TextField
          placeHolder="Enter Password"
          value={password}
          setValue={setPassword}
          fieldType={FieldType.Password}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          secureEntry={!passwordShown}
          icon={
            <Pressable onPress={() => setPasswordShown(!passwordShown)}>
              <FeatherIcon
                name={passwordShown ? 'eye' : 'eye-off'}
                color={
                  focusedField === FieldType.Password
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
                style={[
                  {
                    marginHorizontal: 8,
                  },
                ]}
              />
            </Pressable>
          }
        />
      </View>
      {/* loginButton */}
      <View style={[{marginBottom: 16}]}>
        <ActionButton
          text="Login"
          onPress={() => {
            navigation.navigate('Role Selection');
          }}
        />
      </View>
      {/* signup */}
      <View
        style={[
          generalStyles(theme).row,
          {
            justifyContent: 'center',
            marginBottom: 48,
          },
        ]}>
        <Text
          style={[
            generalStyles(theme).text,
            {
              fontSize: 14,
              fontWeight: theme.fontWeights.semibold,
              marginRight: 8,
            },
          ]}>
          Don't have an account?
        </Text>
        <Pressable
          onPress={() => {
            // navigate to signUp page
            navigation.navigate('Signup');
          }}>
          <Text
            style={[
              generalStyles(theme).text,
              {
                fontSize: 14,
                fontWeight: theme.fontWeights.semibold,
                marginRight: 8,
                textDecorationLine: 'underline',
              },
            ]}>
            Sign up
          </Text>
        </Pressable>
      </View>
      {/* external login */}
      <ExternalLogin />
    </>
  );
});

// OTP login form
const OTPLoginForm = memo(() => {
  // navigation
  const navigation = useNavigation<LoginProps['navigation']>();

  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);
  const [number, setNumber] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  return (
    <>
      {/* Phone / OTP field */}
      <View style={[{marginBottom: 36}]}>
        {isSent && (
          <>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  fontSize: 14,
                  marginBottom: 8,
                },
              ]}>
              {`A 6-digit code has been sent to your phone number`}
            </Text>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  marginBottom: 12,
                  fontWeight: theme.fontWeights.medium,
                },
              ]}>
              {number}
            </Text>
          </>
        )}
        {/* input field */}
        <TextField
          placeHolder={isSent ? 'Code' : 'Phone Number'}
          maxLength={isSent ? 6 : 20}
          value={isSent ? otp : number}
          setValue={isSent ? setOtp : setNumber}
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
        {/* info */}
        {!isSent && (
          <Text
            style={[
              generalStyles(theme).text,
              {
                fontSize: 12,
                paddingHorizontal: 8,
                marginTop: 8,
              },
              fieldStyles(theme, focusedField === FieldType.Password).fieldText,
            ]}>
            {`Provide your registered phone number`}
          </Text>
        )}
      </View>
      {/* Action button */}
      <View
        style={[
          {
            marginBottom: 16,
          },
        ]}>
        <ActionButton
          appearance={Appearance.Outlined}
          text={isSent ? 'Resend' : 'Send Code'}
          onPress={() => {
            // send code
            // sendCode(number)
            setIsSent(true);
            setFocusedField(FieldType.OTP);
          }}
        />
      </View>
      {/* login */}
      {isSent && (
        <ActionButton
          appearance={Appearance.Stuffed}
          text={'Login'}
          onPress={() => {
            navigation.navigate('Role Selection');
          }}
        />
      )}
    </>
  );
});

const Login = ({navigation, route}: LoginProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [mode, setMode] = useState<LoginMethod>(LoginMethod.Credentials);

  // styles
  const styles = (isSelected?: boolean) =>
    StyleSheet.create({
      text: {
        fontFamily: theme.fonts.main,
        fontSize: 14,
      },
      labelContainer: {
        flex: 1,
        paddingVertical: (isSelected && 10) || 8,
        backgroundColor: theme.colors.primary[(isSelected && 400) || 50],
      },
      labelText: {
        fontWeight: theme.fontWeights.medium,
        textAlign: 'center',
        fontSize: (isSelected && 14) || 12,
        color:
          (isSelected && theme.colors.light[50]) || theme.colors.primary[400],
      },
      formBodyShadow: {
        shadowColor: theme.colors.tintedGrey[400],
        shadowOffset: {
          width: 0,
          height: -10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
    });

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      {/* logo */}
      <View
        style={[
          {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: theme.colors.tintedGrey[300],
            marginVertical: 32,
            alignSelf: 'center',
          },
        ]}></View>
      {/* login method switch */}
      <View
        style={[
          {
            flexDirection: 'row',
            paddingHorizontal: 24,
            alignItems: 'flex-end',
          },
        ]}>
        {/* email login tab */}
        <Pressable
          style={[styles(mode === LoginMethod.Credentials).labelContainer]}
          onPress={() => {
            setMode(LoginMethod.Credentials);
          }}>
          <Text
            style={[
              generalStyles(theme).text,
              styles(mode === LoginMethod.Credentials).labelText,
            ]}>
            Email Login
          </Text>
        </Pressable>
        {/* otp login tab */}
        <Pressable
          style={[styles(mode === LoginMethod.OTP).labelContainer]}
          onPress={() => {
            setMode(LoginMethod.OTP);
          }}>
          <Text
            style={[
              generalStyles(theme).text,
              styles(mode === LoginMethod.OTP).labelText,
            ]}>
            OTP Login
          </Text>
        </Pressable>
      </View>
      {/* form body */}
      <View
        style={[
          {
            flex: 1,
            zIndex: 10,
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: 24,
            paddingTop: 32,
          },
          styles().formBodyShadow,
        ]}>
        {mode === LoginMethod.Credentials && <EmailLoginForm />}
        {mode === LoginMethod.OTP && <OTPLoginForm />}
      </View>
      {/* biometrics */}
      <View
        style={[
          {
            paddingHorizontal: 24,
          },
        ]}>
        <BiometricsLogin />
      </View>
    </SafeAreaView>
  );
};

export {Login};
