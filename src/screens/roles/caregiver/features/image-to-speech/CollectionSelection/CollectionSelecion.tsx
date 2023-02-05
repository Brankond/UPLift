// external dependencies
import {useContext} from "react";
import {Text, View, Pressable, useWindowDimensions} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import {Box} from "native-base";
import {createSelector} from "@reduxjs/toolkit";
import {useSelector, useDispatch} from "react-redux";

// internal dependencies
import {ThemeContext} from "contexts";
import {CollectionSelectionProps} from "screens/navigation-types";
import {Header, SafeAreaContainer} from "components";
import {selectCollections, collectionAdded, allCollectionsRemoved} from "store/slices/collectionsSlice";
import {recipientUpdated, selectRecipientById} from "store/slices/recipientsSlice";
import {RootState} from "store";

const CollectionSelection = ({navigation, route}: CollectionSelectionProps) => {
    const {width} = useWindowDimensions();
    const {theme} = useContext(ThemeContext);
    const grid_dimension = (width - theme.sizes[12]) / 2;
    const recipient_id = route.params.recipient_id;
    const recipient_name = route.params.recipient_name;

    const selectCollectionByRecipientId = createSelector(
        selectCollections,
        (collections) => {
            return collections.filter(collection => {
                return collection.recipient_id === recipient_id;
            })
        }
    );
    
    const recipient = useSelector((state: RootState) => selectRecipientById(state, recipient_id));
    const collections = useSelector(selectCollectionByRecipientId);
    const totalCollections = useSelector(selectCollections);
    const dispatch = useDispatch();
    const new_collection_id = `${totalCollections.length + 1}`;

    const collection_list = collections.map(({id, title, set_count, recipient_id}) => (
        <Pressable
            key={id}
            style={{
                height: grid_dimension + 26,
                width: grid_dimension,
                marginBottom: theme.sizes[2],
            }}
            onPress={() => {
                navigation.navigate('Gallery', 
                {
                    recipient_id: recipient_id,
                    recipient_name: recipient_name,
                    collection_id: id,
                    collection_title: title
                });
            }}
        >  
            <View
                style={{
                    height: grid_dimension,
                    width: '100%',
                    backgroundColor: theme.colors.warmGray[300],
                    borderRadius: 16,
                    marginBottom: theme.sizes["1.5"]
                }}
            >                              
            </View>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text
                    style={{
                        fontSize: theme.fontSizes.sm,
                        textTransform: 'capitalize'
                    }}
                >
                    {title}
                </Text>
                <Box
                    flexDirection='row'
                    alignItems='center'
                >
                    <Text
                        style={{
                            color: theme.colors.warmGray[500],
                            marginRight: 2
                        }}
                    >
                        {set_count}
                    </Text>
                    <SimpleLineIcon
                        name='arrow-right'
                        size={11}
                        color={theme.colors.warmGray[500]}
                    />
                </Box>
            </View>
        </Pressable>
    ));

    return (
        <SafeAreaContainer child={
            <>
                <Header 
                    title={
                        recipient_name.slice(-1) == 's'
                        ? `${recipient_name}' collections`
                        : `${recipient_name}'s collections`
                    }
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}
                >
                    {collection_list}
                </View>

                {/* test redux */}
                <Pressable
                    onPress={() => {
                        dispatch(collectionAdded({
                            id: new_collection_id,
                            recipient_id: recipient_id,
                            title: 'A Collection',
                            set_count: 0
                        }));
                        dispatch(recipientUpdated({
                            id: recipient_id,
                            changes: {
                                collection_count: recipient ? recipient.collection_count + 1 : undefined
                            }
                        }))
                    }}
                >
                    <Text>
                        Add a collection
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => {
                        dispatch(allCollectionsRemoved());
                        dispatch(recipientUpdated({
                            id: recipient_id,
                            changes: {
                                collection_count: recipient ? 0 : undefined
                            }
                        }))
                    }}
                >
                    <Text>
                        Remove all collections
                    </Text>
                </Pressable>
            </>
        }/>
    ) 
}

export {CollectionSelection}