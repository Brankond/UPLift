// internal dependencies
import {Asset} from './types';

export const isAssetInCloudStorage = (asset: Asset) => {
  const {url, cloudStoragePath} = asset;

  // if the asset is in cloud storage, the url and cloudStoragePath should be non-empty strings
  return url.length > 0 && cloudStoragePath.length > 0;
};
