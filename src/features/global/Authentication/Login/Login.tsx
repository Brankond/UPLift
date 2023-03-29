// external dependencies
import {useContext, useState, memo, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
  Alert,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import OctIcon from 'react-native-vector-icons/Octicons';
import ReactNativeBiometrics, {BiometryType} from 'react-native-biometrics';
import {useNavigation} from '@react-navigation/native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {LoginProps} from 'navigators/navigation-types';
import {
  LoginErrors,
  emailPasswordLogin,
  googleLogin,
  appleLogin,
} from 'services/fireBaseAuth';
import {ActionButton, Appearance} from 'components/ActionButton/ActionButton';
import {
  TextField,
  FieldType,
  InputAppearance,
} from 'components/TextField/TextField';
import {TextDivider, Message, MessageType} from 'components';
import {
  PasswordLessLogin,
  PasswordLessLoginTypes,
} from '../components/ExternalLogin';
import {generalStyles, fieldStyles} from '../authStyles';
import {layout, typography} from 'features/global/globalStyles';

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

  const {error} = result;
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
  const [loginError, setLoginError] = useState<LoginErrors | null>(null);

  return (
    <>
      {/* email */}
      <View style={[{marginBottom: 24}]}>
        <TextField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
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
          appearance={InputAppearance.Round}
        />
        {/* email related error messages */}
        {(loginError === LoginErrors.INVALID_EMAIL && (
          <Message
            type={MessageType.Danger}
            message="Invalid email > <"
            containerStyle={[
              {
                paddingHorizontal: 8,
                marginTop: 8,
              },
            ]}
          />
        )) ||
          (loginError === LoginErrors.USER_NOT_FOUND && (
            <Message
              type={MessageType.Danger}
              message="User not found > <"
              containerStyle={[
                {
                  paddingHorizontal: 8,
                  marginTop: 8,
                },
              ]}
            />
          )) ||
          (loginError === LoginErrors.USER_DISABLED && (
            <Message
              type={MessageType.Danger}
              message="User disabled > <"
              containerStyle={[
                {
                  paddingHorizontal: 8,
                  marginTop: 8,
                },
              ]}
            />
          ))}
      </View>
      {/* password */}
      <View style={[{marginBottom: 16}]}>
        <TextField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          fieldType={FieldType.Password}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          secureTextEntry={!passwordShown}
          appearance={InputAppearance.Round}
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
        {/* password related error messages */}
        {loginError === LoginErrors.WRONG_PASSWORD && (
          <Message
            type={MessageType.Danger}
            message="Wrong password > <"
            containerStyle={[
              {
                paddingHorizontal: 8,
                marginTop: 8,
              },
            ]}
          />
        )}
      </View>
      {/* forget password */}
      <Text
        style={[
          typography(theme).mdBodyTextPrimary,
          {
            fontWeight: theme.fontWeights.medium,
            textAlign: 'right',
            marginBottom: 32,
          },
        ]}>
        Forget password?
      </Text>
      {/* loginButton */}
      <View style={[{marginBottom: 16}]}>
        <ActionButton
          text="Login"
          onPress={async () => {
            await emailPasswordLogin(
              email.toLowerCase(),
              password,
              setLoginError,
            );
          }}
        />
      </View>
    </>
  );
});

const Login = ({navigation, route}: LoginProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // states
  // const [mode, setMode] = useState<LoginMethod>(LoginMethod.Credentials);

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <Pressable
        style={[{flex: 1, paddingHorizontal: 24, paddingTop: 32}]}
        onPress={() => {
          Keyboard.dismiss();
        }}>
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
        <Text style={[typography(theme).mdHeadingText]}>
          Let's login you in
        </Text>
        {/* form body */}
        <View
          style={[
            {
              marginTop: 32,
            },
          ]}>
          <EmailLoginForm />
        </View>
        <View
          style={[
            {
              marginTop: 32,
            },
          ]}>
          <TextDivider text="OR" width="100%" />
        </View>
        {/* external login */}
        <View style={[{marginTop: 24, gap: 18}]}>
          <PasswordLessLogin
            type={PasswordLessLoginTypes.Google}
            onPress={async () => {
              await googleLogin();
            }}
          />
          <PasswordLessLogin
            type={PasswordLessLoginTypes.Apple}
            onPress={async () => {
              await appleLogin();
            }}
          />
          <PasswordLessLogin
            type={PasswordLessLoginTypes.Phone}
            onPress={() => {
              navigation.navigate('PhoneLogin');
            }}
          />
        </View>
        {/* link to signup page */}
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 16,
            },
          ]}>
          <View
            style={[layout(theme).centered, {flexDirection: 'row', gap: 8}]}>
            <Text style={[typography(theme).smEmphasizeTextShallow]}>
              New to UPlift?
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              <Text style={[typography(theme).smEmphasizeTextPrimary]}>
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export {Login};
