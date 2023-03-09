// external dependencies
import {createContext, memo, useContext, useState} from 'react';
import {SafeAreaView, View, Text, Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

// internal dependencies
import {ActionButton} from '../../../../components/ActionButton/ActionButton';
import {
  TextField,
  FieldType,
  InputAppearance,
} from '../../../../components/TextField/TextField';
import {SignupProps} from 'navigators/navigation-types';
import {ThemeContext} from 'contexts';
import {generalStyles, fieldStyles} from '../authStyles';
import {Header} from 'components';
import {ExternalLogin} from '../components/ExternalLogin';

// context
interface SignUpContextType {
  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
}
const SignUpContext = createContext<SignUpContextType>({email: ''});

const InfoForm = memo(({onPress}: {onPress: () => void}) => {
  // navigation
  const navigation = useNavigation<SignupProps['navigation']>();

  // context values
  const {theme} = useContext(ThemeContext);
  const {email, setEmail} = useContext(SignUpContext);

  // states
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);

  return (
    <>
      {/* Username */}
      <View style={[{marginBottom: 24}]}>
        <TextField
          placeHolder="Username"
          value={username}
          setValue={setUsername}
          fieldType={FieldType.Username}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          icon={
            <MaterialIcon
              name="account-circle"
              color={
                focusedField === FieldType.Username
                  ? theme.colors.primary[400]
                  : theme.colors.tintedGrey[700]
              }
              size={18}
            />
          }
          autoFocus={true}
          appearance={InputAppearance.Round}
        />
      </View>
      {/* email */}
      {setEmail && (
        <View style={[{marginBottom: 24}]}>
          <TextField
            placeHolder="Email"
            value={email}
            setValue={setEmail}
            fieldType={FieldType.Email}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            icon={
              <MaterialIcon
                name="mail-outline"
                color={
                  focusedField === FieldType.Email
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
              />
            }
            appearance={InputAppearance.Round}
          />
        </View>
      )}

      {/* password */}
      <View style={[{marginBottom: 24}]}>
        <TextField
          placeHolder="Password"
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
              />
            </Pressable>
          }
          appearance={InputAppearance.Round}
        />
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
          {`Password must contain at least 8 characters.\nAt least 1 digit and 1 special character needs to be included.`}
        </Text>
      </View>
      {/* confirm password */}
      <View style={[{marginBottom: 32}]}>
        <TextField
          placeHolder="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          fieldType={FieldType.ConfirmPassword}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          secureEntry={!passwordShown}
          icon={
            <Pressable onPress={() => setPasswordShown(!passwordShown)}>
              <FeatherIcon
                name={passwordShown ? 'eye' : 'eye-off'}
                color={
                  focusedField === FieldType.ConfirmPassword
                    ? theme.colors.primary[400]
                    : theme.colors.tintedGrey[700]
                }
                size={18}
              />
            </Pressable>
          }
          appearance={InputAppearance.Round}
        />
      </View>
      <View style={[{flex: 1, justifyContent: 'flex-end'}]}>
        {/* redirect to login button */}
        <View
          style={[
            generalStyles(theme).row,
            {
              justifyContent: 'center',
              marginBottom: 16,
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
            Already have an Account?
          </Text>
          <Pressable
            onPress={() => {
              // navigate to signUp page
              navigation.navigate('Login');
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
              Login
            </Text>
          </Pressable>
        </View>
        {/* signup button */}
        <View
          style={[
            {
              marginBottom: 16,
            },
          ]}>
          <ActionButton
            text="Sign Up"
            onPress={() => {
              onPress();
            }}
          />
        </View>
      </View>
    </>
  );
});

const EmailVerification = memo(({onPress}: {onPress: () => void}) => {
  // context
  const {theme} = useContext(ThemeContext);
  const {email} = useContext(SignUpContext);

  // states
  const [code, setCode] = useState<string>('');
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);

  return (
    <>
      {/* OTP */}
      <Text
        style={[
          generalStyles(theme).text,
          {
            fontSize: 14,
            marginBottom: 8,
          },
        ]}>
        {`A 6-digit code has been sent to your email`}
      </Text>
      <Text
        style={[
          generalStyles(theme).text,
          {
            marginBottom: 12,
            fontWeight: theme.fontWeights.medium,
          },
        ]}>
        {email}
      </Text>
      <TextField
        placeHolder={'Enter Code'}
        maxLength={6}
        value={code}
        setValue={setCode}
        fieldType={FieldType.OTP}
        focusedField={focusedField}
        setFocusedField={setFocusedField}
        icon={
          <View style={[generalStyles(theme).row]}>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  marginHorizontal: 8,
                },
              ]}>
              |
            </Text>
            <Pressable>
              <Text style={[generalStyles(theme).text]}>Resend</Text>
            </Pressable>
          </View>
        }
        autoFocus={true}
        appearance={InputAppearance.Round}
      />
      {/* action button */}
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
          },
        ]}>
        <ActionButton
          text="Verify Account"
          onPress={() => {
            onPress();
          }}
        />
      </View>
    </>
  );
});

const Signup = memo(({navigation, route}: SignupProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [email, setEmail] = useState<string>('');
  const [infoSent, setInfoSent] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <View style={[{flex: 1, paddingHorizontal: 24}]}>
        <Header title="Sign Up" searchBarShown={false} />
        <SignUpContext.Provider value={{email, setEmail}}>
          {!infoSent && (
            <InfoForm
              onPress={() => {
                // send signup form into
                // singup(info)
                setInfoSent(true);
              }}
            />
          )}
          {infoSent && !codeSent && (
            <EmailVerification
              onPress={() => {
                // verify code
                // verifyEmail(code)
                setCodeSent(true);
                navigation.navigate('Role Selection');
              }}
            />
          )}
        </SignUpContext.Provider>
      </View>
    </SafeAreaView>
  );
});

export {Signup};
