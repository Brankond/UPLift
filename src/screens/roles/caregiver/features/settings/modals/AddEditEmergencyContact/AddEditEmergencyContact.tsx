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
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {v4} from 'uuid';
import {useHeaderHeight} from '@react-navigation/elements';

// internal dependencies
import {ThemeContext} from 'contexts';
import {AddContactModalProps} from 'screens/navigation-types';
import {SaveButton, Divider} from 'components';
import {useAppDispatch, useAppSelector} from 'hooks';
import {selectContactById} from 'store/slices/emergencyContactsSlice';
import {Relationship} from './relationships';
import {contactAdded} from 'store/slices/emergencyContactsSlice';

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
  firstName: string;
  lastName: string;
  contactNumbers: string[];
  setContactNumbers: React.Dispatch<React.SetStateAction<string[]>>;
  emails: string[];
  setEmails: React.Dispatch<React.SetStateAction<string[]>>;
  relationship: Relationship;
  setRelationship: React.Dispatch<React.SetStateAction<Relationship>>;
};
const ContactContext = createContext<ContactContextType | null>(null);

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

    const [entryValue, setEntryValue] = useState<string>(value);

    useEffect(() => {
      setEntryValue(value);
    }, [value]);

    return contactMethodEntries && setContactMethodEntries ? (
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
            keyboardType={
              method === ContactMethod.Email ? 'email-address' : 'phone-pad'
            }
            style={{
              flex: 1,
              marginLeft: theme.sizes[5],
            }}
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
          />
        </View>
        <Divider style={{marginVertical: 0}} />
      </>
    ) : (
      <></>
    );
  },
);

const ContactMethodEntryList = memo(({method}: {method: ContactMethod}) => {
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
  return contactMethodEntries && setContactMethodEntries ? (
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={{
        backgroundColor: theme.colors.light[50],
        marginHorizontal: theme.sizes['3.5'],
        marginTop: theme.sizes[8],
        borderRadius: theme.sizes[4],
      }}
      data={contactMethodEntries}
      renderItem={({item, index}) => (
        <ContactMethodEntryItem
          method={method}
          value={item}
          index={index}
          key={index}
        />
      )}
      ItemSeparatorComponent={_ => <Divider style={{marginVertical: 0}} />}
      ListFooterComponent={_ => (
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
              style={{
                flex: 1,
                marginLeft: theme.sizes[5],
              }}>
              {method === ContactMethod.Email ? 'Add Email' : 'Add Number'}
            </Text>
          </View>
        </>
      )}
    />
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
  const [relationship, setRelationship] = useState<Relationship>(
    contact?.relationship || Relationship.NotSet,
  );

  const firstNameInputRef = useRef<TextInput>(null);
  const lastNameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (contactId && 'Edit Contact') || 'Add Contact',
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
            }}
          />
        ),
    });
  }, [contactId, firstName, lastName, contactNumbers, emails, relationship]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight}>
      <ContactContext.Provider
        value={{
          firstName,
          lastName,
          contactNumbers,
          setContactNumbers,
          emails,
          setEmails,
          relationship,
          setRelationship,
        }}>
        {/* names */}
        <View
          style={{
            marginTop: theme.sizes[8],
            marginHorizontal: theme.sizes['3.5'],
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
        </View>
        {/* relationship */}
        <View
          style={{
            marginTop: theme.sizes[8],
            marginHorizontal: theme.sizes['3.5'],
            paddingHorizontal: theme.sizes[5],
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text>Relationship</Text>
          <Pressable>
            <SimpleLineIcon
              name="arrow-right"
              size={11}
              color={theme.colors.warmGray[500]}
            />
          </Pressable>
        </View>
        {/* phone numbers */}

        <ContactMethodEntryList method={ContactMethod.Phone} />

        {/* emails */}
        <ContactMethodEntryList method={ContactMethod.Email} />
      </ContactContext.Provider>
    </KeyboardAvoidingView>
  );
};

export {AddEditContactModal};
