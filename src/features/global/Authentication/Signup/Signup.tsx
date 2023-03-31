// external dependencies
import {
  createContext,
  memo,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  Text,
  Pressable,
  Keyboard,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useHeaderHeight} from '@react-navigation/elements';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {
  TextField,
  FieldType,
  InputAppearance,
} from '../../../../components/TextField/TextField';
import {
  passwordComplexityCheck,
  ComplexityCheckErrorCode,
} from 'utils/passwordComplexityCheck';
import {
  createUserEmailPassword,
  newUserEmailPasswordLogin,
} from 'services/fireBaseAuth';
import {validateEmail} from 'utils/validateEmail';
import {SignupProps} from 'navigators/navigation-types';
import {ThemeContext, AuthContext} from 'contexts';
import {generalStyles, fieldStyles} from '../authStyles';
import {Header, ActionButton, Message, MessageType} from 'components';
import {layout} from 'features/global/globalStyles';

// context
interface SignUpContextType {
  email: string;
  password: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
}
const SignUpContext = createContext<SignUpContextType>({
  email: '',
  password: '',
});

const convertErrorCodeToMessage = (code: ComplexityCheckErrorCode): string => {
  switch (code) {
    case ComplexityCheckErrorCode.PASSWORD_TOO_SHORT:
      return 'Password must contain at least 8 characters';
    case ComplexityCheckErrorCode.PASSWORD_NO_DIGIT:
      return 'Include at least one digit';
    case ComplexityCheckErrorCode.PASSWORD_NO_SPECIAL_CHARACTER:
      return 'Include at least one special character';
  }
};

const ComplexityCheckErrorMessage = memo(
  ({errors}: {errors: ComplexityCheckErrorCode[]}) => {
    return (
      <View
        style={[
          {
            marginTop: 8,
          },
        ]}>
        {errors.map((error, index) => (
          <Message
            key={index}
            type={MessageType.Danger}
            message={convertErrorCodeToMessage(error)}
          />
        ))}
      </View>
    );
  },
);

enum Validity {
  Valid,
  Invalid,
  NotSet,
}

