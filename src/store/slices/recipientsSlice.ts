// external dependencies
import {createSlice, createEntityAdapter} from "@reduxjs/toolkit";

// internal dependencies
import {RootState} from "store";

interface Recipient {
    id: string,
    caregiver_id: string,
    name: string,
    date_of_birth: string,
    location: string, // change to location object 
    is_fallen: boolean,
    collection_count: number
};

const recipientsAdapter = createEntityAdapter<Recipient>({
    sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const recipientsSlice = createSlice({
    name: 'recipients',
    initialState: recipientsAdapter.getInitialState(),
    reducers: {
        recipientAdded: recipientsAdapter.addOne,
        recipientUpdated: recipientsAdapter.updateOne,
        recipientRemoved: recipientsAdapter.removeOne,
        allRecipientsRemoved: recipientsAdapter.removeAll
    }
});

export const {recipientAdded, recipientUpdated, recipientRemoved, allRecipientsRemoved} = recipientsSlice.actions;

export const {
    selectAll: selectRecipients,
    selectById: selectRecipientById,
    selectIds: selectRecipientIds
} = recipientsAdapter.getSelectors((state: RootState) => state.recipients);

export default recipientsSlice.reducer
