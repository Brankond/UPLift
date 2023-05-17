// external dependencies
import {
  createSlice,
  createEntityAdapter,
  createSelector,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import {RootState} from 'store';

// internal dependencies
import {fetchDataArrById, DataTypes, CollectionNames} from 'services/fireStore';
import {Asset} from 'utils/types';

export interface Set {
  id: string;
  collectionId: string;
  recipientId: string;
  caregiverId: string;
  imageTitle: string;
  audioTitle: string;
  image: Asset;
  audio: Asset;
}

export interface SetUpdate {
  imageTitle?: string;
  audioTitle?: string;
  image?: Asset;
  audio?: Asset;
}

export interface SetImageUpdate {
  imageTitle: string;
  image: Asset;
}

export interface SetAudioUpdate {
  audioTitle: string;
  audio: Asset;
}

export const fetchSets = createAsyncThunk(
  'sets/fetchSets',
  async (id: string) => {
    try {
      const sets = await fetchDataArrById(
        id,
        CollectionNames.Sets,
        DataTypes.caregiver,
      );
      return sets as unknown as Set[];
    } catch (error) {
      console.log('Error fetching set data: ', error);
      return [];
    }
  },
);

const setsAdapter = createEntityAdapter<Set>({
  sortComparer: (a, b) => a.imageTitle.localeCompare(b.imageTitle),
});

const setsSlice = createSlice({
  name: 'sets',
  initialState: setsAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {
    setAdded: setsAdapter.addOne,
    setUpdated: setsAdapter.updateOne,
    setRemoved: setsAdapter.removeOne,
    allSetsRemoved: setsAdapter.removeAll,
    manySetsRemoved: setsAdapter.removeMany,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSets.pending, (state, _) => {
        state.status = 'loading';
      })
      .addCase(fetchSets.fulfilled, (state, action) => {
        setsAdapter.setAll(state, action.payload);
        state.status = 'loaded';
      });
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

export const selectSetsByIds = (ids: string[]) => {
  return createSelector(selectSets, sets => {
    let o: Set[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(set => set.id === id)];
    });
    return o;
  });
};

export const selectSetsByRecipientId = (id: string) => {
  return createSelector(selectSets, sets =>
    sets.filter(set => set.recipientId === id),
  );
};

export const selectSetIdsByRecipientId = (id: string) => {
  return createSelector(selectSetsByRecipientId(id), sets =>
    sets.map(set => set.id),
  );
};

export const selectSetsByCollectionId = (id: string) => {
  return createSelector(selectSets, sets =>
    sets.filter(set => set.collectionId === id),
  );
};

export const selectSetIdsByCollectionId = (id: string) => {
  return createSelector(selectSetsByCollectionId(id), sets =>
    sets.map(set => set.id),
  );
};

export const selectSetsByCollectionIds = (ids: string[]) => {
  return createSelector(selectSets, sets => {
    let o: Set[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(set => set.collectionId === id)];
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
    let o: Set[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(set => set.recipientId === id)];
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