const InfoForm = memo(({onPress}: {onPress: () => void}) => {
  // navigation
  const navigation = useNavigation<SignupProps['navigation']>();

  // context values
  const {theme} = useContext(ThemeContext);
  const {email, password, setEmail, setPassword} = useContext(SignUpContext);

  // styles
  const styles = StyleSheet.create({
    textFieldDisabled: {
      backgroundColor: theme.colors.tintedGrey[200],
    },
  });

  // states
  const [username, setUsername] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [loginRedirectShown, setLoginRedirectShown] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);
  const [emailValidity, setEmailValidity] = useState<Validity>(Validity.NotSet);
  const [passwordValidity, setPasswordValidity] = useState<Validity>(
    Validity.NotSet,
  );
  const [complexityCheckErrors, setComplexityCheckErrors] = useState<
    ComplexityCheckErrorCode[]
  >([]);
  const [passwordConfirmationState, setPasswordConfirmationState] =
    useState<Validity>(Validity.NotSet);
  const isValidForSignUp = useMemo(() => {
    return (
      email.length > 0 &&
      passwordValidity === Validity.Valid &&
      passwordConfirmationState === Validity.Valid
    );
  }, [email, passwordValidity, passwordConfirmationState]);

  // events
  Keyboard.addListener('keyboardWillShow', () => {
    setLoginRedirectShown(false);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setLoginRedirectShown(true);
  });

  return (
    <>
      {/* email */}
      {setEmail && (
        <View style={[{marginBottom: 24}]}>
          <TextField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            fieldType={FieldType.Email}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            autoFocus={true}
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
            onEndEditing={() => {
              setEmailValidity(
                validateEmail(email) ? Validity.Valid : Validity.Invalid,
              );
            }}
          />
          {(emailValidity === Validity.Valid && (
            <Message
              type={MessageType.Success}
              message="Looks good!"
              containerStyle={[{marginTop: 8}]}
            />
          )) ||
            (emailValidity === Validity.Invalid && (
              <Message
                type={MessageType.Danger}
                message="Does not seem to be a valid email address > <"
                containerStyle={[{marginTop: 8}]}
              />
            ))}
        </View>
      )}
      {/* Username */}
      <View style={[{marginBottom: 24}]}>
        <TextField
          placeholder="Username (optional)"
          value={username}
          onChangeText={setUsername}
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
          appearance={InputAppearance.Round}
        />
      </View>
      {/* password */}
      {setPassword && (
        <View style={[{marginBottom: 24}]}>
          <TextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            fieldType={FieldType.Password}
            focusedField={focusedField}
            setFocusedField={setFocusedField}
            secureTextEntry={!passwordShown}
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
            onEndEditing={() => {
              Keyboard.dismiss();
              // check password complexity
              const complexityCheckResult = passwordComplexityCheck(password);
              if (complexityCheckResult.isPassed) {
                setPasswordValidity(Validity.Valid);
                setComplexityCheckErrors([]);
              }
              if (complexityCheckResult.error) {
                setPasswordValidity(Validity.Invalid);
                setComplexityCheckErrors([...complexityCheckResult.error]);
              }
            }}
          />
          {(passwordValidity === Validity.Valid && (
            <Message
              type={MessageType.Success}
              message="Valid password"
              containerStyle={[{marginTop: 8}]}
            />
          )) ||
            (passwordValidity === Validity.Invalid && (
              <ComplexityCheckErrorMessage errors={complexityCheckErrors} />
            )) ||
            (passwordValidity === Validity.NotSet && (
              <Message
                type={MessageType.Instruction}
                message={`Password must contain at least 8 characters.\nAt least 1 digit and 1 special character needs to be included.`}
                containerStyle={[{marginTop: 8}]}
                textStyle={[
                  fieldStyles(theme, focusedField === FieldType.Password)
                    .fieldText,
                ]}
              />
            ))}
        </View>
      )}
      {/* confirm password */}
      <View style={[{marginBottom: 32}]}>
        <TextField
          editable={passwordValidity === Validity.Valid}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          fieldType={FieldType.ConfirmPassword}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          secureTextEntry={!passwordShown}
          icon={
            <Pressable
              onPress={() => setPasswordShown(!passwordShown)}
              disabled={passwordValidity !== Validity.Valid}>
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
          containerStyle={
            (passwordValidity !== Validity.Valid && styles.textFieldDisabled) ||
            {}
          }
          onEndEditing={() => {
            // check passwords equality
            if (confirmPassword !== password) {
              setPasswordConfirmationState(Validity.Invalid);
            } else {
              setPasswordConfirmationState(Validity.Valid);
            }
          }}
        />
        {(passwordConfirmationState === Validity.Valid && (
          <Message
            type={MessageType.Success}
            message="Password confirmed"
            containerStyle={[{marginTop: 8}]}
          />
        )) ||
          (passwordConfirmationState === Validity.Invalid && (
            <Message
              type={MessageType.Danger}
              message="Password does not match"
              containerStyle={[{marginTop: 8}]}
            />
          ))}
      </View>
      <View style={[{flex: 1, justifyContent: 'flex-end'}]}>
        {loginRedirectShown && (
          // redirect to login
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
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
          </Animated.View>
        )}

        {/* signup button */}
        <View
          style={[
            {
              marginBottom: 16,
            },
          ]}>
          <ActionButton
            text="Sign Up"
            disabled={!isValidForSignUp}
            onPress={async () => {
              // create new user
              await createUserEmailPassword(email, password);
              onPress();
            }}
            containerStyle={{
              backgroundColor: isValidForSignUp
                ? theme.colors.primary[400]
                : theme.colors.tintedGrey[200],
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
  const {email, password} = useContext(SignUpContext);
  const {user} = useContext(AuthContext);

  return (
    <>
      {/* instructions */}
      <Text
        style={[
          generalStyles(theme).text,
          {
            fontSize: 14,
            marginBottom: 8,
          },
        ]}>
        {`A verification email has been sent to:`}
      </Text>
      <Text
        style={[
          generalStyles(theme).text,
          {
            marginBottom: 8,
            fontWeight: theme.fontWeights.medium,
          },
        ]}>
        {email}
      </Text>
      <Text
        style={[
          generalStyles(theme).text,
          {
            fontSize: 14,
            marginBottom: 8,
          },
        ]}>
        {`Please click on the activation link in the email to complete verification.`}
      </Text>
      {/* action button */}
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
          },
        ]}>
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
            Didn't receive the verification email?
          </Text>
          <Pressable
            onPress={async () => {
              // resend verification email
              await user?.sendEmailVerification();
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
              Resend
            </Text>
          </Pressable>
        </View>
        <ActionButton
          text="Verify Account"
          onPress={async () => {
            // log in the new user
            await newUserEmailPasswordLogin(email, password);
            onPress();
          }}
        />
      </View>
    </>
  );
});

const Signup = memo(({navigation, route}: SignupProps) => {
  // get header height

  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [infoSent, setInfoSent] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <KeyboardAvoidingView
        style={[{flex: 1}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={useHeaderHeight()}>
        <Pressable
          style={[{flex: 1, paddingHorizontal: 24}]}
          onPress={() => Keyboard.dismiss()}>
          <Header title="Sign Up" searchBarShown={false} />
          <SignUpContext.Provider
            value={{email, password, setEmail, setPassword}}>
            {!infoSent && (
              <InfoForm
                onPress={() => {
                  setInfoSent(true);
                }}
              />
            )}
            {infoSent && (
              <EmailVerification
                onPress={() => {
                  setCodeSent(true);
                }}
              />
            )}
          </SignUpContext.Provider>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export {Signup};
