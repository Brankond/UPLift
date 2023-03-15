// external dependencies
import 'react-native-get-random-values';
import {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import Picker from '@react-native-community/datetimepicker';
import {v4} from 'uuid';
import {SvgXml} from 'react-native-svg';

// internal dependencies
import {ThemeContext} from 'contexts';
import {AddRecipientModalProps} from 'navigators/navigation-types';
import {Divider, SaveButton} from 'components';
import {
  recipientAdded,
  recipientUpdated,
  selectRecipientById,
} from 'store/slices/recipientsSlice';
import {useAppDispatch, useAppSelector} from 'hooks';
import {useHideBottomTab} from 'hooks/useHideBottomTab';
import pickImage from 'utils/pickImage';
import {generalStyles} from 'features/global/authentication/authStyles';
import {dimensions} from 'features/global/globalStyles';

// handlers
// commit changes to firebase
// const commitAddRecipient = async (
//   firstName: string,
//   lastName: string,
//   birthday: string | undefined,
//   photo: string,
// ) => {
//   const recipientData = {
//     name: {
//       firstName,
//       lastName,
//     },
//     birthday,
//     photo,
//   };

//   await addDoc(collection(db, 'recipient'), recipientData);
// };

const AddEditRecipientModal = ({navigation, route}: AddRecipientModalProps) => {
  const {theme} = useContext(ThemeContext);

  // route params
  const recipient_id = route.params.recipient_id;
  const recipient = recipient_id
    ? useAppSelector(state => selectRecipientById(state, recipient_id))
    : undefined;

  // component state
  const [firstName, setFirstName] = useState(
    recipient ? recipient.first_name : '',
  );
  const [lastName, setLastName] = useState(
    recipient ? recipient.last_name : '',
  );
  const [birthday, setBirthDay] = useState<Date | undefined>(
    recipient ? new Date(recipient.date_of_birth || '2001-01-01') : undefined,
  );
  const [photo, setPhoto] = useState(recipient ? recipient.avatar : '');
  const [timePickerDisplayed, setTimePickerDisplayed] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // refs
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  // redux
  const dispatch = useAppDispatch();
  const addEditRecipient = (
    firstName: string,
    lastName: string,
    birthday: Date | undefined,
    avatar: string,
    recipient_id: string | undefined,
  ) => {
    if (!recipient_id) {
      dispatch(
        recipientAdded({
          id: v4(),
          caregiver_id: '1',
          first_name: firstName,
          last_name: lastName,
          avatar,
          date_of_birth: birthday?.toString() || undefined,
          location: '4221 West Side Avenue',
          is_fallen: false,
          collection_count: 0,
        }),
      );
    } else {
      dispatch(
        recipientUpdated({
          id: recipient_id,
          changes: {
            first_name: firstName,
            last_name: lastName,
            avatar,
            date_of_birth: birthday?.toString() || undefined,
          },
        }),
      );
    }
  };

  // onload effects
  // configure header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Recipient',
      headerRight: () =>
        isEditing ? (
          <Pressable
            onPress={() => {
              setIsEditing(false);
            }}
            style={{
              paddingRight: theme.sizes[4],
            }}>
            <Text
              style={{
                color: theme.colors.primary[400],
                fontWeight: theme.fontWeights.semibold,
              }}>
              Done
            </Text>
          </Pressable>
        ) : (
          <SaveButton
            disabled={!(firstName.length > 0 || lastName.length > 0)}
            onPress={() => {
              addEditRecipient(
                firstName,
                lastName,
                birthday,
                photo,
                recipient_id,
              );
              // commitAddRecipient(
              //   firstName,
              //   lastName,
              //   birthday?.toString(),
              //   photo,
              // );
              navigation.goBack();
            }}
          />
        ),
    });
  }, [firstName, lastName, photo, birthday, isEditing]);

  // close datePicker when editing is finished
  useEffect(() => {
    if (!isEditing) {
      Keyboard.dismiss;
      setTimePickerDisplayed(false);
    }
  }, [isEditing]);

  useHideBottomTab();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      {/* Avatar */}
      <View
        style={{
          height: theme.sizes[40],
          width: theme.sizes[40],
          backgroundColor: theme.colors.tintedGrey[300],
          borderRadius: theme.sizes[20],
          marginTop: theme.sizes[8],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {photo.length > 0 ? (
          <Image
            source={{
              uri: photo,
            }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: theme.sizes[20],
            }}
          />
        ) : (
          <SvgXml
            xml={`<?xml version="1.0" ?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><circle cx="12" cy="8" fill=${theme.colors.light[50]} r="4"/><path d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z" fill=${theme.colors.light[50]}/></svg>`}
            width="80%"
            height="80%"
          />
        )}
      </View>
      {/* Add Photo */}
      <Pressable
        style={{
          marginTop: theme.sizes[3],
          marginBottom: theme.sizes[6],
        }}
        onPress={async () => {
          // dismiss opened keybord or time picker
          setIsEditing(false);
          const result = await pickImage();
          if (!result.canceled) {
            setPhoto(result.assets[0].uri);
          }
        }}>
        <Text
          style={{
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400],
          }}>
          {photo.length > 0 ? 'Change Photo' : 'Add Photo'}
        </Text>
      </Pressable>
      <View
        style={{
          width: '100%',
          paddingHorizontal: theme.sizes['3.5'],
        }}>
        {/* First name */}
        <View
          style={{
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: theme.sizes[5],
          }}>
          <TextInput
            inputMode="text"
            placeholderTextColor={theme.colors.tintedGrey[500]}
            ref={firstNameInputRef}
            onFocus={() => {
              setIsEditing(true);
              setTimePickerDisplayed(false);
            }}
            onBlur={() => {
              setIsEditing(false);
            }}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            keyboardType="default"
            style={[
              generalStyles(theme).text,
              Platform.OS === 'android' && dimensions(theme).androidTextSize,
              {
                fontSize: 14,
              },
            ]}
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          {/* Last name */}
          <TextInput
            inputMode="text"
            placeholderTextColor={theme.colors.tintedGrey[500]}
            ref={lastNameInputRef}
            onFocus={() => {
              setIsEditing(true);
              setTimePickerDisplayed(false);
            }}
            onBlur={() => {
              setIsEditing(false);
            }}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            keyboardType="default"
            style={[
              generalStyles(theme).text,
              Platform.OS === 'android' && dimensions(theme).androidTextSize,
              {
                fontSize: 14,
              },
            ]}
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          {/* birthday */}
          <View style={[generalStyles(theme).row]}>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  fontSize: 14,
                },
              ]}>
              Birthday
            </Text>
            <Pressable
              onPress={() => {
                // dismiss opened keyboard
                Keyboard.dismiss();
                setTimePickerDisplayed(true);
                setIsEditing(true);
              }}>
              <Text
                style={[
                  generalStyles(theme).text,
                  Platform.OS === 'android' &&
                    dimensions(theme).androidTextSize,
                  {
                    fontSize: 14,
                  },
                ]}>
                {birthday?.toLocaleDateString() || 'Not Set'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      {/* birthday picker */}
      {timePickerDisplayed && (
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <Picker
            value={birthday || new Date('2001-01-01')}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (!date) return;
              setBirthDay(date);

              // hide timepicker ui upon dismissing the UI
              if (event.type === 'dismissed' || event.type === 'set') {
                setTimePickerDisplayed(false);
                setIsEditing(false);
              }
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export {AddEditRecipientModal};
