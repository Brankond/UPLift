import * as ImagePicker from 'expo-image-picker';

const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string>>) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
};

export default pickImage;