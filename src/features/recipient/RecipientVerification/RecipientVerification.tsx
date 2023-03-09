// external dependencies
import {memo, useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import IonIcon from 'react-native-vector-icons/Ionicons';

// internal dependencies
import {ThemeContext} from 'contexts';
import {typography, layout} from 'features/global/globalStyles';
import {generalStyles} from 'features/global/authentication/authStyles';
import {Divider, SearchBar} from 'components';
import {Recipient, selectRecipients} from 'store/slices/recipientsSlice';

const RecipientVerification = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  // styles
  const styles = StyleSheet.create({
    recipientListContainer: {
      maxHeight: '30%',
      marginHorizontal: 16,
      borderWidth: 1.5,
      borderColor: theme.colors.primary[400],
      borderRadius: 24,
    },
    avatarContainer: {
      height: 48,
      width: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.tintedGrey[300],
    },
  });

  // redux
  const recipients = useSelector(selectRecipients);

  // states
  const [searchText, setSearchText] = useState('');
  const [recipientsForDisplay, setRecipientsForDisplay] =
    useState<Recipient[]>(recipients);

  // effects
  // filter recipients based on searchtext
  useEffect(() => {
    const filteredRecipients = recipients.filter(
      ({first_name, last_name}) =>
        first_name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        last_name.toLowerCase().includes(searchText.toLowerCase().trim()),
    );
    // only update recipientsForDisplay when
    if (
      filteredRecipients.length === recipientsForDisplay.length &&
      filteredRecipients.every(
        ({id}, idx) => id === recipientsForDisplay[idx].id,
      )
    ) {
      return;
    }
    setRecipientsForDisplay(filteredRecipients);
  }, [searchText]);

  const avatarPlaceHolderXml = `<?xml version="1.0" ?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><circle cx="12" cy="8" fill=${theme.colors.light[100]} r="4"/><path d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z" fill=${theme.colors.light[100]}/></svg>`;

  const recipientsForDisplayListEmptyFallBack = (
    <Text style={[typography(theme).lgSecondaryText, {textAlign: 'center'}]}>
      No mathing result
    </Text>
  );

  const recipientListEmptyFallBack = (
    <Text style={[typography(theme).lgSecondaryText, {textAlign: 'center'}]}>
      No recipient registered
    </Text>
  );

  const recipientList = recipientsForDisplay.map((recipient, index) => (
    <View
      key={recipient.id}
      style={[
        {
          paddingHorizontal: 16,
          paddingTop: index === 0 ? 16 : undefined,
          paddingBottom: index === recipientsForDisplay.length - 1 ? 16 : 0,
        },
      ]}>
      <View style={[layout(theme).rowSpaceBetween]}>
        <View style={[layout(theme).rowSpaceBetween]}>
          {/* avatar */}
          <View style={[layout(theme).centered, styles.avatarContainer]}>
            {recipient.avatar.length > 0 ? (
              <Image
                source={{uri: recipient.avatar}}
                style={{width: '100%', height: '100%', borderRadius: 24}}
              />
            ) : (
              <SvgXml xml={avatarPlaceHolderXml} width={'70%'} height={'70%'} />
            )}
          </View>
          {/* name */}
          <Text
            style={[
              typography(theme).lgBodyTextDark,
              {fontWeight: theme.fontWeights.semibold, marginLeft: 16},
            ]}>
            {`${recipient.first_name} ${recipient.last_name}`}
          </Text>
        </View>
        <IonIcon
          name="ios-arrow-forward-circle"
          color={theme.colors.primary[400]}
          size={24}
        />
      </View>
      {index !== recipientsForDisplay.length - 1 && (
        <Divider
          style={[
            {
              marginVertical: 16,
            },
          ]}
        />
      )}
    </View>
  ));

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[{flex: 1}]}>
        <View
          style={[
            {
              justifyContent: 'center',
              paddingHorizontal: 24,
              flex: 1,
            },
          ]}>
          {/* heading */}
          <Text
            style={[
              typography(theme).mdHeadingText,
              {
                textAlign: 'center',
                marginBottom: 12,
              },
            ]}>
            Welcome!
          </Text>
          {/* desc */}
          <Text
            style={[
              typography(theme).smSecondaryText,
              {textAlign: 'center', marginBottom: 24},
            ]}>
            Select and enter the view of the intended recipient to enter
          </Text>
          <SearchBar
            containerStyle={{
              borderRadius: 20,
              padding: 8,
              marginHorizontal: 16,
              marginBottom: 12,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
          {/* recipient list */}
          <View style={[styles.recipientListContainer]}>
            {recipientList.length > 0 ? (
              recipientsForDisplay.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {recipientList}
                </ScrollView>
              ) : (
                recipientsForDisplayListEmptyFallBack
              )
            ) : (
              recipientListEmptyFallBack
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export {RecipientVerification};
