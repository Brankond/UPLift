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
  Platform,
} from 'react-native';
import {
  useContext,
  useState,
  useRef,
  memo,
  useEffect,
  createContext,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {Divider, TickSelection} from 'components';
import {fadeIn, fadeOut} from 'utils/animations';
import {RecipientProfileProps} from 'navigators/navigation-types';
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
import {generalStyles} from 'features/global/Authentication/authStyles';

// context
type RecipientProfileContextType = {
  recipientId: string;
};
const RecipientProfileContext = createContext<RecipientProfileContextType>({
  recipientId: '',
});

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
          backgroundColor: theme.colors.tintedGrey[300],
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
        style={[
          generalStyles(theme).text,
          {
            fontSize: theme.sizes[6],
            fontWeight: theme.fontWeights.bold,
            textAlign: 'center',
            textTransform: 'capitalize',
            marginBottom: theme.sizes[5],
          },
        ]}>
        {`${firstName} ${lastName}`}
      </Text>
    );
  },
);

/** Section Header */

// section type enum
enum SectionType {
  Information,
  Contacts,
}

// contact context
type ContactSectionContextType = {
  isEditable: boolean;
  isEditing: boolean;
  selectedContacts: string[];
  setSelectedContacts:
    | React.Dispatch<React.SetStateAction<string[]>>
    | undefined;
};

const ContactSectionContext = createContext<ContactSectionContextType>({
  isEditable: false,
  isEditing: false,
  selectedContacts: [],
  setSelectedContacts: undefined,
});

// animated Icon
const AnimatedFeatherIcon = Animated.createAnimatedComponent(FeatherIcon);

const SectionHeader = memo(
  ({
    type,
    setIsEditing,
    setSaveSig,
    addOnPress,
  }: {
    type: SectionType;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    setSaveSig: React.Dispatch<React.SetStateAction<boolean>>;
    addOnPress?: () => void;
  }) => {
    // context
    const {theme} = useContext(ThemeContext);
    const {isEditable: isContactEditable, selectedContacts} = useContext(
      ContactSectionContext,
    );

    // animation
    const nonEditingUiAnimatedVal = useRef(new Animated.Value(1)).current;
    const editingUiAnimatedVal = useRef(new Animated.Value(0)).current;

    // states
    const [isNonEditingUiDisplayed, setIsNonEditingUiDisplayed] =
      useState<boolean>(true);
    const [isEditingUiDisplayed, setIsEditingUiDisplayed] =
      useState<boolean>(false);

    const tools =
      type === SectionType.Information ? (
        <>
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
        </>
      ) : (
        <>
          {isNonEditingUiDisplayed && (
            <>
              {isContactEditable && (
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
                    style={[
                      generalStyles(theme).text,
                      {
                        fontSize: theme.sizes[3],
                        fontWeight: theme.fontWeights.medium,
                        color: theme.colors.primary[400],
                        opacity: nonEditingUiAnimatedVal,
                      },
                    ]}>
                    Select
                  </Animated.Text>
                </Pressable>
              )}
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
                <AnimatedFeatherIcon
                  style={{
                    opacity: nonEditingUiAnimatedVal,
                  }}
                  name="plus"
                  color={theme.colors.primary[400]}
                  size={theme.sizes['3.5']}
                />
              </Pressable>
            </>
          )}
          {isEditingUiDisplayed && (
            <>
              {selectedContacts.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSaveSig(true);
                  }}>
                  <Animated.Text
                    style={{
                      fontFamily: theme.fonts.main,
                      fontSize: theme.sizes[3],
                      fontWeight: theme.fontWeights.medium,
                      color: theme.colors.primary[400],
                      opacity: editingUiAnimatedVal,
                    }}>
                    Delete
                  </Animated.Text>
                </Pressable>
              )}
              <Pressable
                style={{
                  marginLeft: theme.sizes[2],
                }}
                onPress={() => {
                  setIsEditing(false);
                  fadeOut(editingUiAnimatedVal);
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
                  Done
                </Animated.Text>
              </Pressable>
            </>
          )}
        </>
      );

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
            style={[
              generalStyles(theme).text,
              {
                textTransform: 'capitalize',
                fontSize: theme.sizes[3],
              },
            ]}>
            {type === SectionType.Contacts
              ? 'Emergency Contacts'
              : 'Information'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {tools}
          </View>
        </View>
      </View>
    );
  },
);

