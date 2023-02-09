// external dependencies
import {useContext, useEffect, useRef} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Text, View, Pressable, StyleSheet, FlatList, Animated} from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RectButton} from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// internal dependencies
import {RecipientSelectionProps} from "screens/navigation-types";
import {ThemeContext} from "contexts";
import {Header, Divider, SafeAreaContainer, AddButton} from "components";
import {selectRecipients, recipientRemoved, selectRecipientById} from "store/slices/recipientsSlice";
import {selectCollectionIdsByRecipientId, manyCollectionsRemoved} from "store/slices/collectionsSlice";
import {selectSetIdsByRecipientId, manySetsRemoved} from "store/slices/setsSlice";
import {Recipient} from "store/slices/recipientsSlice";

interface SwipeableRowProps {
    recipient: Recipient,
    navigation: RecipientSelectionProps['navigation']
}

const SwipeableRow = ({recipient, navigation}: SwipeableRowProps) => {
    const {theme} = useContext(ThemeContext);
    const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcon);
    const dispatch = useDispatch();
    const collectionIds = useSelector(selectCollectionIdsByRecipientId(recipient.id));
    const setIds = useSelector(selectSetIdsByRecipientId(recipient.id));

    const renderRightActions = (_: Animated.AnimatedInterpolation<string | number>, dragX: Animated.AnimatedInterpolation<string | number>, id: string) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
        });
        return (
            <RectButton 
                style={{
                    backgroundColor: theme.colors.danger[500],
                    paddingHorizontal: theme.sizes[8],
                    justifyContent: 'center'
                }}
                onPress={() => {
                    dispatch(recipientRemoved(id))
                    dispatch(manyCollectionsRemoved(collectionIds));
                    dispatch(manySetsRemoved(setIds));
                }}
            >
                <AnimatedIcon 
                    name='delete'
                    color={theme.colors.light[50]}
                    size={theme.sizes[6]}
                    style={{
                        transform: [{scale: scale}]
                    }}
                />
            </RectButton>
        );
    };

    const styles = StyleSheet.create({
        /** utilities */
        row_centered_flex_box: {
            flexDirection: 'row',
            alignItems: 'center'
        }
    });

    return(
        <Swipeable
            renderRightActions={(progress, dragX) => {return renderRightActions(progress, dragX, recipient.id)}}
            friction={2}
            key={recipient.id}
        >
            <Pressable 
                style={{
                    backgroundColor: theme.colors.light[50]
                }}
                onPress={() => {
                    navigation.navigate('Collection Selection',{recipient_id: recipient.id, recipient_first_name: recipient.first_name})
                }}    
            >
                    <View
                        style={{
                            ...styles.row_centered_flex_box,
                            marginTop: 20,
                            marginBottom: 28
                        }}
                    >   
                        <View
                            style={{
                                height: 48,
                                width: 48,
                                borderRadius: 24,
                                backgroundColor: theme.colors.warmGray[300]
                            }}
                        >
                        </View>
                        <View
                            style={{
                                marginLeft: 16
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: theme.fontWeights.semibold,
                                    textTransform: 'capitalize'
                                }}
                            >
                                {`${recipient.first_name} ${recipient.last_name}`}
                            </Text>
                            <View
                                style={{
                                    ...styles.row_centered_flex_box,
                                    marginTop: 7
                                }}
                            >
                                <MaterialIcon 
                                    name='location-on'
                                    color={theme.colors.primary[400]}
                                />
                                <Text
                                    style={{
                                        fontWeight: theme.fontWeights.semibold,
                                        fontSize: theme.fontSizes.xs
                                    }}
                                >
                                    at
                                </Text>
                                <Text
                                    style={{
                                        fontSize: theme.fontSizes.xs,
                                        marginLeft: theme.sizes["1.5"]
                                    }}
                                >
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
        </Swipeable>
    )
}

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => 
                <AddButton
                    onPress={() => {
                        navigation.navigate('Add Recipient');
                    }}
                />
        })
    });

    const recipients = useSelector(selectRecipients);

    return (
        <SafeAreaContainer 
            child={
                <>
                    <Header
                        title={'recipients'} 
                    />

                    {
                        recipients.length > 0 
                        ?
                        <FlatList 
                            data={recipients}
                            renderItem={
                                ({item}) => (
                                    <SwipeableRow 
                                        recipient={item}
                                        navigation={navigation}
                                    />
                                )
                            }
                        /> 
                        :
                        <Text
                            style={{
                                flex: 1,
                                fontSize: theme.sizes[3],
                                color: theme.colors.warmGray[400],
                                textAlign: 'center'
                            }}
                        >
                            No Recipient
                        </Text>
                    }  
                </>
            }
        />
    );
};

export {RecipientSelection};