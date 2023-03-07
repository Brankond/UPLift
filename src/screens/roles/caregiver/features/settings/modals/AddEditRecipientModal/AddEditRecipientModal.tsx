// external dependencies
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import {useContext, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import 'react-native-get-random-values';
import {v4} from 'uuid';
import Picker from '@react-native-community/datetimepicker';
import {collection, addDoc} from 'firebase/firestore';

// internal dependencies
import {db} from 'environment/config';
import {AddRecipientModalProps} from 'screens/navigation-types';
import {Divider, SaveButton} from 'components';
import {ThemeContext} from 'contexts';
import {
  recipientAdded,
  recipientUpdated,
  selectRecipientById,
} from 'store/slices/recipientsSlice';
import {RootState} from 'store';
import {useHideBottomTab} from 'hooks/useHideBottomTab';
import pickImage from 'utils/pickImage';

// handlers
const commitAddRecipient = async (
  firstName: string,
  lastName: string,
  birthday: string | undefined,
  photo: string,
) => {
  const recipientData = {
    name: {
      firstName,
      lastName,
    },
    birthday,
    photo,
  };

  await addDoc(collection(db, 'recipient'), recipientData);
};

const AddEditRecipientModal = ({navigation, route}: AddRecipientModalProps) => {
  const {theme} = useContext(ThemeContext);

  // route params
  const recipient_id = route.params.recipient_id;
  const recipient = recipient_id
    ? useSelector((state: RootState) =>
        selectRecipientById(state, recipient_id),
      )
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
  const dispatch = useDispatch();
  const addEditRecipient = (
    firstName: string,
    lastName: string,
    birthday: Date | undefined,
    recipient_id: string | undefined,
  ) => {
    if (!recipient_id) {
      dispatch(
        recipientAdded({
          id: v4(),
          caregiver_id: '1',
          first_name: firstName,
          last_name: lastName,
          avatar: photo,
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
            avatar: photo,
            date_of_birth: birthday?.toString() || undefined,
          },
        }),
      );
    }
  };

  // onload effects
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
            onPress={() => {
              addEditRecipient(firstName, lastName, birthday, recipient_id);
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
  });

  useEffect(() => {
    if (!isEditing) {
      firstNameInputRef.current?.blur();
      lastNameInputRef.current?.blur();
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
      <View
        style={{
          height: theme.sizes[40],
          width: theme.sizes[40],
          backgroundColor: theme.colors.tintedGrey[300],
          borderRadius: theme.sizes[20],
          marginTop: theme.sizes[8],
        }}>
        {photo.length > 0 && (
          <Image
            source={{
              uri: photo,
            }}
            style={{
              flex: 1,
              borderRadius: theme.sizes[20],
            }}
          />
        )}
      </View>
      <Pressable
        style={{
          marginTop: theme.sizes[3],
          marginBottom: theme.sizes[6],
        }}
        onPress={async () => {
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
        <View
          style={{
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: theme.sizes[5],
          }}>
          <TextInput
            ref={firstNameInputRef}
            onFocus={() => {
              setIsEditing(true);
            }}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            keyboardType="default"
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          <TextInput
            ref={lastNameInputRef}
            onFocus={() => {
              setIsEditing(true);
            }}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            keyboardType="default"
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          <Pressable
            onPress={() => {
              firstNameInputRef.current?.blur();
              lastNameInputRef.current?.blur();
              setTimePickerDisplayed(true);
              setIsEditing(true);
            }}>
            <Text>{birthday?.toLocaleDateString() || 'Not Set'}</Text>
          </Pressable>
        </View>
      </View>
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
            onChange={(_, date) => {
              if (!date) return;
              setBirthDay(date);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export {AddEditRecipientModal};
