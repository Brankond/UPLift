// external dependencies
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const pickSingleImage = async () => {
  // ask for permission
  let permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.accessPrivileges === 'none') return null;

  // pick image
  let pickResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (pickResult.canceled) {
    console.log('User cancelled image picker');
    return null;
  }

  const assetId = pickResult.assets[0].assetId;
  if (!assetId) {
    console.log('Asset ID is not available');
    return null;
  }

  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId);
  const localUri = assetInfo.localUri;
  if (!localUri) {
    console.log('Local URI of this asset is not available');
    return null;
  }

  return localUri;
};

export default pickSingleImage;
