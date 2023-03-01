// external dependencies
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

// internal dependencies
import {RootState} from 'store';

export interface Recipient {
  id: string;
  caregiver_id: string;
  first_name: string;
  last_name: string;
  avatar: string; // uri of the avatar image
  date_of_birth: string | undefined;
  location: string; // change to location object
  is_fallen: boolean;
  collection_count: number;
}

const recipientsAdapter = createEntityAdapter<Recipient>({
  sortComparer: (a, b) => a.first_name.localeCompare(b.first_name),
});

const recipientsSlice = createSlice({
  name: 'recipients',
  initialState: recipientsAdapter.getInitialState(),
  reducers: {
    recipientAdded: recipientsAdapter.addOne,
    recipientUpdated: recipientsAdapter.updateOne,
    recipientRemoved: recipientsAdapter.removeOne,
    allRecipientsRemoved: recipientsAdapter.removeAll,
    manyRecipientsRemoved: recipientsAdapter.removeMany,
  },
});

export const {
  recipientAdded,
  recipientUpdated,
  recipientRemoved,
  allRecipientsRemoved,
  manyRecipientsRemoved,
} = recipientsSlice.actions;

export const {
  selectAll: selectRecipients,
  selectById: selectRecipientById,
  selectIds: selectRecipientIds,
} = recipientsAdapter.getSelectors((state: RootState) => state.recipients);

export default recipientsSlice.reducer;