/** End of Section Header */

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
        alignItems: 'center',
      },
      textInput: {
        fontFamily: theme.fonts.main,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        textAlign: 'right',
        fontSize: 14,
      },
      fieldLabel: {
        fontSize: 14,
      },
    });

    return (
      <View
        style={{
          marginHorizontal: theme.sizes[4],
          marginBottom: theme.sizes[8],
          padding: theme.sizes[4],
          borderRadius: theme.sizes[4],
          backgroundColor: theme.colors.tintedGrey[100],
        }}>
        <View style={[styles.horizontalRow]}>
          <Text style={[generalStyles(theme).text, styles.fieldLabel]}>
            First Name
          </Text>
          <TextInput
            placeholderTextColor={theme.colors.tintedGrey[600]}
            placeholder="Not Set"
            editable={isInformationEditing}
            style={[
              styles.textInput,
              {
                color:
                  (isInformationEditing && theme.colors.primary[400]) ||
                  (firstName.length == 0 && theme.colors.tintedGrey[600]) ||
                  theme.colors.darkText,
              },
            ]}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <Divider
          style={{marginVertical: theme.sizes[4], marginRight: -theme.sizes[4]}}
        />
        <View style={styles.horizontalRow}>
          <Text style={[generalStyles(theme).text, styles.fieldLabel]}>
            Last Name
          </Text>
          <TextInput
            placeholderTextColor={theme.colors.tintedGrey[600]}
            placeholder="Not Set"
            editable={isInformationEditing}
            style={[
              styles.textInput,
              {
                color:
                  (isInformationEditing && theme.colors.primary[400]) ||
                  (firstName.length == 0 && theme.colors.tintedGrey[600]) ||
                  theme.colors.darkText,
              },
            ]}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <Divider
          style={{marginVertical: theme.sizes[4], marginRight: -theme.sizes[4]}}
        />
        <View style={styles.horizontalRow}>
          <Text style={[generalStyles(theme).text, styles.fieldLabel]}>
            Birthday
          </Text>
          <Pressable
            onPress={() => {
              setDatePickerDisplayed(true);
            }}
            disabled={!isInformationEditing}>
            <Text
              style={{
                fontFamily: theme.fonts.main,
                color:
                  (isInformationEditing && theme.colors.primary[400]) ||
                  (!birthday && theme.colors.tintedGrey[600]) ||
                  theme.colors.darkText,
              }}>
              {birthday ? birthday.toLocaleDateString() : 'Not Set'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

/** contact card component group */

const ContactItem = memo(({contact}: {contact: EmergencyContact}) => {
  // context data
  const {theme} = useContext(ThemeContext);
  const {recipientId} = useContext(RecipientProfileContext);
  const {
    isEditing: isContactsEditing,
    selectedContacts,
    setSelectedContacts,
  } = useContext(ContactSectionContext);

  const navigation = useNavigation<RecipientProfileProps['navigation']>();

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
    </View>
  ));

  return setSelectedContacts ? (
    <Pressable
      disabled={!isContactsEditing}
      onPress={() => {
        // toggle if the contact is selected
        if (selectedContacts.includes(contact.id)) {
          setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
        } else {
          setSelectedContacts([...selectedContacts, contact.id]);
        }
      }}>
      {/* relationship */}
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.sizes[3],
          marginBottom: theme.sizes[4],
          color: theme.colors.tintedGrey[600],
        }}>
        {contact.relationship}
      </Text>
      {/* name */}
      <View
        style={{
          marginBottom: isContactsEditing ? 0 : theme.sizes[4],
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={[
            generalStyles(theme).text,
            {
              fontSize: 14,
              textTransform: 'capitalize',
            },
          ]}>
          {`${contact.first_name} ${contact.last_name}`}
        </Text>
        {!isContactsEditing && (
          <Pressable
            onPress={() => {
              navigation.navigate('Add Contact', {
                recipient_id: recipientId,
                contact_id: contact.id,
              });
            }}
            style={{
              marginLeft: theme.sizes[2],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SimpleLineIcon
              name="arrow-right"
              size={10}
              color={theme.colors.tintedGrey[600]}
            />
          </Pressable>
        )}
      </View>
      {!isContactsEditing && (
        <>
          <Text
            style={{
              color: theme.colors.tintedGrey[600],
              fontFamily: theme.fonts.main,
              fontSize: theme.sizes[3],
              marginBottom: theme.sizes[2],
            }}>
            Number
          </Text>
          {numbers}
          {emails.length > 0 && (
            <View>
              <Text
                style={{
                  marginTop: theme.sizes[2],
                  color: theme.colors.tintedGrey[600],
                  fontFamily: theme.fonts.main,
                  fontSize: theme.sizes[3],
                  marginBottom: theme.sizes[2],
                }}>
                Email
              </Text>
              {emails}
            </View>
          )}
        </>
      )}
      {isContactsEditing && (
        <TickSelection
          ticked={selectedContacts.includes(contact.id)}
          style={{
            top: 0,
            right: 0,
            borderColor: theme.colors.tintedGrey[400],
          }}
        />
      )}
    </Pressable>
  ) : (
    <></>
  );
});

const ContactsCard = memo(({contacts}: {contacts: EmergencyContact[]}) => {
  // context
  const {theme} = useContext(ThemeContext);
  const {isEditing: isContactsEditing} = useContext(ContactSectionContext);

  const contactItems = contacts.map((contact, index) => (
    <View key={index}>
      <ContactItem contact={contact} />
      {index !== contacts.length - 1 && (
        <Divider
          style={{
            marginTop: isContactsEditing ? theme.sizes[4] : theme.sizes[2],
            marginBottom: theme.sizes[4],
            marginRight: -theme.sizes[4],
          }}
        />
      )}
    </View>
  ));

  return (
    <View
      style={{
        marginHorizontal: theme.sizes[4],
        marginBottom: theme.sizes[8],
        padding: theme.sizes[4],
        borderRadius: theme.sizes[4],
        backgroundColor: theme.colors.tintedGrey[100],
      }}>
      {contacts.length > 0 ? (
        <View>{contactItems}</View>
      ) : (
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: theme.colors.tintedGrey[600],
            }}>
            No Emergency Contact
          </Text>
        </View>
      )}
    </View>
  );
});

