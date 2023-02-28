// external dependencies
import {useContext, useEffect, useState, useRef, memo} from 'react';
import {
  Pressable,
  Text,
  SafeAreaView,
  View,
  TextInput,
  FlatList,
} from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {ThemeContext} from 'contexts';
import {AddContactModalProps} from 'screens/navigation-types';
import {SaveButton, Divider} from 'components';
import {useAppSelector} from 'hooks';
import {selectContactById} from 'store/slices/emergencyContactsSlice';
import {Relationship} from './relationships';

const PhoneNumberItem = memo(({number}: {number: string}) => {
  return <></>;
});
const PhoneNumberList = memo(({numbers}: {numbers: string[]}) => {
  return <></>;
});

const AddEditContactModal = ({navigation, route}: AddContactModalProps) => {
  const {theme} = useContext(ThemeContext);

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
              navigation.goBack();
            }}
          />
        ),
    });
  }, [contactId]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
          onPress={() => {}}>
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
          Add Number
        </Text>
      </View>
      {/* emails */}
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
          onPress={() => {}}>
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
          Add Email
        </Text>
      </View>
    </SafeAreaView>
  );
};

export {AddEditContactModal};
