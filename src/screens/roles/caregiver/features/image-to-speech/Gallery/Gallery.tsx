// externam dependencies
import {useContext, useEffect} from "react";
import {Pressable, View, useWindowDimensions, Text} from "react-native";
import {FlatList, ScrollView} from "native-base";
import {useSelector, useDispatch} from "react-redux";
import {createSelector} from "@reduxjs/toolkit";

// internal dependencies
import {GalleryProps} from "screens/navigation-types";
import {Header, SafeAreaContainer, AddButton} from "components";
import {ThemeContext} from "contexts";
import {setAdded, allSetsRemoved, selectSets} from "store/slices/setsSlice";
import {collectionUpdated, selectCollectionById} from "store/slices/collectionsSlice";
import {RootState} from "store";

const Gallery = ({navigation, route}: GalleryProps) => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <AddButton 
                    onPress={() => {
                        console.log('Hi');
                    }}
                />
        })
    });

    const {width} = useWindowDimensions();
    const {theme} = useContext(ThemeContext);
    const grid_dimension = (width - 2 * theme.sizes[4]) / 4;
    const collection_id = route.params.collection_id;
    const recipient_id = route.params.recipient_id;
    const collection_title = route.params.collection_title;
    // const recipient_id = route.params.recipient_id;

    const selectSetsByCollectionId = createSelector(
        selectSets,
        (sets) => {
            return sets.filter((set) => set.collection_id === collection_id)
        }
    );
    
    const dispatch = useDispatch();
    const collection = useSelector((state: RootState) => selectCollectionById(state, collection_id));
    const totalSets = useSelector(selectSets);
    const sets = useSelector(selectSetsByCollectionId);
    const new_set_id = `${totalSets.length + 1}`;

    return (
        <SafeAreaContainer 
            child={
                <>
                    <Header 
                        title={collection_title}
                    />

                    {
                        sets.length > 0
                        ?
                        <FlatList 
                            data={sets}
                            numColumns={4}
                            renderItem={({item}) => (
                                <Pressable 
                                    key={item.id}
                                    style={{
                                        width: grid_dimension,
                                        height: grid_dimension,
                                        padding: 2,
                                    }}
                                    onPress={() => {
                                        navigation.navigate('Set', {set_id: item.id})
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            backgroundColor: theme.colors.warmGray[300]
                                        }}
                                    ></View>
                                </Pressable>
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
                            No Set
                        </Text>
                    }


                    {/* test redux */}
                    <Pressable
                        onPress={() => {
                            dispatch(setAdded({
                                id: new_set_id,
                                recipient_id: recipient_id,
                                collection_id: collection_id,
                                image_title: 'reading',
                                audio_title: 'reading',
                                image_path: 'path/to/image/file', 
                                audio_path: 'path/to/audio/file' 
                            }));
                            dispatch(collectionUpdated({
                                id: collection_id,
                                changes: {
                                    set_count: collection ? collection.set_count + 1 : undefined
                                }
                            }))
                        }}
                    >
                        <Text>
                            Add a set
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            dispatch(allSetsRemoved());
                            dispatch(collectionUpdated({
                                id: collection_id,
                                changes: {
                                    set_count: collection ? 0 : undefined
                                }
                            }))
                        }}
                    >
                        <Text>
                            Remove all sets
                        </Text>
                    </Pressable>
                </>
            }
        />
    )
};

export {Gallery};