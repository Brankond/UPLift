import * as DocumentPicker from 'expo-document-picker';

const pickDocument = async () => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
    type: 'audio/*',
  });

  if (result.type === 'success') {
    console.log('Uri', result.uri);
    return result;
  }
};

export default pickDocument;
