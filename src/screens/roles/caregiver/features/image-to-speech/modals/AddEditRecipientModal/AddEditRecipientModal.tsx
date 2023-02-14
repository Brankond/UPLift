// external dependencies
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import 'react-native-get-random-values';
import {v4} from 'uuid';

// internal dependencies
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
  const [birthday, setBirthDay] = useState(
    recipient ? recipient.date_of_birth : '',
  );
  const [photo, setPhoto] = useState(recipient ? recipient.avatar : '');

  // redux
  const dispatch = useDispatch();
  const addEditRecipient = (
    firstName: string,
    lastName: string,
    birthday: string,
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
          date_of_birth: birthday,
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
            date_of_birth: birthday,
          },
        }),
      );
    }
  };

  // onload effects
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Recipient',
      headerRight: () => (
        <SaveButton
          onPress={() => {
            addEditRecipient(firstName, lastName, birthday, recipient_id);
            navigation.goBack();
          }}
        />
      ),
    });
  });

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
          backgroundColor: theme.colors.warmGray[300],
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
        onPress={() => {
          pickImage(setPhoto);
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
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            keyboardType="default"
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Last Name"
            keyboardType="default"
          />
          <Divider style={{marginVertical: theme.sizes[3]}} />
          <TextInput
            value={birthday}
            onChangeText={setBirthDay}
            placeholder="Birthday"
            keyboardType="default"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export {AddEditRecipientModal};
