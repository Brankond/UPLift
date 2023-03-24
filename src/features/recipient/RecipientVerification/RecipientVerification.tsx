// external dependencies
import {memo, useContext, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  Platform,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import IonIcon from 'react-native-vector-icons/Ionicons';

// internal dependencies
import {RecipientVerificationProps} from 'navigators/navigation-types';
import {ThemeContext} from 'contexts';
import {typography, layout} from 'features/global/globalStyles';
import {generalStyles} from 'features/global/authentication/authStyles';
import {Divider, SearchBar} from 'components';
import {Recipient, selectRecipients} from 'store/slices/recipientsSlice';

const RecipientListItem = memo(
  ({
    recipient,
    isFirst,
    isLast,
  }: {
    recipient: Recipient;
    isFirst: boolean;
    isLast: boolean;
  }) => {
    // context values
    const {theme} = useContext(ThemeContext);

    // styles
    const styles = StyleSheet.create({
      avatarContainer: {
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.tintedGrey[300],
      },
    });

    // navigation
    const navigation =
      useNavigation<RecipientVerificationProps['navigation']>();

    // avatar placeholder
    const avatarPlaceHolderXml = `<?xml version="1.0" ?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><circle cx="12" cy="8" fill=${theme.colors.light[100]} r="4"/><path d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z" fill=${theme.colors.light[100]}/></svg>`;

    return (
      <View
        style={[
          {
            paddingHorizontal: 16,
            paddingTop: isFirst ? 16 : undefined,
            paddingBottom: isLast ? 16 : 0,
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
                <SvgXml
                  xml={avatarPlaceHolderXml}
                  width={'70%'}
                  height={'70%'}
                />
              )}
            </View>
            {/* name */}
            <Text
              style={[
                typography(theme).lgBodyTextDark,
                {fontWeight: theme.fontWeights.semibold, marginLeft: 16},
              ]}>
              {`${recipient.firstName} ${recipient.lastName}`}
            </Text>
          </View>
          {/* redirect button */}
          <Pressable
            // navigate to the corresponding recipient view
            onPress={() => {
              navigation.navigate('Recipient View', {
                recipientId: recipient.id,
              });
            }}>
            <IonIcon
              name="ios-arrow-forward-circle"
              color={theme.colors.primary[400]}
              size={24}
            />
          </Pressable>
        </View>
        {!isLast && (
          <Divider
            style={[
              {
                marginVertical: 16,
              },
            ]}
          />
        )}
      </View>
    );
  },
);

const RecipientList = memo(({recipients}: {recipients: Recipient[]}) => {
  return (
    <FlatList
      data={recipients}
      renderItem={({item, index}) => (
        <RecipientListItem
          recipient={item}
          isFirst={index === 0}
          isLast={index === recipients.length - 1}
          key={index}
        />
      )}
    />
  );
});

const NoMatchingSearchResultFallBack = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  return (
    <Text
      style={[
        typography(theme).lgSecondaryText,
        {textAlign: 'center', padding: 16},
      ]}>
      No mathing result
    </Text>
  );
});

const NoRecipientFallBack = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  return (
    <Text
      style={[
        typography(theme).lgSecondaryText,
        {textAlign: 'center', padding: 16},
      ]}>
      No recipient registered
    </Text>
  );
});

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
      ({firstName, lastName}) =>
        firstName.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        lastName.toLowerCase().includes(searchText.toLowerCase().trim()),
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

  return (
    <SafeAreaView style={[generalStyles(theme).bodyContainer]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[{flex: 1, paddingHorizontal: 24, justifyContent: 'center'}]}>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
          }}>
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
              marginHorizontal: 16,
              marginBottom: 12,
            }}
            searchBoxStyle={{
              borderRadius: 20,
              padding: 8,
            }}
            value={searchText}
            onChangeText={setSearchText}
          />
        </Pressable>
        {/* recipient list */}
        <View style={[styles.recipientListContainer]}>
          {recipients.length > 0 ? (
            recipientsForDisplay.length > 0 ? (
              <RecipientList recipients={recipientsForDisplay} />
            ) : (
              <NoMatchingSearchResultFallBack />
            )
          ) : (
            <NoRecipientFallBack />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export {RecipientVerification};
