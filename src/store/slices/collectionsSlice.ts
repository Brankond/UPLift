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

export interface Collection {
  id: string;
  recipientId: string;
  caregiverId: string;
  title: string;
  cover: Asset;
}

export interface CollectionUpdate {
  title: string;
  cover: Asset;
}

export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async (recipientId: string) => {
    try {
      const collections = await fetchDataArrById(
        recipientId,
        CollectionNames.Categories,
        DataTypes.caregiver,
      );
      return collections as unknown as Collection[];
    } catch (error) {
      console.log('Error fetching collections: ', error);
      return [];
    }
  },
);

const collectionsAdapter = createEntityAdapter<Collection>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: collectionsAdapter.getInitialState({
    status: 'idle',
  }),
  reducers: {
    collectionAdded: collectionsAdapter.addOne,
    collectionUpdated: collectionsAdapter.updateOne,
    collectionRemoved: collectionsAdapter.removeOne,
    manyCollectionsRemoved: collectionsAdapter.removeMany,
    allCollectionsRemoved: collectionsAdapter.removeAll,
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCollections.pending, (state, _) => {
        state.status = 'loading';
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        collectionsAdapter.setAll(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export const {
  collectionAdded,
  collectionRemoved,
  collectionUpdated,
  allCollectionsRemoved,
  manyCollectionsRemoved,
} = collectionsSlice.actions;

export const {
  selectAll: selectCollections,
  selectById: selectCollectionById,
  selectIds: selectCollectionIds,
} = collectionsAdapter.getSelectors((state: RootState) => state.collections);

export const selectCollectionsByRecipientId = (id: string) => {
  return createSelector(selectCollections, collections =>
    collections.filter(collection => collection.recipientId === id),
  );
};

export const selectCollectionIdsByRecipientId = (id: string) => {
  return createSelector(selectCollectionsByRecipientId(id), collections =>
    collections.map(collection => collection.id),
  );
};

export const selectCollectionsByRecipientIds = (ids: string[]) => {
  return createSelector(selectCollections, sets => {
    let o: Collection[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(collection => collection.recipientId === id)];
    });
    return o;
  });
};

export const selectCollectionIdsByRecipientIds = (ids: string[]) => {
  return createSelector(selectCollectionsByRecipientIds(ids), collections =>
    collections.map(collection => collection.id),
  );
};

export default collectionsSlice.reducer;
