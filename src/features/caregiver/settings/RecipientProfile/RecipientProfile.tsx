// external dependencies
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  Platform,
  Animated,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  useContext,
  useState,
  useRef,
  memo,
  useEffect,
  createContext,
} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';

// internal dependencies
import {RecipientProfileProps} from 'navigators/navigation-types';
import {AppDispatch} from 'store';
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
import {Divider, TickSelection} from 'components';
import {fadeIn, fadeOut} from 'utils/animations';
import pickSingleImage from 'utils/pickImage';
import {generalStyles} from 'features/global/authentication/authStyles';
import {dimensions} from 'features/global/globalStyles';

// context
type RecipientProfileContextType = {
  recipientId: string;
};
const RecipientProfileContext = createContext<RecipientProfileContextType>({
  recipientId: '',
});

// handlers
const updatePhotoOnPress = async (dispatch: AppDispatch, id: string) => {
  const result = await pickSingleImage();
  if (!result) return;
  dispatch(
    recipientUpdated({
      id,
      changes: {
        avatar: result,
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
        firstName: firstName,
        lastName: lastName,
        birthday: birthday?.toString() || undefined,
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
    id,
    isInformationEditing,
    setDatePickerDisplayed,
    birthday,
    firstName,
    lastName,
    setFirstName,
    setLastName,
  }: {
    id: string;
    firstName: string;
    lastName: string;
    setFirstName: React.Dispatch<React.SetStateAction<string>>;
    setLastName: React.Dispatch<React.SetStateAction<string>>;
    isInformationEditing: boolean;
    setDatePickerDisplayed: React.Dispatch<React.SetStateAction<boolean>>;
    birthday: Date | undefined;
  }) => {
    // context values
    const {theme} = useContext(ThemeContext);

    // style
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
      roundedCornerFieldContaier: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 16,
        backgroundColor: theme.colors.tintedGrey[100],
      },
      secondaryText: {
        fontFamily: theme.fonts.main,
        fontSize: 12,
        color: theme.colors.tintedGrey[600],
      },
      bodyTextVar2: {
        fontFamily: theme.fonts.main,
        fontSize: 14,
        color: theme.colors.darkText,
      },
    });

    return (
      <>
        <View style={[styles.roundedCornerFieldContaier]}>
          <Text style={[styles.secondaryText, {marginBottom: 8}]}>
            Recipient Id
          </Text>
          <Text
            style={[styles.bodyTextVar2]}
            onPress={() => {
              Clipboard.setString(id);
            }}>
            {id}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: theme.sizes[4],
            marginBottom: theme.sizes[8],
            padding: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.tintedGrey[100],
          }}>
          {/* first name */}
          <View style={[[generalStyles(theme).row]]}>
            <Text style={[generalStyles(theme).text, styles.fieldLabel]}>
              First Name
            </Text>
            <TextInput
              inputMode="text"
              placeholderTextColor={theme.colors.tintedGrey[600]}
              placeholder="Not Set"
              editable={isInformationEditing}
              style={[
                styles.textInput,
                Platform.OS === 'android' && dimensions(theme).androidTextSize,
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
            style={{
              marginVertical: theme.sizes[4],
              marginRight: -theme.sizes[4],
            }}
          />
          {/* last name */}
          <View style={[generalStyles(theme).row]}>
            <Text style={[generalStyles(theme).text, styles.fieldLabel]}>
              Last Name
            </Text>
            <TextInput
              inputMode="text"
              placeholderTextColor={theme.colors.tintedGrey[600]}
              placeholder="Not Set"
              editable={isInformationEditing}
              style={[
                styles.textInput,
                Platform.OS === 'android' && dimensions(theme).androidTextSize,
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
            style={{
              marginVertical: theme.sizes[4],
              marginRight: -theme.sizes[4],
            }}
          />
          {/* birthday */}
          <View style={[generalStyles(theme).row]}>
            <Text
              style={[
                generalStyles(theme).text,
                styles.fieldLabel,
                Platform.OS === 'android' && dimensions(theme).androidTextSize,
              ]}>
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
      </>
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

  const numbers = contact.contactNumbers.map((number, index) => (
    <View key={index}>
      <Text
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

  const emails = contact.emails.map((email, index) => (
    <View key={index}>
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
          {`${contact.firstName} ${contact.lastName}`}
        </Text>
        {!isContactsEditing && (
          <Pressable
            onPress={() => {
              navigation.navigate('Add Contact', {
                recipientId: recipientId,
                contactId: contact.id,
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
  const recipientId = route.params.recipientId;
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
    recipient?.firstName || '',
  );
  const [lastName, setLastName] = useState<string>(recipient?.lastName || '');
  const [infoSaveSignal, setInfoSaveSignal] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [contactsDeleteSignal, setContactsDeleteSignal] =
    useState<boolean>(false);
  const [dob, setDob] = useState<Date | undefined>(
    recipient?.birthday ? new Date(recipient?.birthday) : undefined,
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
        <Name firstName={recipient.firstName} lastName={recipient.lastName} />
        {/* navigate to the recipient's view */}
        <View style={[{alignItems: 'center', marginBottom: 16}]}>
          <Pressable
            style={[
              generalStyles(theme).row,
              {
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.colors.primary[400],
              },
            ]}>
            <Text
              style={[
                {
                  fontFamily: theme.fonts.main,
                  fontSize: 14,
                  color: theme.colors.primary[400],
                },
              ]}>
              Enter {recipient.firstName}'s View
            </Text>
            <Ionicon
              name="ios-arrow-forward-circle"
              size={20}
              color={theme.colors.primary[400]}
              style={[
                {
                  marginLeft: 6,
                  marginRight: -4,
                },
              ]}
            />
          </Pressable>
        </View>
        <ScrollView>
          <SectionHeader
            type={SectionType.Information}
            setIsEditing={setIsInformationEditing}
            setSaveSig={setInfoSaveSignal}
          />
          <InformationCard
            id={recipientId}
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
                  recipientId: recipientId,
                  contactId: undefined,
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
