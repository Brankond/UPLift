// external dependencies
import {useContext, useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {RecipientSelectionProps} from 'screens/navigation-types';
import {ThemeContext} from 'contexts';
import {
  Header,
  Divider,
  SafeAreaContainer,
  HeaderEditToolBar,
  AnimatedDeleteButton,
  TickSelection,
} from 'components';
import {
  selectRecipients,
  recipientRemoved,
  manyRecipientsRemoved,
} from 'store/slices/recipientsSlice';
import {
  selectCollectionIdsByRecipientId,
  selectCollectionIdsByRecipientIds,
  manyCollectionsRemoved,
} from 'store/slices/collectionsSlice';
import {
  selectSetIdsByRecipientId,
  selectSetIdsByRecipientIds,
  manySetsRemoved,
} from 'store/slices/setsSlice';
import {Recipient} from 'store/slices/recipientsSlice';

interface SwipeableRowProps {
  isEditing: boolean;
  recipient: Recipient;
  navigation: RecipientSelectionProps['navigation'];
  selectedRecipients: string[];
  setSelectedRecipients: React.Dispatch<React.SetStateAction<string[]>>;
}

const SwipeableRow = ({
  recipient,
  navigation,
  isEditing,
  selectedRecipients,
  setSelectedRecipients,
}: SwipeableRowProps) => {
  const {theme} = useContext(ThemeContext);
  const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcon);
  const dispatch = useDispatch();
  const collectionIds = useSelector(
    selectCollectionIdsByRecipientId(recipient.id),
  );
  const setIds = useSelector(selectSetIdsByRecipientId(recipient.id));

  const renderRightActions = (
    _: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
    id: string,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
    });
    return (
      <RectButton
        style={{
          backgroundColor: theme.colors.danger[500],
          paddingHorizontal: theme.sizes[8],
          justifyContent: 'center',
        }}
        onPress={() => {
          dispatch(recipientRemoved(id));
          dispatch(manyCollectionsRemoved(collectionIds));
          dispatch(manySetsRemoved(setIds));
        }}>
        <AnimatedIcon
          name="delete"
          color={theme.colors.light[50]}
          size={theme.sizes[6]}
          style={{
            transform: [{scale: scale}],
          }}
        />
      </RectButton>
    );
  };

  const styles = StyleSheet.create({
    /** utilities */
    row_centered_flex_box: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        return renderRightActions(progress, dragX, recipient.id);
      }}
      friction={2}
      key={recipient.id}>
      <Pressable
        style={{
          backgroundColor: theme.colors.light[50],
        }}
        onLongPress={() => {
          navigation.navigate('Add Recipient', {recipient_id: recipient.id});
        }}
        onPress={
          isEditing
            ? () => {
                if (!selectedRecipients.includes(recipient.id)) {
                  setSelectedRecipients([...selectedRecipients, recipient.id]);
                } else {
                  setSelectedRecipients(
                    selectedRecipients.filter(id => id !== recipient.id),
                  );
                }
              }
            : () => {
                navigation.navigate('Collection Selection', {
                  recipient_id: recipient.id,
                  recipient_first_name: recipient.first_name,
                });
              }
        }>
        <View
          style={{
            ...styles.row_centered_flex_box,
            marginTop: 20,
            marginBottom: 28,
          }}>
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.warmGray[300],
            }}>
            {recipient.avatar.length > 0 && (
              <Image
                source={{uri: recipient.avatar}}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 24,
                }}
              />
            )}
          </View>
          <View
            style={{
              marginLeft: 16,
            }}>
            <Text
              style={{
                fontWeight: theme.fontWeights.semibold,
                textTransform: 'capitalize',
              }}>
              {`${recipient.first_name} ${recipient.last_name}`}
            </Text>
            <View
              style={{
                ...styles.row_centered_flex_box,
                marginTop: 7,
              }}>
              <MaterialIcon
                name="location-on"
                color={theme.colors.primary[400]}
              />
              <Text
                style={{
                  fontWeight: theme.fontWeights.semibold,
                  fontSize: theme.fontSizes.xs,
                }}>
                at
              </Text>
              <Text
                style={{
                  fontSize: theme.fontSizes.xs,
                  marginLeft: theme.sizes['1.5'],
                }}>
                {recipient.location}
              </Text>
            </View>
          </View>
          {isEditing && (
            <TickSelection
              ticked={selectedRecipients.includes(recipient.id)}
              style={{
                borderColor: theme.colors.warmGray[300],
                top: '50%',
                transform: [{translateY: -theme.sizes[2]}],
              }}
            />
          )}
        </View>
        <Divider
          style={{
            marginVertical: 0,
          }}
        />
      </Pressable>
    </Swipeable>
  );
};

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
  const {theme} = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const initialRecipients: string[] = [];
  const [selectedRecipients, setSelectedRecipients] =
    useState(initialRecipients);

  // animation
  const opacity_scale = useRef(new Animated.Value(0)).current;
  const opacity_scale_reversed = useRef(
    Animated.subtract(1, opacity_scale),
  ).current;

  const enterAnim = Animated.timing(opacity_scale, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  });

  const exitAnim = Animated.timing(opacity_scale, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
  });

  // onload effect
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderEditToolBar
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          itemsNumber={selectedRecipients.length}
          itemType="Recipient"
          enterAnim={enterAnim}
          exitAnim={exitAnim}
          opacity_scale={opacity_scale}
          opacity_scale_reversed={opacity_scale_reversed}
          addButtonOnPress={() => {
            navigation.navigate('Add Recipient', {recipient_id: undefined});
          }}
        />
      ),
    });
  });

  // redux
  const dispatch = useDispatch();
  const recipients = useSelector(selectRecipients);
  const collections = useSelector(
    selectCollectionIdsByRecipientIds(selectedRecipients),
  );
  const sets = useSelector(selectSetIdsByRecipientIds(selectedRecipients));

  const deleteSelectedRecipients = (
    collectionIds: string[],
    setIds: string[],
    recipientIds: string[],
  ) => {
    dispatch(manyRecipientsRemoved(recipientIds));
    dispatch(manySetsRemoved(setIds));
    dispatch(manyCollectionsRemoved(collectionIds));
    setSelectedRecipients([]);
  };

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
                  recipient={item}
                  navigation={navigation}
                  selectedRecipients={selectedRecipients}
                  setSelectedRecipients={setSelectedRecipients}
                  isEditing={isEditing}
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

          {isEditing && (
            <AnimatedDeleteButton
              editButtonAnim={opacity_scale}
              onPress={() => {
                deleteSelectedRecipients(collections, sets, selectedRecipients);
              }}
            />
          )}
        </>
      }
    />
  );
};

export {RecipientSelection};
