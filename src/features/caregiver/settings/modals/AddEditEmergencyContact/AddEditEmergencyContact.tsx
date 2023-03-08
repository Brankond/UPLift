// external dependencies
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  memo,
} from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {v4} from 'uuid';
import {useHeaderHeight} from '@react-navigation/elements';

// internal dependencies
import {RelationshipContext} from '../../../../../navigators/SettingsStackNavigator/SettingsStackNavigator';
import {ThemeContext} from 'contexts';
import {AddContactModalProps} from 'navigators/navigation-types';
import {SaveButton, Divider} from 'components';
import {useAppDispatch, useAppSelector} from 'hooks';
import {selectContactById} from 'store/slices/emergencyContactsSlice';
import {generalStyles} from 'features/global/Authentication/authStyles';
import {
  contactAdded,
  contactUpdated,
} from 'store/slices/emergencyContactsSlice';

// handlers
const updateContactMethodEntryValue = (
  values: string[],
  index: number,
  newVal: string,
) => {
  values[index] = newVal;
};

// context
type ContactContextType = {
  contactNumbers: string[];
  setContactNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
};
const ContactContext = createContext<ContactContextType | null>(null);
type EditingStateContextType = {
  isEditing: boolean;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};
const EditingStateContext = createContext<EditingStateContextType>({
  isEditing: false,
});

enum ContactMethod {
  Phone,
  Email,
}

