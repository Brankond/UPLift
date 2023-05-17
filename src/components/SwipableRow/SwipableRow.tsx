// external dependencies
import {useContext, useMemo} from 'react';
import {Animated, Pressable, Image, Text, View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {Swipeable, RectButton} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from 'contexts';
import {generalStyles} from 'features/global/authentication/authStyles';
import {Divider} from 'components';
import {Recipient, recipientRemoved} from 'store/slices/recipientsSlice';
import {
  selectCollectionIdsByRecipientId,
  manyCollectionsRemoved,
  selectCollectionsByRecipientId,
} from 'store/slices/collectionsSlice';
import {
  selectSetsByRecipientId,
  selectSetIdsByRecipientId,
  manySetsRemoved,
} from 'store/slices/setsSlice';
import {
  selectContactIdsByRecipientId,
  manyContactsRemoved,
} from 'store/slices/emergencyContactsSlice';
import {CollectionNames, removeDocuments} from 'services/fireStore';
import {removeAsset, removeAssets} from 'services/cloudStorage';
import {useAppSelector} from 'hooks';

interface SwipeableRowProps {
  isEditable: boolean;
  recipient: Recipient;
  onItemPress: () => void;
  isEditing?: boolean;
  tick?: React.ReactNode;
}

const SwipeableRow = ({
  isEditable,
  isEditing,
  recipient,
  onItemPress,
  tick,
}: SwipeableRowProps) => {
  // context values
  const {theme} = useContext(ThemeContext);
  const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcon);

  // redux
  const dispatch = useDispatch();
  const collectionIds = useSelector(
    selectCollectionIdsByRecipientId(recipient.id),
  );
  const collections = useAppSelector(
    selectCollectionsByRecipientId(recipient.id),
  );
  const setIds = useSelector(selectSetIdsByRecipientId(recipient.id));
  const sets = useAppSelector(selectSetsByRecipientId(recipient.id));
  const contactIds = useSelector(selectContactIdsByRecipientId(recipient.id));

  // states
  const photoUrl = useMemo(() => recipient.photo.url, [recipient.photo.url]);

  // gesture handler
  const renderRightActions = (
    _: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
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
        onPress={async () => {
          // remove data from firestore
          removeDocuments(contactIds, CollectionNames.Contacts);
          removeDocuments([recipient.id], CollectionNames.Recipients);
          removeDocuments(setIds, CollectionNames.Sets);
          removeDocuments(collectionIds, CollectionNames.Categories);

          // remove data from cloud storage
          await removeAsset(recipient.photo.cloudStoragePath);
          const setsAssetsCloudStoragePaths: string[] = [];
          for (const set of sets) {
            setsAssetsCloudStoragePaths.push(set.image.cloudStoragePath);
            setsAssetsCloudStoragePaths.push(set.audio.cloudStoragePath);
          }
          await removeAssets(setsAssetsCloudStoragePaths);
          const collectionsCoversCloudStoragePaths: string[] = [];
          for (const collection of collections) {
            collectionsCoversCloudStoragePaths.push(
              collection.cover.cloudStoragePath,
            );
          }
          await removeAssets(collectionsCoversCloudStoragePaths);

          // remove data from store
          dispatch(recipientRemoved(recipient.id));
          dispatch(manyCollectionsRemoved(collectionIds));
          dispatch(manySetsRemoved(setIds));
          dispatch(manyContactsRemoved(contactIds));
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

  // styles
  const styles = StyleSheet.create({
    /** utilities */
    row_centered_flex_box: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return isEditable ? (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        return renderRightActions(progress, dragX);
      }}
      friction={2}
      key={recipient.id}>
      <Pressable
        style={{
          backgroundColor: theme.colors.light[50],
        }}
        onPress={() => {
          onItemPress();
        }}>
        <View
          style={{
            ...styles.row_centered_flex_box,
            marginTop: 20,
            marginBottom: 28,
          }}>
          {/* avatar */}
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              backgroundColor: theme.colors.tintedGrey[300],
            }}>
            {photoUrl.length > 0 && (
              <Image
                source={{uri: photoUrl}}
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
            {/* name */}
            <Text
              style={[
                generalStyles(theme).text,
                {
                  fontSize: 14,
                  fontWeight: theme.fontWeights.semibold,
                  textTransform: 'capitalize',
                },
              ]}>
              {`${recipient.firstName} ${recipient.lastName}`}
            </Text>
            {/* location */}
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
                style={[
                  generalStyles(theme).text,
                  {
                    fontWeight: theme.fontWeights.semibold,
                    fontSize: 12,
                  },
                ]}>
                at
              </Text>
              <Text
                style={[
                  generalStyles(theme).text,
                  {
                    fontSize: 12,
                    marginLeft: theme.sizes['1.5'],
                  },
                ]}>
                {recipient.location}
              </Text>
            </View>
          </View>
          {isEditing && tick}
        </View>
        <Divider
          style={{
            marginVertical: 0,
          }}
        />
      </Pressable>
    </Swipeable>
  ) : (
    <Pressable
      style={{
        backgroundColor: theme.colors.light[50],
      }}
      onPress={() => {
        onItemPress();
      }}>
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
            backgroundColor: theme.colors.tintedGrey[300],
          }}>
          {photoUrl.length > 0 && (
            <Image
              source={{uri: photoUrl}}
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
            style={[
              generalStyles(theme).text,
              {
                fontSize: 14,
                fontWeight: theme.fontWeights.semibold,
                textTransform: 'capitalize',
              },
            ]}>
            {`${recipient.firstName} ${recipient.lastName}`}
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
              style={[
                generalStyles(theme).text,
                {
                  fontSize: 12,
                  fontWeight: theme.fontWeights.semibold,
                },
              ]}>
              at
            </Text>
            <Text
              style={[
                generalStyles(theme).text,
                {
                  fontSize: 12,
                  marginLeft: theme.sizes['1.5'],
                },
              ]}>
              {recipient.location}
            </Text>
          </View>
        </View>
      </View>
      <Divider
        style={{
          marginVertical: 0,
        }}
      />
    </Pressable>
  );
};

export {SwipeableRow};