/** End of contact card component group */

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
  const [isContactEditable, setIsContactEditable] = useState<boolean>(true);
  const [isContactsEditing, setIsContactsEditing] = useState<boolean>(false);
  const [datePickerDisplayed, setDatePickerDisplayed] =
    useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(
    recipient?.first_name || '',
  );
  const [lastName, setLastName] = useState<string>(recipient?.last_name || '');
  const [infoSaveSignal, setInfoSaveSignal] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactsDeleteSignal, setContactsDeleteSignal] =
    useState<boolean>(false);
  const [dob, setDob] = useState<Date | undefined>(
    recipient?.date_of_birth ? new Date(recipient?.date_of_birth) : undefined,
  );

  // effect
  useEffect(() => {
    if (!isInformationEditing) setDatePickerDisplayed(false);
  }, [isInformationEditing, isContactsEditing]);

  useEffect(() => {
    // save changes to personal informatoin
    if (infoSaveSignal) {
      updateInformation(dispatch, recipientId, firstName, lastName, dob);
      setInfoSaveSignal(false);
    }
    // delete selected contacts
    if (contactsDeleteSignal) {
      dispatch(manyContactsRemoved(selectedContacts));
      setSelectedContacts([]);
      setContactsDeleteSignal(false);
    }
  }, [infoSaveSignal, contactsDeleteSignal]);

  // contact section is only editable when the array contains at least 1 item
  useEffect(() => {
    if (contacts.length === 0) {
      setIsContactEditable(false);
      return;
    }
    setIsContactEditable(true);
  }, [contacts.length]);

  return recipient ? (
    <RecipientProfileContext.Provider
      value={{
        recipientId,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.light[50],
        }}>
        <Avatar uri={recipient.avatar} id={recipient.id} />
        <Name firstName={recipient.first_name} lastName={recipient.last_name} />
        <ScrollView>
          <SectionHeader
            type={SectionType.Information}
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
          <ContactSectionContext.Provider
            value={{
              isEditable: isContactEditable,
              isEditing: isContactsEditing,
              selectedContacts,
              setSelectedContacts,
            }}>
            <SectionHeader
              type={SectionType.Contacts}
              setIsEditing={setIsContactsEditing}
              setSaveSig={setContactsDeleteSignal}
              addOnPress={() => {
                navigation.navigate('Add Contact', {
                  recipient_id: recipientId,
                  contact_id: undefined,
                });
              }}
            />
            <ContactsCard contacts={contacts} />
          </ContactSectionContext.Provider>
        </ScrollView>
        {datePickerDisplayed && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: theme.colors.tintedGrey[200],
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
    </RecipientProfileContext.Provider>
  ) : (
    <></>
  );
};

export {RecipientProfile};
