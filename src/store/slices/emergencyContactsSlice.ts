// external dependencies
import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';

// internal dependencies
import {RootState} from 'store';
import {Relationship} from 'screens/roles/caregiver/features/settings/modals/AddEditEmergencyContact/relationships';

export interface EmergencyContact {
  id: string;
  recipient_id: string;
  first_name: string;
  last_name: string;
  relationship: Relationship;
  contact_number: string[];
  email?: string[];
}

const contactAdapter = createEntityAdapter<EmergencyContact>({
  sortComparer: (a, b) => a.first_name.localeCompare(b.first_name),
});

const emergencyContactSlice = createSlice({
  name: 'emergencyContacts',
  initialState: contactAdapter.getInitialState(),
  reducers: {
    contactAdded: contactAdapter.addOne,
    contactRemoved: contactAdapter.removeOne,
    contactUpdated: contactAdapter.updateOne,
    manyContactsAdded: contactAdapter.addMany,
    manyContactsRemoved: contactAdapter.removeMany,
    manyContactsUpdated: contactAdapter.updateMany,
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
    contacts.filter(contact => contact.recipient_id === id),
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
      o = [...o, ...sets.filter(contact => contact.recipient_id === id)];
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