const ContactMethodEntryItem = memo(
  ({
    value,
    index,
    method,
  }: {
    value: string;
    index: number;
    method: ContactMethod;
  }) => {
    const {theme} = useContext(ThemeContext);
    const contact = useContext(ContactContext);
    const setContactMethodEntries = contact
      ? method === ContactMethod.Email
        ? contact.setEmails
        : contact.setContactNumbers
      : undefined;
    const contactMethodEntries = contact
      ? method === ContactMethod.Email
        ? [...contact.emails]
        : [...contact.contactNumbers]
      : undefined;

    const {isEditing: contextIsEditing, setIsEditing: setContextIsEditing} =
      useContext(EditingStateContext);
    const [entryValue, setEntryValue] = useState<string>(value);

    useEffect(() => {
      setEntryValue(value);
    }, [value]);

    return contactMethodEntries &&
      setContactMethodEntries &&
      setContextIsEditing ? (
      <>
        <View
          style={{
            paddingHorizontal: theme.sizes[5],
            paddingVertical: theme.sizes[4],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Pressable
            style={{
              width: theme.sizes[4],
              height: theme.sizes[4],
              backgroundColor: theme.colors.danger[500],
              borderRadius: theme.sizes[2],
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              // remove current item
              // set editing state to be false if it is true
              if (contextIsEditing) setContextIsEditing(false);
              contactMethodEntries.splice(index, 1);
              setContactMethodEntries(contactMethodEntries);
            }}>
            <FeatherIcon
              name="minus"
              color={theme.colors.light[50]}
              size={theme.sizes[3]}
            />
          </Pressable>
          <TextInput
            placeholderTextColor={theme.colors.tintedGrey[500]}
            onFocus={() => {
              setContextIsEditing(true);
            }}
            keyboardType={
              method === ContactMethod.Email ? 'email-address' : 'phone-pad'
            }
            style={[
              generalStyles(theme).text,
              {fontSize: 14},
              {
                flex: 1,
                marginLeft: theme.sizes[5],
              },
            ]}
            placeholder={
              method === ContactMethod.Email ? 'Enter Email' : 'Enter Number'
            }
            value={entryValue}
            onChangeText={setEntryValue}
            onEndEditing={() => {
              updateContactMethodEntryValue(
                contactMethodEntries,
                index,
                entryValue,
              );
              setContactMethodEntries(contactMethodEntries);
            }}
            onBlur={() => {
              setContextIsEditing(false);
            }}
          />
        </View>
      </>
    ) : (
      <></>
    );
  },
);

const ContactMethodEntryList = memo(({method}: {method: ContactMethod}) => {
  // context values
  const contact = useContext(ContactContext);

  const setContactMethodEntries = contact
    ? method === ContactMethod.Email
      ? contact.setEmails
      : contact.setContactNumbers
    : undefined;
  const contactMethodEntries = contact
    ? method === ContactMethod.Email
      ? [...contact.emails]
      : [...contact.contactNumbers]
    : undefined;

  const {theme} = useContext(ThemeContext);

  const entryList = contactMethodEntries?.map((entry, index) => (
    <>
      <ContactMethodEntryItem
        method={method}
        value={entry}
        index={index}
        key={index}
      />
      <Divider style={{marginVertical: 0}} />
    </>
  ));

  return contactMethodEntries && setContactMethodEntries ? (
    <View
      style={[
        {
          backgroundColor: theme.colors.light[50],
          marginTop: theme.sizes[8],
          borderRadius: theme.sizes[4],
        },
      ]}>
      {entryList}
      {/* Add entry row */}
      <View
        style={{
          paddingHorizontal: theme.sizes[5],
          paddingVertical: theme.sizes[4],
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Pressable
          style={{
            width: theme.sizes[4],
            height: theme.sizes[4],
            backgroundColor: theme.colors.primary[400],
            borderRadius: theme.sizes[2],
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            setContactMethodEntries([...contactMethodEntries, '']);
          }}>
          <FeatherIcon
            name="plus"
            color={theme.colors.light[50]}
            size={theme.sizes[3]}
          />
        </Pressable>
        <Text
          style={[
            generalStyles(theme).text,
            {fontSize: 14},
            {
              flex: 1,
              marginLeft: theme.sizes[5],
            },
          ]}>
          {method === ContactMethod.Email ? 'Add Email' : 'Add Number'}
        </Text>
      </View>
    </View>
  ) : (
    <></>
  );
});

const AddEditContactModal = ({navigation, route}: AddContactModalProps) => {
  const headerHeight = useHeaderHeight();
  const {theme} = useContext(ThemeContext);

  const dispatch = useAppDispatch();
  const recipientId = route.params.recipient_id;
  const contactId = route.params.contact_id;
  const contact = contactId
    ? useAppSelector(state => selectContactById(state, contactId))
    : undefined;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(contact?.first_name || '');
  const [lastName, setLastName] = useState<string>(contact?.last_name || '');
  const [contactNumbers, setContactNumbers] = useState<string[]>(
    contact?.contact_number || [],
  );
  const [emails, setEmails] = useState<string[]>(contact?.email || []);
  const {
    relationship: contextRelationship,
    setRelationship: setContextRelationship,
  } = useContext(RelationshipContext);
  const [relationship, setRelationship] = useState<string>(
    contact?.relationship || 'NotSet',
  );

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  // effects
  // initialise proper context
  useEffect(() => {
    if (!setContextRelationship) return;
    setContextRelationship(relationship);
  }, []);

  // update relationship upon context changes
  useEffect(() => {
    setRelationship(contextRelationship);
  }, [contextRelationship]);

  // configure header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: (contactId && 'Edit Contact') || 'Add Contact',
      headerRight: () =>
        isEditing ? (
          <Pressable
            onPress={() => {
              setIsEditing(false);
              Keyboard.dismiss();
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
            onPress={
              contactId
                ? () => {
                    dispatch(
                      contactUpdated({
                        id: contactId,
                        changes: {
                          first_name: firstName,
                          last_name: lastName,
                          contact_number: contactNumbers,
                          email: emails,
                          relationship: relationship,
                        },
                      }),
                    );
                    navigation.goBack();
                  }
                : () => {
                    dispatch(
                      contactAdded({
                        id: v4(),
                        recipient_id: recipientId,
                        first_name: firstName,
                        last_name: lastName,
                        contact_number: contactNumbers,
                        email: emails,
                        relationship: relationship,
                      }),
                    );
                    navigation.goBack();
                  }
            }
            disabled={
              !(
                (firstName.length > 0 || lastName.length > 0) &&
                relationship !== 'NotSet' &&
                contactNumbers.length > 0
              )
            }
          />
        ),
    });
  }, [
    isEditing,
    contactId,
    firstName,
    lastName,
    contactNumbers,
    emails,
    relationship,
  ]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}
      style={{
        marginHorizontal: theme.sizes['3.5'],
      }}>
      <EditingStateContext.Provider value={{isEditing, setIsEditing}}>
        <ContactContext.Provider
          value={{
            contactNumbers,
            setContactNumbers,
            emails,
            setEmails,
          }}>
          <ScrollView>
            {/* names */}
            <View
              style={{
                marginTop: theme.sizes[8],
                paddingVertical: theme.sizes[4],
                borderRadius: theme.sizes[4],
                backgroundColor: theme.colors.light[50],
                paddingHorizontal: theme.sizes[5],
              }}>
              <TextInput
                style={[
                  generalStyles(theme).text,
                  {
                    fontSize: 14,
                  },
                ]}
                placeholderTextColor={theme.colors.tintedGrey[500]}
                ref={firstNameInputRef}
                onFocus={() => {
                  setIsEditing(true);
                }}
                value={firstName}
                onChangeText={setFirstName}
                onEndEditing={() => {
                  setIsEditing(false);
                }}
                placeholder="First Name"
                keyboardType="default"
              />
              <Divider style={{marginVertical: theme.sizes[3]}} />
              <TextInput
                style={[
                  generalStyles(theme).text,
                  {
                    fontSize: 14,
                  },
                ]}
                placeholderTextColor={theme.colors.tintedGrey[500]}
                ref={lastNameInputRef}
                onFocus={() => {
                  setIsEditing(true);
                }}
                value={lastName}
                onChangeText={setLastName}
                onEndEditing={() => {
                  setIsEditing(false);
                }}
                placeholder="Last Name"
                keyboardType="default"
              />
            </View>
            {/* relationship */}
            <View
              style={{
                marginTop: theme.sizes[8],
                paddingHorizontal: theme.sizes[5],
                paddingVertical: theme.sizes[4],
                borderRadius: theme.sizes[4],
                backgroundColor: theme.colors.light[50],
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[generalStyles(theme).text, {fontSize: 14}]}>
                Relationship
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('Select Relationship');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: theme.fonts.main,
                    color: theme.colors.tintedGrey[600],
                    marginRight: theme.sizes[1],
                  }}>
                  {relationship}
                </Text>
                <SimpleLineIcon
                  name="arrow-right"
                  size={11}
                  color={theme.colors.tintedGrey[600]}
                />
              </Pressable>
            </View>
            <Text
              style={{
                marginTop: theme.sizes[2],
                paddingHorizontal: theme.sizes[5],
                color: theme.colors.tintedGrey[600],
              }}>
              Relationship between the contact and the recipient is required
            </Text>
            {/* phone numbers */}

            <ContactMethodEntryList method={ContactMethod.Phone} />
            <Text
              style={{
                marginTop: theme.sizes[2],
                paddingHorizontal: theme.sizes[5],
                color: theme.colors.tintedGrey[600],
              }}>
              At least 1 contact number needs to be added
            </Text>

            {/* emails */}
            <ContactMethodEntryList method={ContactMethod.Email} />
          </ScrollView>
        </ContactContext.Provider>
      </EditingStateContext.Provider>
    </KeyboardAvoidingView>
  );
};

export {AddEditContactModal};
