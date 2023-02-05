// external dependencies
import {createSlice, createEntityAdapter} from "@reduxjs/toolkit";
import { RootState } from "store";

// internal dependencies

interface IASet {
    id: string,
    collection_id: string,
    image_title: string,
    audio_title: string,
    image_path: string, // change to path object
    audio_path: string // change to path object
};

const setsAdapter = createEntityAdapter<IASet>({
    sortComparer: (a, b) => a.image_title.localeCompare(b.image_title)
});

const setsSlice = createSlice({
    name: 'sets',
    initialState: setsAdapter.getInitialState(),
    reducers: {
        setAdded: setsAdapter.addOne,
        setUpdated: setsAdapter.updateOne,
        setRemoved: setsAdapter.removeOne,
        allSetsRemoved: setsAdapter.removeAll
    }
});

export const {setAdded, setUpdated, setRemoved, allSetsRemoved} = setsSlice.actions;

export const {
    selectAll: selectSets,
    selectById: selectSetById,
    selectIds: selectSetIds
} = setsAdapter.getSelectors((state: RootState) => state.sets);

export default setsSlice.reducer;