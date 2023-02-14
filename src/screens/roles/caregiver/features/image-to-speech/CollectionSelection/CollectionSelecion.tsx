// external dependencies
import {useContext, useEffect, useRef, useState} from "react";
import {Text, View, Pressable, Animated, useWindowDimensions, StyleSheet} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import {Box, FlatList} from "native-base";
import {createSelector} from "@reduxjs/toolkit";
import {useSelector, useDispatch} from "react-redux";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import {useRoute, useNavigation} from "@react-navigation/native";

// internal dependencies
import {ThemeContext} from "contexts";
import {CollectionSelectionProps} from "screens/navigation-types";
import {Header, SafeAreaContainer, AddButton} from "components";
import {IACollection, selectCollections, manyCollectionsRemoved} from "store/slices/collectionsSlice";
import {selectSetIdsByCollectionIds, manySetsRemoved} from "store/slices/setsSlice";

interface CollectionProps {
    collection: IACollection,
    isEditing: boolean,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
    selectedCollections: string[],
    setSelectedCollections: React.Dispatch<React.SetStateAction<string[]>>,
    enterAnim: Animated.CompositeAnimation,
}

const Collection = ({collection, isEditing, setIsEditing, selectedCollections, setSelectedCollections, enterAnim}: CollectionProps) => {
    // import theme
    const {theme} = useContext(ThemeContext);

    // set grid size
    const {width} = useWindowDimensions();
    const grid_dimension = (width - theme.sizes[12]) / 2;

    // route parameters
    const route = useRoute<CollectionSelectionProps['route']>();
    const navigation = useNavigation<CollectionSelectionProps['navigation']>();
    const recipient_id = route.params.recipient_id;
    const recipient_first_name = route.params.recipient_first_name;

    return (
        <Pressable
            key={collection.id}
            style={{
                height: grid_dimension + 26,
                width: grid_dimension,
                marginHorizontal: theme.sizes[1],
                marginBottom: theme.sizes[2],
            }}
            onLongPress={() => {
                setIsEditing(true),
                enterAnim.start()
            }}
            onPress={
                isEditing 
                ?
                () => {
                    if (!selectedCollections.includes(collection.id)) {
                        setSelectedCollections([...selectedCollections, collection.id]);
                    } else {
                        setSelectedCollections(selectedCollections.filter(id => id != collection.id))
                    }
                }
                : 
                () => {
                navigation.navigate('Gallery', 
                    {
                        recipient_id: recipient_id,
                        recipient_first_name: recipient_first_name,
                        collection_id: collection.id,
                        collection_title: collection.title
                    });
                }
            }
        >  
            {
                isEditing
                &&
                <View
                    style={{
                        position: 'absolute',
                        right: theme.sizes[2],
                        top: theme.sizes[2],
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: theme.sizes[4],
                        width: theme.sizes[4],
                        borderColor: theme.colors.light[50],
                        borderWidth: 1.25,
                        borderRadius: theme.sizes[2],
                        zIndex:1000,
                    }}
                >   
                    {
                        selectedCollections.includes(collection.id) 
                        &&
                        <>
                            <View
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: theme.sizes[2],
                                    backgroundColor: theme.colors.primary[400],
                                    opacity: 1
                                }}
                            >
                            </View>
                            <MaterialIcon
                                name='check'
                                color={theme.colors.light[50]}
                            />
                        </>
                    }
                </View>
            }
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
                    {collection.title}
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
                        {collection.set_count}
                    </Text>
                    <SimpleLineIcon
                        name='arrow-right'
                        size={11}
                        color={theme.colors.warmGray[500]}
                    />
                </Box>
            </View>
        </Pressable>
    )
}

