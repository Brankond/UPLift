// external dependencies
import {createSlice, createEntityAdapter} from '@reduxjs/toolkit';

// internal dependencies
import {RootState} from 'store';

export interface Caregiver {
  id: string;
  email: string | null;
  contactNumber: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

const caregiversAdapter = createEntityAdapter<Caregiver>();

const caregiversSlice = createSlice({
  name: 'recipients',
  initialState: caregiversAdapter.getInitialState(),
  reducers: {
    caregiverAdded: caregiversAdapter.addOne,
    caregiverUpdated: caregiversAdapter.updateOne,
    caregiverRemoved: caregiversAdapter.removeOne,
    allCaregiversRemoved: caregiversAdapter.removeAll,
    manyCaregiversRemoved: caregiversAdapter.removeMany,
  },
});

export const {
  caregiverAdded,
  caregiverUpdated,
  caregiverRemoved,
  allCaregiversRemoved,
  manyCaregiversRemoved,
} = caregiversSlice.actions;

export const {
  selectAll: selectCaregivers,
  selectById: selectCaregiverById,
  selectIds: selectCaregiverIds,
} = caregiversAdapter.getSelectors((state: RootState) => state.caregivers);

export default caregiversSlice.reducer;
