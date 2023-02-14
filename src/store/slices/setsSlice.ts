// external dependencies
import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import {RootState} from 'store';

// internal dependencies

export interface IASet {
  id: string;
  collection_id: string;
  recipient_id: string;
  image_title: string;
  audio_title: string;
  image_path: string; // change to path object
  audio_path: string; // change to path object
}

const setsAdapter = createEntityAdapter<IASet>({
  sortComparer: (a, b) => a.image_title.localeCompare(b.image_title),
});

const setsSlice = createSlice({
  name: 'sets',
  initialState: setsAdapter.getInitialState(),
  reducers: {
    setAdded: setsAdapter.addOne,
    setUpdated: setsAdapter.updateOne,
    setRemoved: setsAdapter.removeOne,
    allSetsRemoved: setsAdapter.removeAll,
    manySetsRemoved: setsAdapter.removeMany,
  },
});

export const {
  setAdded,
  setUpdated,
  setRemoved,
  allSetsRemoved,
  manySetsRemoved,
} = setsSlice.actions;

export const {
  selectAll: selectSets,
  selectById: selectSetById,
  selectIds: selectSetIds,
} = setsAdapter.getSelectors((state: RootState) => state.sets);

export const selectSetIdsByRecipientId = (id: string) => {
  return createSelector(selectSets, sets =>
    sets.filter(set => set.recipient_id === id).map(set => set.id),
  );
};

export const selectSetsByCollectionId = (id: string) => {
  return createSelector(selectSets, sets =>
    sets.filter(set => set.collection_id === id),
  );
};

export const selectSetIdsByCollectionId = (id: string) => {
  return createSelector(selectSetsByCollectionId(id), sets =>
    sets.map(set => set.id),
  );
};

export const selectSetsByCollectionIds = (ids: string[]) => {
  return createSelector(selectSets, sets => {
    let o: IASet[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(set => set.collection_id === id)];
    });
    return o;
  });
};

export const selectSetIdsByCollectionIds = (ids: string[]) => {
  return createSelector(selectSetsByCollectionIds(ids), sets =>
    sets.map(set => set.id),
  );
};

export const selectSetsByRecipientIds = (ids: string[]) => {
  return createSelector(selectSets, sets => {
    let o: IASet[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(set => set.recipient_id === id)];
    });
    return o;
  });
};

export const selectSetIdsByRecipientIds = (ids: string[]) => {
  return createSelector(selectSetsByCollectionIds(ids), sets =>
    sets.map(set => set.id),
  );
};

export default setsSlice.reducer;