const CollectionSelection = ({navigation, route}: CollectionSelectionProps) => {
    // import theme
    const {theme} = useContext(ThemeContext);
    const styles = StyleSheet.create({
        editionPanelDeleteButton: {
            height: theme.sizes[16],
            width: theme.sizes[16],
            borderRadius: theme.sizes[8],
            backgroundColor: theme.colors.light[50],
            shadowColor: theme.colors.dark[300],
            shadowOffset: {
                width: theme.sizes[1],
                height: theme.sizes[1]
            },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            position: 'absolute',
            left: '50%',
            transform: [{translateX: -theme.sizes[8]}],
            bottom: theme.sizes[4],
        }
    })

    // component states
    const initialCollections: string[] = [];
    const [selectedCollections, setSelectedCollections] = useState(initialCollections);
    const [isEditing, setIsEditing] = useState(false);

    // onload effect
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >       
                    {
                        isEditing &&
                        <>  
                            {
                                selectedCollections.length > 0 
                                &&
                                <Text
                                    style={{
                                        color: theme.colors.primary[400],
                                        marginRight: theme.sizes['2.5']
                                    }}
                                >
                                    <Text style={{fontWeight: theme.fontWeights.bold}}>{selectedCollections.length}</Text> {selectedCollections.length === 1 ? 'Collection' : 'Collections'}
                                </Text>
                            }
                            <Pressable
                                style={{
                                    marginRight: theme.sizes['2.5']
                                }}
                                onPress={() => {
                                    exitAnim.start()
                                    setTimeout(() => {
                                        setIsEditing(false);
                                    }, 150)
                                }}
                            >
                                <Text
                                    style={{
                                        color: theme.colors.primary[400]
                                    }}
                                >
                                    Cancel
                                </Text>
                            </Pressable>
                        </>

                    }
                    <AddButton 
                        onPress={() => {
                            navigation.navigate('Add Collection', {recipient_id: recipient_id});
                        }}
                        disabled={isEditing}
                        color={isEditing ? theme.colors.warmGray[300] : undefined}
                    />
                </View>
        })
    }, [isEditing, selectedCollections])

    // route parameters
    const recipient_id = route.params.recipient_id;
    const recipient_first_name = route.params.recipient_first_name;

    // animation
    const editButtonAnim = useRef(new Animated.Value(0)).current;
    const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcon);

    const enterAnim = Animated.timing(editButtonAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
    });

    const exitAnim = Animated.timing(editButtonAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
    });

    // redux data
    const selectCollectionByRecipientId = createSelector(
        selectCollections,
        (collections) => {
            return collections.filter(collection => {
                return collection.recipient_id === recipient_id;
            })
        }
    );

    const collections = useSelector(selectCollectionByRecipientId);
    const sets = useSelector(selectSetIdsByCollectionIds(selectedCollections));
    const dispatch = useDispatch();

    return (
        <SafeAreaContainer child={
            <>
                <Header 
                    title={
                        recipient_first_name.slice(-1) == 's'
                        ? `${recipient_first_name}' collections`
                        : `${recipient_first_name}'s collections`
                    }
                />

                {/* body (list display) */}
                {
                    collections.length > 0
                    ?
                    <FlatList 
                        data={collections}
                        numColumns={2}
                        renderItem={({item}) => (
                            <Collection 
                                collection={item}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                selectedCollections={selectedCollections}
                                setSelectedCollections={setSelectedCollections}
                                enterAnim={enterAnim}
                            />
                        )}
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
                        No Collection
                    </Text>
                }

                {/* edition panel */}
                {
                    isEditing &&
                    <Animated.View
                        style={[
                            styles.editionPanelDeleteButton,
                            {
                                opacity: editButtonAnim
                            }
                        ]}
                    >   
                        <Pressable
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => {
                                dispatch(manyCollectionsRemoved(selectedCollections))
                                dispatch(manySetsRemoved(sets))
                                setSelectedCollections([]);
                            }}
                        >   
                            <AnimatedIcon 
                                name='delete'
                                color={theme.colors.danger[500]}
                                size={theme.sizes[8]} 
                                style={{
                                    transform: [{scale: editButtonAnim}]
                                }}
                            />
                        </Pressable>
                    </Animated.View>
                }
            </>
        }/>
    ) 
}

export {CollectionSelection}