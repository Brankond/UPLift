// external dependencies
import storage from '@react-native-firebase/storage';

/**
 * Constants
 */
const bucket = storage();
export const RECIPIENTS_FOLDER = 'recipients';
export const AVATARS_FOLDER = 'avatar';
export const COVERS_FOLDER = 'cover';
export const SET_FOLDER = 'set';
export const AUDIO_FOLDER = 'audio';
export const IMAGE_FOLDER = 'image';

/**
 * Upload and remove assets
 */
export const uploadAsset = async (
  id: string,
  localUri: string,
  folder: string,
  fileName: string,
) => {
  const cloudStoragePath = `${RECIPIENTS_FOLDER}/${id}/${folder}/${fileName}`;
  console.log(cloudStoragePath);
  const reference = await bucket.ref(cloudStoragePath);
  const task = await reference.putFile(localUri);
  const url = await reference.getDownloadURL();
  return {task, url, cloudStoragePath};
};

export const removeAsset = async (cloudStoragePath: string) => {
  const reference = await bucket.ref(cloudStoragePath);
  await reference.delete();
};

export const removeAssets = async (cloudStoragePaths: string[]) => {
  const promises = cloudStoragePaths.map(path => removeAsset(path));
  await Promise.all(promises);
};
