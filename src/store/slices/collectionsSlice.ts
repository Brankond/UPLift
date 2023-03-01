// external dependencies
import {
  createSlice,
  createEntityAdapter,
  createSelector,
} from '@reduxjs/toolkit';
import {RootState} from 'store';

export interface IACollection {
  id: string;
  recipient_id: string;
  title: string;
  cover_image: string; // uri of cover image
  set_count: number;
}

const collectionsAdapter = createEntityAdapter<IACollection>({
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: collectionsAdapter.getInitialState(),
  reducers: {
    collectionAdded: collectionsAdapter.addOne,
    collectionUpdated: collectionsAdapter.updateOne,
    collectionRemoved: collectionsAdapter.removeOne,
    manyCollectionsRemoved: collectionsAdapter.removeMany,
    allCollectionsRemoved: collectionsAdapter.removeAll,
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
    collections.filter(collection => collection.recipient_id === id),
  );
};

export const selectCollectionIdsByRecipientId = (id: string) => {
  return createSelector(selectCollectionsByRecipientId(id), collections =>
    collections.map(collection => collection.id),
  );
};

export const selectCollectionsByRecipientIds = (ids: string[]) => {
  return createSelector(selectCollections, sets => {
    let o: IACollection[] = [];
    ids.forEach(id => {
      o = [...o, ...sets.filter(collection => collection.recipient_id === id)];
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
