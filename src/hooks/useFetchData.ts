// external dependencies
import {useEffect, useContext} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

// internal dependencies
import {fetchRecipients} from 'store/slices/recipientsSlice';
import {fetchCollections} from 'store/slices/collectionsSlice';
import {fetchSets} from 'store/slices/setsSlice';
import {fetchContacts} from 'store/slices/emergencyContactsSlice';
import {useAppDispatch} from './useAppDispatch';

export const useFetchData = (user: FirebaseAuthTypes.User | null) => {
  // redux
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      console.log('Initial data fetching start');
      dispatch(fetchRecipients(user.uid));
      dispatch(fetchCollections(user.uid));
      dispatch(fetchSets(user.uid));
      dispatch(fetchContacts(user.uid));
    } else {
      console.log('No user found, no data fetching');
    }
  }, [user]);
};
