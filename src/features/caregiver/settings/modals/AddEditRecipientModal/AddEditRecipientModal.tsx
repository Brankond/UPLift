// external dependencies
import 'react-native-get-random-values';
import {useContext, useEffect, useMemo, useRef, useState} from 'react';
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
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {v4} from 'uuid';
import {SvgXml} from 'react-native-svg';

// internal dependencies
import {ThemeContext, AuthContext} from 'contexts';
import {AddRecipientModalProps} from 'navigators/navigation-types';
import {Divider, SaveButton} from 'components';
import {recipientAdded, Recipient} from 'store/slices/recipientsSlice';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {CollectionNames, addDocument} from 'services/fireStore';
import {useAppDispatch} from 'hooks';
import pickSingleImage from 'utils/pickImage';
import {AVATARS_FOLDER, uploadAsset} from 'services/cloudStorage';
import {generalStyles} from 'features/global/authentication/authStyles';
import {dimensions} from 'features/global/globalStyles';
import {AppDispatch} from 'store';
import {Asset} from 'utils/types';

/**
 * Handles the logic for adding and editing recipients
 */
const addRecipient = (newRecipient: Recipient, dispatch: AppDispatch) => {
  dispatch(recipientAdded(newRecipient));
};

const AddEditRecipientModal = ({navigation}: AddRecipientModalProps) => {
  // context values
  const {theme} = useContext(ThemeContext);
  const {user} = useContext(AuthContext);

  // component state
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthday, setBirthDay] = useState<Date | undefined>(undefined);
  const [photoLocalUri, setPhotoLocalUri] = useState<string>('');
  const [timePickerDisplayed, setTimePickerDisplayed] =
    useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const id = useMemo(() => {
    return v4();
  }, []);

  // refs
  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  // redux
  const dispatch = useAppDispatch();

  // effects
  // configure header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Recipient',
      headerRight: () =>
        isEditing ? (
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
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
            onPress={async () => {
              // initialise an empty asset
              const photoAsset: Asset = {
                cloudStoragePath: '',
                url: '',
                localUri: photoLocalUri,
              };

              // if the user has picked a photo, upload it to cloud storage
              if (photoLocalUri.length > 0) {
                const {url, cloudStoragePath} = await uploadAsset(
                  id,
                  photoLocalUri,
                  AVATARS_FOLDER,
                  photoLocalUri.split('/').pop() as string,
                );
                photoAsset.cloudStoragePath = cloudStoragePath;
                photoAsset.url = url;
              }

              // construct new recipient object
              const newRecipient: Recipient = {
                id,
                caregiverId: (user as FirebaseAuthTypes.User).uid,
                firstName,
                lastName,
                photo: photoAsset,
                birthday: birthday?.toString() || undefined,
                location: '4221 West Side Avenue',
              };

              // add recipient to redux and firestore
              addRecipient(newRecipient, dispatch);
              await addDocument(newRecipient, CollectionNames.Recipients);
              navigation.goBack();
            }}
          />
        ),
    });
  }, [firstName, lastName, photoLocalUri, birthday, isEditing]);

  // close datePicker when editing is finished
  useEffect(() => {
    if (!isEditing) {
      Keyboard.dismiss;
      setTimePickerDisplayed(false);
    }
  }, [isEditing]);

  // set new recipient id
  useEffect(() => {
    console.log('Recipient Id:', id);
  }, [id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <Pressable
        style={[
          {
            flex: 1,
            paddingHorizontal: 16,
          },
        ]}
        onPress={() => {
          Keyboard.dismiss(), setTimePickerDisplayed(false);
        }}>
        {/* Avatar */}
        <View
          style={{
            height: theme.sizes[40],
            width: theme.sizes[40],
            backgroundColor: theme.colors.tintedGrey[300],
            borderRadius: theme.sizes[20],
            marginTop: theme.sizes[8],
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {photoLocalUri.length > 0 ? (
            <Image
              source={{
                uri: photoLocalUri,
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
            const result = await pickSingleImage();
            if (result) {
              setPhotoLocalUri(result);
            }
          }}>
          <Text
            style={{
              fontSize: theme.sizes[3],
              color: theme.colors.primary[400],
              textAlign: 'center',
            }}>
            {photoLocalUri.length > 0 ? 'Change Photo' : 'Add Photo'}
          </Text>
        </Pressable>
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
      </Pressable>
      {/* birthday picker */}
      {timePickerDisplayed && (
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
          entering={SlideInDown}
          exiting={SlideOutDown}>
          <Picker
            value={birthday || new Date('2001-01-01')}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (!date) return;
              setBirthDay(date);

              // hide timepicker ui upon dismissing the UI
              if (
                Platform.OS === 'android' &&
                (event.type === 'dismissed' || event.type === 'set')
              ) {
                setTimePickerDisplayed(false);
                setIsEditing(false);
              }
            }}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export {AddEditRecipientModal};
