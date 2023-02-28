// external dependencies
import {useContext} from 'react';
import {useSelector} from 'react-redux';
import {Text, FlatList} from 'react-native';

// internal dependencies
import {CaregiverBottomTabNavigatorProps} from 'screens/navigation-types';
import {ThemeContext} from 'contexts';
import {Header, SafeAreaContainer, SwipeableRow} from 'components';
import {selectRecipients} from 'store/slices/recipientsSlice';
import {useNavigation} from '@react-navigation/native';

// swipeable component handlers
const unEditableSwipeableRowOnPress = (
  navigation: CaregiverBottomTabNavigatorProps['navigation'],
  recipient_id: string,
  recipient_first_name: string,
) => {
  navigation.navigate('Image to Speech', {
    screen: 'Collection Selection',
    params: {
      recipient_id,
      recipient_first_name,
    },
  });
};

const RecipientSelection = () => {
  const parentNav =
    useNavigation<CaregiverBottomTabNavigatorProps['navigation']>();
  const {theme} = useContext(ThemeContext);

  // redux
  const recipients = useSelector(selectRecipients);

  return (
    <SafeAreaContainer
      child={
        <>
          <Header title={'recipients'} />
          {recipients.length > 0 ? (
            <FlatList
              data={recipients}
              renderItem={({item}) => (
                <SwipeableRow
                  isEditable={false}
                  recipient={item}
                  onItemPress={() => {
                    unEditableSwipeableRowOnPress(
                      parentNav,
                      item.id,
                      item.first_name,
                    );
                  }}
                />
              )}
            />
          ) : (
            <Text
              style={{
                flex: 1,
                fontSize: theme.sizes[3],
                color: theme.colors.warmGray[400],
                textAlign: 'center',
              }}>
              No Recipient
            </Text>
          )}
        </>
      }
    />
  );
};

export {RecipientSelection};
