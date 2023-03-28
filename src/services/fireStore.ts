// external dependencies
import firestore from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

// internal dependencies
import {Caregiver} from 'store/slices/caregiversSlice';
import {
  Recipient,
  RecipientBasicInfoUpdate,
  RecipientPhotoUpdate,
  RecipientUpdate,
} from 'store/slices/recipientsSlice';
import {Collection, CollectionUpdate} from 'store/slices/collectionsSlice';
import {
  Set,
  SetAudioUpdate,
  SetImageUpdate,
  SetUpdate,
} from 'store/slices/setsSlice';
import {
  EmergencyContact,
  EmergencyContactUpdate,
} from 'store/slices/emergencyContactsSlice';

/**
 * Constants (collection names)
 */

export enum CollectionNames {
  Caregivers = 'Caregivers',
  Categories = 'Categories',
  Contacts = 'Contacts',
  Recipients = 'Recipients',
  Sets = 'Sets',
}

/**
 * Add caregiver (user) to firestore
 */
export const addCaregiver = async (newUser: FirebaseAuthTypes.User) => {
  const newCaregiver: Caregiver = {
    id: newUser.uid,
    email: newUser.email,
    contactNumber: newUser.phoneNumber,
    username: newUser.displayName,
    firstName: null,
    lastName: null,
    avatar: null,
  };

  // commit to firestore
  await firestore()
    .collection(CollectionNames.Caregivers)
    .doc(newUser.uid)
    .set({
      ...newCaregiver,
    });
};

/**
 * Add / update / remove document(s) to / in firestore
 */
export type DocumentType =
  | Caregiver
  | Recipient
  | EmergencyContact
  | Collection
  | Set;

export type UpdateType =
  | SetUpdate
  | SetAudioUpdate
  | SetImageUpdate
  | EmergencyContactUpdate
  | RecipientUpdate
  | RecipientPhotoUpdate
  | RecipientBasicInfoUpdate
  | CollectionUpdate;

export const addDocument = async (
  newDocument: DocumentType,
  collectionName: CollectionNames,
) => {
  await firestore()
    .collection(collectionName)
    .doc(newDocument.id)
    .set(newDocument);
};

export const updateDocument = async (
  id: string,
  update: UpdateType,
  collectionName: CollectionNames,
) => {
  await firestore().collection(collectionName).doc(id).update(update);
};

export const removeDocuments = async (
  ids: string[],
  collectionName: CollectionNames,
) => {
  for (const id of ids) {
    await firestore().collection(collectionName).doc(id).delete();
  }
};

/**
 * Fetch data using id
 */
export enum DataTypes {
  caregiver = 'caregiver',
  recipient = 'recipient',
  contact = 'contact',
  collection = 'collection',
  set = 'set',
}

export const fetchDataArrById = async (
  id: string,
  collectionName: CollectionNames,
  idType: DataTypes,
) => {
  const dataSnapShots = await firestore()
    .collection(collectionName)
    .where(`${idType}Id`, '==', id)
    .get();
  const data = dataSnapShots.docs.map(doc => doc.data());
  return data;
};
