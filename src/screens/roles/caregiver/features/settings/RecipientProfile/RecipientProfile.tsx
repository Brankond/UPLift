// external dependencies
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useContext, useState, useRef, memo, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {Divider} from 'components';
import {fadeIn, fadeOut} from 'utils/animations';
import {RecipientProfileProps} from 'screens/navigation-types';
import {useAppDispatch, useAppSelector} from 'hooks';
import {
  selectRecipientById,
  recipientUpdated,
} from 'store/slices/recipientsSlice';
import {
  EmergencyContact,
  manyContactsRemoved,
  selectContactsByRecipientId,
} from 'store/slices/emergencyContactsSlice';
import {ThemeContext} from 'contexts';
import {AppDispatch} from 'store';
import pickImage from 'utils/pickImage';
import {Relationship} from '../modals/AddEditEmergencyContact/relationships';

// handlers
const updatePhotoOnPress = async (dispatch: AppDispatch, id: string) => {
  const result = await pickImage();
  if (result.canceled) return;
  dispatch(
    recipientUpdated({
      id,
      changes: {
        avatar: result.assets[0].uri,
      },
    }),
  );
};

const updateInformation = (
  dispatch: AppDispatch,
  id: string,
  firstName: string,
  lastName: string,
  birthday: Date | undefined,
) => {
  dispatch(
    recipientUpdated({
      id,
      changes: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: birthday?.toString() || undefined,
      },
    }),
  );
};

// components
const Avatar = memo(({id, uri}: {id: string; uri: string}) => {
  const {theme} = useContext(ThemeContext);
  const dispatch = useAppDispatch();

  return (
    <>
      <View
        style={{
          alignSelf: 'center',
          marginTop: theme.sizes[8],
          marginBottom: theme.sizes[3],
          width: theme.sizes[32],
          height: theme.sizes[32],
          borderRadius: theme.sizes[16],
          backgroundColor: theme.colors.warmGray[300],
        }}>
        {uri.length > 0 && (
          <Image
            style={{flex: 1, borderRadius: theme.sizes[16]}}
            source={{uri: uri}}
          />
        )}
      </View>
      <Pressable
        style={{
          marginBottom: theme.sizes[5],
        }}
        onPress={() => {
          updatePhotoOnPress(dispatch, id);
        }}>
        <Text
          style={{
            fontFamily: theme.fonts.main,
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400],
            textAlign: 'center',
          }}>
          {uri.length > 0 ? 'Change Photo' : 'Add Photo'}
        </Text>
      </Pressable>
    </>
  );
});

const Name = memo(
  ({firstName, lastName}: {firstName: string; lastName: string}) => {
    const {theme} = useContext(ThemeContext);

    return (
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.sizes[6],
          fontWeight: theme.fontWeights.bold,
          textAlign: 'center',
          textTransform: 'capitalize',
          marginBottom: theme.sizes[5],
        }}>
        {`${firstName} ${lastName}`}
      </Text>
    );
  },
);

