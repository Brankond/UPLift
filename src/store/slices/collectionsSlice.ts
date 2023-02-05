// external dependencies
import {createSlice, createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {RootState} from "store";

interface IACollection {
    id: string,
    recipient_id: string,
    title: string,
    set_count: number
};

const collectionsAdapter = createEntityAdapter<IACollection>({
    sortComparer: (a, b) => a.title.localeCompare(b.title)
})

const collectionsSlice = createSlice({
    name: 'collections',
    initialState: collectionsAdapter.getInitialState(),
    reducers: {
        collectionAdded: collectionsAdapter.addOne,
        collectionUpdated: collectionsAdapter.updateOne,
        collectionRemoved: collectionsAdapter.removeOne,
        allCollectionsRemoved: collectionsAdapter.removeAll
    }
})

export const {collectionAdded, collectionRemoved, collectionUpdated, allCollectionsRemoved} = collectionsSlice.actions;

export const {
    selectAll: selectCollections,
    selectById: selectCollectionById,
    selectIds: selectCollectionIds
} = collectionsAdapter.getSelectors((state: RootState) => state.collections);

export default collectionsSlice.reducer;