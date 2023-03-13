// external dependencies
import {createContext, memo, useContext, useState, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  Keyboard,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
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
import {
  passwordComplexityCheck,
  ComplexityCheckErrorCode,
} from 'utils/passwordComplexityCheck';
import {SignupProps} from 'navigators/navigation-types';
import {ThemeContext} from 'contexts';
import {generalStyles, fieldStyles} from '../authStyles';
import {Header} from 'components';
import {layout} from 'features/global/globalStyles';

// context
interface SignUpContextType {
  email: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
}
const SignUpContext = createContext<SignUpContextType>({email: ''});

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

enum MessageType {
  Instruction,
  Success,
  Danger,
}

type MessageProps = {
  type: MessageType;
  message: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const Message = memo(
  ({type, message, containerStyle, textStyle}: MessageProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    return (
      <View
        style={[
          layout(theme).rowAlignCentered,
          {
            paddingHorizontal: 16,
          },
          containerStyle,
        ]}>
        {type === MessageType.Success && (
          <FeatherIcon
            name="check"
            color={theme.colors.success[500]}
            size={12}
          />
        )}
        <Text
          style={[
            generalStyles(theme).text,
            {
              color:
                type === MessageType.Danger
                  ? theme.colors.danger[500]
                  : theme.colors.darkText,
              fontSize: 12,
              marginHorizontal: type === MessageType.Success ? 8 : 0,
            },
            textStyle,
          ]}>
          {message}
        </Text>
      </View>
    );
  },
);

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
  const {email, setEmail} = useContext(SignUpContext);

  // styles
  const styles = StyleSheet.create({
    textFieldDisabled: {
      backgroundColor: theme.colors.tintedGrey[200],
    },
  });

  // states
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
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

  return (
    <>
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
              if (email.includes('@')) {
                setEmailValidity(Validity.Valid);
              } else {
                setEmailValidity(Validity.Invalid);
              }
            }}
          />
          {(emailValidity === Validity.Valid && (
            <Message
              type={MessageType.Success}
              message="Valid email address"
              containerStyle={[{marginTop: 8}]}
            />
          )) ||
            (emailValidity === Validity.Invalid && (
              <Message
                type={MessageType.Danger}
                message="Please enter a valid email address"
                containerStyle={[{marginTop: 8}]}
              />
            ))}
        </View>
      )}
      {/* Username */}
      <View style={[{marginBottom: 24}]}>
        <TextField
          placeHolder="Username (optional)"
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
          appearance={InputAppearance.Round}
        />
      </View>
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
          onEndEditing={() => {
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
      {/* confirm password */}
      <View style={[{marginBottom: 32}]}>
        <TextField
          editable={passwordValidity === Validity.Valid}
          placeHolder="Confirm Password"
          value={confirmPassword}
          setValue={setConfirmPassword}
          fieldType={FieldType.ConfirmPassword}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          secureEntry={!passwordShown}
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
            disabled={!isValidForSignUp}
            onPress={() => {
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
      <Pressable
        style={[{flex: 1, paddingHorizontal: 24}]}
        onPress={() => Keyboard.dismiss()}>
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
      </Pressable>
    </SafeAreaView>
  );
});

export {Signup};
