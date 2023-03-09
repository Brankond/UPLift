// external dependencies
import {memo, useContext, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

// internal dependencies
import {ThemeContext} from 'contexts';
import {typography, layout} from 'features/global/globalStyles';
import {generalStyles} from 'features/global/authentication/authStyles';
import {ActionButton, TextField, Divider} from 'components';
import {InputAppearance, FieldType} from 'components/TextField/TextField';
import {selectRecipients} from 'store/slices/recipientsSlice';
import sizes from 'native-base/lib/typescript/theme/base/sizes';

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
      padding: 16,
    },
    avatarContainer: {
      height: 48,
      width: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.tintedGrey[300],
    },
  });

  // states
  const [recipientId, setRecipientId] = useState<string>('');
  const [focusedField, setFocusedField] = useState<FieldType>(FieldType.None);

  // redux
  const recipients = useSelector(selectRecipients);

  const avatarPlaceHolderXml = `<?xml version="1.0" ?><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title/><circle cx="12" cy="8" fill=${theme.colors.light[100]} r="4"/><path d="M20,19v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V19a6,6,0,0,1,6-6h4A6,6,0,0,1,20,19Z" fill=${theme.colors.light[100]}/></svg>`;

  const recipientList = recipients.map((recipient, index) => (
    <View key={recipient.id}>
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
      {index !== recipients.length - 1 && (
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
      <View
        style={[
          {
            paddingHorizontal: 24,
            flex: 1,
            justifyContent: 'center',
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
            {textAlign: 'center', marginBottom: 16},
          ]}>
          Select and enter the view of the intended recipient to enter
        </Text>
        {/* recipient list */}
        <View style={[styles.recipientListContainer]}>
          <ScrollView>{recipientList}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
});

export {RecipientVerification};
