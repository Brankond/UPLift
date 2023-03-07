// external dependencies
import {memo, useContext, useState} from 'react';
import {SafeAreaView, View, Text, Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {ActionButton} from '../components/ActionButton';
import {TextField, FieldType} from '../components/TextField';
import {SignupProps} from 'screens/navigation-types';
import {ThemeContext} from 'contexts';
import {generalStyles, fieldStyles} from '../authStyles';
import {Header} from 'components';
import {ExternalLogin} from '../components/ExternalLogin';

const Signup = memo(({navigation, route}: SignupProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  // states
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordShown, setPasswordShown] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <View style={[{flex: 1, paddingHorizontal: 24}]}>
        <Header title="Sign Up" searchBarShown={false} />
        {/* Username */}
        <View style={[{marginBottom: 24}]}>
          <Text
            style={[
              generalStyles(theme).text,
              {
                marginBottom: 8,
              },
              fieldStyles(theme, focusedField === FieldType.Username).fieldText,
            ]}>
            Username
          </Text>
          <TextField
            placeHolder="Enter Username"
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
        {/* email */}
        <View style={[{marginBottom: 24}]}>
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
                name="mail-outline"
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
          />
        </View>
        {/* password */}
        <View style={[{marginBottom: 24}]}>
          <Pressable>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  marginBottom: 8,
                },
                fieldStyles(theme, focusedField === FieldType.Password)
                  .fieldText,
              ]}>
              Password
            </Text>
          </Pressable>
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
          <Pressable>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  marginBottom: 8,
                },
                fieldStyles(theme, focusedField === FieldType.ConfirmPassword)
                  .fieldText,
              ]}>
              Confirm Password
            </Text>
          </Pressable>
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
        {/* signup button */}
        <View
          style={[
            {
              marginBottom: 16,
            },
          ]}>
          <ActionButton text="Sign Up" />
        </View>
        {/* redirect to login button */}
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
        {/* external singup */}
        <View
          style={[
            {
              flex: 1,
            },
          ]}>
          <ExternalLogin />
        </View>
      </View>
    </SafeAreaView>
  );
});

export {Signup};
