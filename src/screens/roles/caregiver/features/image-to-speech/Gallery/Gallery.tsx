// externam dependencies
import {useContext} from "react";
import {Pressable, View, useWindowDimensions, Text} from "react-native";
import {Box} from "native-base";
import {useSelector, useDispatch} from "react-redux";
import {createSelector} from "@reduxjs/toolkit";

// internal dependencies
import {GalleryProps} from "screens/navigation-types";
import {Header, SafeAreaContainer} from "components";
import {ThemeContext} from "contexts";
import {setAdded, allSetsRemoved, selectSets, setUpdated} from "store/slices/setsSlice";
import {collectionUpdated, selectCollectionById} from "store/slices/collectionsSlice";
import {RootState} from "store";

const Gallery = ({navigation, route}: GalleryProps) => {
    const {width} = useWindowDimensions();
    const {theme} = useContext(ThemeContext);
    const grid_dimension = (width - 2 * theme.sizes[4]) / 4;
    const collection_id = route.params.collection_id;
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

    const IA_set_preview_list = sets.map(({id}) => (
        <Pressable 
            key={id}
            style={{
                width: grid_dimension,
                height: grid_dimension,
                padding: 2,
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.warmGray[300]
                }}
            ></View>
        </Pressable>
    ))

    return (
        <SafeAreaContainer 
            child={
                <>
                    <Header 
                        title={collection_title}
                    />
                    <Box
                        flexDirection={'row'}
                        flexWrap={'wrap'}
                    >
                        {IA_set_preview_list}
                    </Box>

                    {/* test redux */}
                    <Pressable
                        onPress={() => {
                            dispatch(setAdded({
                                id: new_set_id,
                                collection_id: collection_id,
                                image_title: 'image_title',
                                audio_title: 'audio_title',
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