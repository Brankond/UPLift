// external dependencies
import {useContext} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Text, View, Pressable, StyleSheet, FlatList} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// internal dependencies
import {RecipientSelectionProps} from "screens/navigation-types";
import {ThemeContext} from "contexts";
import {Header, Divider, SafeAreaContainer} from "components";
import {selectRecipients, recipientAdded, allRecipientsRemoved} from "store/slices/recipientsSlice";

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
    const {theme} = useContext(ThemeContext);
    const recipients = useSelector(selectRecipients);
    const dispatch = useDispatch();

    const new_recipient_id = `${recipients.length + 1}`;

    const styles = StyleSheet.create({
        /** utilities */
        row_centered_flex_box: {
            flexDirection: 'row',
            alignItems: 'center'
        }
    });

    return (
        <SafeAreaContainer 
            child={
                <>
                    <Header
                        title={'recipients'} 
                    />

                    <FlatList 
                        data={recipients}
                        renderItem={
                            ({item}) => (
                                <Pressable 
                                    key={item.id}
                                    onPress={() => {
                                        navigation.navigate('Collection Selection',{recipient_id: item.id, recipient_name: item.name})
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
                                                    fontWeight: theme.fontWeights.semibold
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                            <View
                                                style={{
                                                    ...styles.row_centered_flex_box,
                                                    marginTop: 7
                                                }}
                                            >
                                                <MaterialIcons 
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
                                                    {item.location}
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
                            )
                        }
                    />

                    {/* test redux */}
                    <Pressable
                        onPress={() => {
                            dispatch(recipientAdded({
                                id: new_recipient_id,
                                caregiver_id: '1',
                                name: 'Jack',
                                date_of_birth: '2001-02-20',
                                location: '4221 West Side Avenue',
                                is_fallen: false,
                                collection_count: 0
                            }))
                        }}
                    >
                        <Text>
                            Add a recipient
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            dispatch(allRecipientsRemoved())
                        }}
                    >
                        <Text>
                            Remove all recipients
                        </Text>
                    </Pressable>
                </>
            }
        />
    );
};

export {RecipientSelection};