const SectionHeader = memo(
  ({
    name,
    setIsEditing,
    setSaveSig,
    addOnPress,
  }: {
    name: string;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setSaveSig: React.Dispatch<React.SetStateAction<boolean>>;
    addOnPress?: () => void;
  }) => {
    const {theme} = useContext(ThemeContext);
    const navigation = useNavigation<RecipientProfileProps['navigation']>();

    // animation
    const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;
    const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;

    // states
    const [isNonEditingUiDisplayed, setIsNonEditingUiDisplayed] =
      useState<boolean>(true);
    const [isEditingUiDisplayed, setIsEditingUiDisplayed] =
      useState<boolean>(false);

    return (
      <View
        style={{
          marginHorizontal: theme.sizes[4],
        }}>
        <Divider
          style={{
            marginVertical: 0,
            marginBottom: theme.sizes[2],
            marginRight: -theme.sizes[4],
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.sizes[5],
          }}>
          <Text
            style={{
              textTransform: 'capitalize',
              fontSize: theme.sizes[3],
            }}>
            {name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {isNonEditingUiDisplayed && (
              <Pressable
                onPress={() => {
                  setIsEditing(true);
                  fadeOut(nonEditingUiAnimatedVal);
                  setTimeout(() => {
                    setIsNonEditingUiDisplayed(false);
                    setIsEditingUiDisplayed(true);
                    fadeIn(editingUiAnimatedVal);
                  }, 150);
                }}>
                <Animated.Text
                  style={{
                    fontFamily: theme.fonts.main,
                    fontSize: theme.sizes[3],
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.primary[400],
                    opacity: nonEditingUiAnimatedVal,
                  }}>
                  Edit
                </Animated.Text>
              </Pressable>
            )}
            {isEditingUiDisplayed && (
              <Pressable
                onPress={() => {
                  setIsEditing(false);
                  fadeOut(editingUiAnimatedVal);
                  setSaveSig(true);
                  setTimeout(() => {
                    setIsEditingUiDisplayed(false);
                    setIsNonEditingUiDisplayed(true);
                    fadeIn(nonEditingUiAnimatedVal);
                  }, 150);
                }}>
                <Animated.Text
                  style={{
                    fontFamily: theme.fonts.main,
                    fontSize: theme.sizes[3],
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.primary[400],
                    opacity: editingUiAnimatedVal,
                  }}>
                  Save
                </Animated.Text>
              </Pressable>
            )}
            {name === 'emergency contacts' && (
              <Pressable
                style={{
                  marginLeft: theme.sizes[2],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (!addOnPress) return;
                  addOnPress();
                }}>
                <FeatherIcon
                  name="plus"
                  color={theme.colors.primary[400]}
                  size={theme.sizes['3.5']}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  },
);

const InformationCard = memo(
  ({
    isInformationEditing,
    setDatePickerDisplayed,
    birthday,
    firstName,
    lastName,
    setFirstName,
    setLastName,
  }: {
    firstName: string;
    lastName: string;
    setFirstName: React.Dispatch<React.SetStateAction<string>>;
    setLastName: React.Dispatch<React.SetStateAction<string>>;
    isInformationEditing: boolean;
    setDatePickerDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
    birthday: Date | undefined;
  }) => {
    const {theme} = useContext(ThemeContext);

    const styles = StyleSheet.create({
      horizontalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    });

    return (
      <View
        style={{
          marginHorizontal: theme.sizes[4],
          marginBottom: theme.sizes[8],
          padding: theme.sizes[4],
          borderRadius: theme.sizes[4],
          backgroundColor: theme.colors.warmGray[100],
        }}>
        <View style={styles.horizontalRow}>
          <Text>First Name</Text>
          <TextInput
            placeholder="Not Set"
            editable={isInformationEditing}
            style={{
              color:
                (isInformationEditing && theme.colors.primary[400]) ||
                (firstName.length == 0 && theme.colors.warmGray[400]) ||
                'black',
            }}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <Divider
          style={{marginVertical: theme.sizes[4], marginRight: -theme.sizes[4]}}
        />
        <View style={styles.horizontalRow}>
          <Text>Last Name</Text>
          <TextInput
            placeholder="Not Set"
            editable={isInformationEditing}
            style={{
              color:
                (isInformationEditing && theme.colors.primary[400]) ||
                (lastName.length == 0 && theme.colors.warmGray[400]) ||
                'black',
            }}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <Divider
          style={{marginVertical: theme.sizes[4], marginRight: -theme.sizes[4]}}
        />
        <View style={styles.horizontalRow}>
          <Text>Birthday</Text>
          <Pressable
            onPress={() => {
              setDatePickerDisplayed(true);
            }}
            disabled={!isInformationEditing}>
            <Text
              style={{
                color:
                  (isInformationEditing && theme.colors.primary[400]) ||
                  (!birthday && theme.colors.warmGray[400]) ||
                  'black',
              }}>
              {birthday ? birthday.toLocaleDateString() : 'Not Set'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

const ContactItem = memo(({contact}: {contact: EmergencyContact}) => {
  const {theme} = useContext(ThemeContext);

  const numbers = contact.contact_number.map((number, index) => (
    <View>
      <Text
        key={index}
        style={{
          fontSize: theme.sizes['3.5'],
          fontFamily: theme.fonts.main,
          color: theme.colors.primary[400],
          marginBottom: theme.sizes[2],
        }}>
        {number.match(/.{1,4}/g)?.join(' ')}
      </Text>
      {/* {index !== contact.contact_number.length - 1 && (
        <Divider style={{marginVertical: theme.sizes[2]}} />
      )} */}
    </View>
  ));

  const emails = contact.email.map((email, index) => (
    <View>
      <Text
        key={index}
        style={{
          fontSize: theme.sizes['3.5'],
          fontFamily: theme.fonts.main,
          color: theme.colors.primary[400],
          marginBottom: theme.sizes[2],
        }}>
        {email}
      </Text>
      {/* {index !== contact.email.length - 1 && (
        <Divider style={{marginVertical: theme.sizes[2]}} />
      )} */}
    </View>
  ));

  return (
    <View>
      {/* relationship */}
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.sizes[3],
          marginBottom: theme.sizes[4],
          color: theme.colors.warmGray[500],
        }}>
        {Relationship[contact.relationship]}
      </Text>
      {/* name */}
      <Text
        style={{
          textTransform: 'capitalize',
          marginBottom: theme.sizes[4],
        }}>
        {`${contact.first_name} ${contact.last_name}`}
      </Text>
      <View style={{}}>
        <Text
          style={{
            color: theme.colors.warmGray[500],
            fontFamily: theme.fonts.main,
            fontSize: theme.sizes[3],
            marginBottom: theme.sizes[2],
          }}>
          Number
        </Text>
        {numbers}
        <Text
          style={{
            marginTop: theme.sizes[2],
            color: theme.colors.warmGray[500],
            fontFamily: theme.fonts.main,
            fontSize: theme.sizes[3],
            marginBottom: theme.sizes[2],
          }}>
          Email
        </Text>
        {emails}
      </View>
    </View>
  );
});

const ContactsCard = memo(
  ({contacts}: {recipient_id: string; contacts: EmergencyContact[]}) => {
    const {theme} = useContext(ThemeContext);

    const contactItems = contacts.map((contact, index) => (
      <>
        <ContactItem contact={contact} key={contact.id} />
        {index !== contacts.length - 1 && (
          <Divider
            style={{
              marginVertical: theme.sizes[4],
              marginRight: -theme.sizes[4],
            }}
          />
        )}
      </>
    ));

    return (
      <View
        style={{
          marginHorizontal: theme.sizes[4],
          marginBottom: theme.sizes[8],
          padding: theme.sizes[4],
          borderRadius: theme.sizes[4],
          backgroundColor: theme.colors.warmGray[100],
        }}>
        {contacts.length > 0 ? (
          <View>{contactItems}</View>
        ) : (
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: theme.colors.warmGray[400],
              }}>
              No Emergency Contact
            </Text>
          </View>
        )}
      </View>
    );
  },
);

// main component
const RecipientProfile = ({navigation, route}: RecipientProfileProps) => {
  const {theme} = useContext(ThemeContext);

  // external data
  const recipientId = route.params.recipient_id;
  const recipient = useAppSelector(state =>
    selectRecipientById(state, recipientId),
  );
  const contacts = useAppSelector(selectContactsByRecipientId(recipientId));

  const dispatch = useAppDispatch();

  // states
  const [isInformationEditing, setIsInformationEditing] =
    useState<boolean>(false);
  const [isContactsEditing, setIsContactsEditing] = useState<boolean>(false);
  const [datePickerDisplayed, setDatePickerDisplayed] =
    useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(
    recipient?.first_name || '',
  );
  const [lastName, setLastName] = useState<string>(recipient?.last_name || '');
  const [infoSaveSignal, setInfoSaveSignal] = useState<boolean>(false);
  const [contactsSaveSignal, setContactsSaveSignal] = useState<boolean>(false);
  const [dob, setDob] = useState<Date | undefined>(
    recipient?.date_of_birth ? new Date(recipient?.date_of_birth) : undefined,
  );

  // effect
  useEffect(() => {
    if (!isInformationEditing) setDatePickerDisplayed(false);
  }, [isInformationEditing, isContactsEditing]);

  useEffect(() => {
    if (infoSaveSignal) {
      updateInformation(dispatch, recipientId, firstName, lastName, dob);
      setInfoSaveSignal(false);
    }
  }, [infoSaveSignal]);

  return recipient ? (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.light[50],
      }}>
      <Avatar uri={recipient.avatar} id={recipient.id} />
      <Name firstName={recipient.first_name} lastName={recipient.last_name} />
      <ScrollView>
        <SectionHeader
          name="information"
          setIsEditing={setIsInformationEditing}
          setSaveSig={setInfoSaveSignal}
        />
        <InformationCard
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          birthday={dob}
          isInformationEditing={isInformationEditing}
          setDatePickerDisplayed={setDatePickerDisplayed}
        />
        <SectionHeader
          name="emergency contacts"
          setIsEditing={setIsContactsEditing}
          setSaveSig={setContactsSaveSignal}
          addOnPress={() => {
            navigation.navigate('Add Contact', {
              recipient_id: recipientId,
              contact_id: undefined,
            });
          }}
        />
        <ContactsCard recipient_id={recipientId} contacts={contacts} />
      </ScrollView>
      {datePickerDisplayed && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: theme.colors.warmGray[200],
          }}>
          <DateTimePicker
            value={dob || new Date('2001-01-01')}
            mode="date"
            display="spinner"
            onChange={(_, date) => {
              if (!date) return;
              setDob(date);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  ) : (
    <></>
  );
};

export {RecipientProfile};
