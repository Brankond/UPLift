// external dependencies
import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';

// internal dependencies
import {RootState} from 'store';
import {fetchDataArrById, DataTypes, CollectionNames} from 'services/fireStore';

export interface EmergencyContact {
  id: string;
  recipientId: string;
  caregiverId: string;
  firstName: string;
  lastName: string;
  relationship: string;
  contactNumbers: string[];
  emails: string[];
}

export interface EmergencyContactUpdate {
  firstName: string;
  lastName: string;
  relationship: string;
  contactNumbers: string[];
  emails: string[];
}

// async fetch thunk
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (recipientId: string) => {
    try {
      const contacts = await fetchDataArrById(
        recipientId,
        CollectionNames.Contacts,
        DataTypes.caregiver,
      );
      return contacts as unknown as EmergencyContact[];
    } catch (error) {
      console.log('Error fetching contact data: ', error);
      return [];
    }
  },
);

const contactAdapter = createEntityAdapter<EmergencyContact>({
  sortComparer: (a, b) => a.firstName.localeCompare(b.firstName),
});

const emergencyContactSlice = createSlice({
  name: 'emergencyContacts',
  initialState: contactAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {
    contactAdded: contactAdapter.addOne,
    contactRemoved: contactAdapter.removeOne,
    contactUpdated: contactAdapter.updateOne,
    manyContactsAdded: contactAdapter.addMany,
    manyContactsRemoved: contactAdapter.removeMany,
    manyContactsUpdated: contactAdapter.updateMany,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchContacts.pending, (state, _) => {
        state.status = 'loading';
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        contactAdapter.setAll(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export const {
  contactAdded,
  contactRemoved,
  contactUpdated,
  manyContactsAdded,
  manyContactsRemoved,
  manyContactsUpdated,
} = emergencyContactSlice.actions;

export const {
  selectAll: selectContacts,
  selectById: selectContactById,
  selectIds: selectContactIds,
} = contactAdapter.getSelectors((state: RootState) => state.emergencyContacts);

export const selectContactsByRecipientId = (id: string) => {
  return createSelector(selectContacts, contacts =>
    contacts.filter(contact => contact.recipientId === id),
  );
};

export const selectContactIdsByRecipientId = (id: string) => {
  return createSelector(selectContactsByRecipientId(id), contacts =>
    contacts.map(contact => contact.id),
  );
};

export const selectContactsByRecipientIds = (ids: string[]) => {
  return createSelector(selectContacts, sets => {
    let o: EmergencyContact[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(contact => contact.recipientId === id)];
    });
    return o;
  });
};

export const selectContactIdsByRecipientIds = (ids: string[]) => {
  return createSelector(selectContactsByRecipientIds(ids), contacts =>
    contacts.map(contact => contact.id),
  );
};

export default emergencyContactSlice.reducer;
