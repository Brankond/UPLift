// external dependencies
import {View, Text, SafeAreaView, TextInput, Pressable} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import 'react-native-get-random-values';
import {v4} from 'uuid';

// internal dependencies
import {AddRecipientModalProps} from 'screens/navigation-types';
import {Divider, SaveButton} from 'components';
import {ThemeContext} from 'contexts';
import {recipientAdded} from 'store/slices/recipientsSlice';
import {useHideBottomTab} from 'hooks/useHideBottomTab';

const AddRecipientModal = ({navigation, route}: AddRecipientModalProps) => {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthDay] = useState('');

  const addRecipient = (firstName: string, lastName: string, birthday: string) => {
    dispatch(recipientAdded({
      id: v4(),
      caregiver_id: '1',
      first_name: firstName,
      last_name: lastName,
      date_of_birth: birthday,
      location: '4221 West Side Avenue',
      is_fallen: false,
      collection_count: 0
    }))
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Recipient',
      headerRight: () => <SaveButton 
        onPress={() => {
          addRecipient(firstName, lastName, birthday);
          navigation.goBack();
        }}
      />
    });
  });

  useHideBottomTab();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center'
      }}
    >
      <View
        style={{
          height: theme.sizes[40],
          width: theme.sizes[40],
          backgroundColor: theme.colors.warmGray[300],
          borderRadius: theme.sizes[20],
          marginTop: theme.sizes[8]
        }}
      >
      </View>
      <Pressable
        style={{
          marginTop: theme.sizes[3],
          marginBottom: theme.sizes[6]
        }}
      >
        <Text
          style={{
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400]
          }}
        >
          Add Photo
        </Text>
      </Pressable>
      <View
        style={{
          width: '100%',
          paddingHorizontal: theme.sizes['3.5']
        }}
      >
        <View
          style={{
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: theme.sizes[5]
          }}
        >
          <TextInput 
            value={firstName}
            onChangeText={setFirstName}
            placeholder='First Name'
            keyboardType='default'
          />
          <Divider style={{marginVertical: theme.sizes[3]}}/>
          <TextInput 
            value={lastName}
            onChangeText={setLastName}
            placeholder='Last Name'
            keyboardType='default'
          />
          <Divider style={{marginVertical: theme.sizes[3]}}/>
          <TextInput 
            value={birthday}
            onChangeText={setBirthDay}
            placeholder='Birthday'
            keyboardType='default'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export {AddRecipientModal};