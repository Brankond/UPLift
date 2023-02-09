// external dependencies
import {View, Text, SafeAreaView, TextInput, Pressable} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import 'react-native-get-random-values';
import {v4} from 'uuid';

// internal dependencies
import {AddCollectionModalProps} from 'screens/navigation-types';
import {SaveButton} from 'components';
import {ThemeContext} from 'contexts';
import {collectionAdded} from 'store/slices/collectionsSlice';
import {recipientUpdated, selectRecipientById} from 'store/slices/recipientsSlice';
import {RootState} from 'store';
import {useHideBottomTab} from 'hooks/useHideBottomTab';

const AddCollectionModal = ({navigation, route}: AddCollectionModalProps) => {
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();

  const recipient_id = route.params.recipient_id;
  const recipient = useSelector((state: RootState) => selectRecipientById(state, recipient_id));

  const [title, setTitle] = useState('');

  const addCollection = (title: string, recipient_id: string) => {
    dispatch(collectionAdded({
        id: v4(),
        recipient_id: recipient_id,
        title: title.length > 0 ? title : 'untitled',
        set_count: 0
    }));
    dispatch(recipientUpdated({
        id: recipient_id,
        changes: {
            collection_count: recipient ? recipient.collection_count + 1 : undefined
        }
    }));
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add Collection',
      headerRight: () => <SaveButton 
        onPress={() => {
          addCollection(title, recipient_id);
          navigation.goBack();
        }}
      />
    });
  });

  useHideBottomTab();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center'
      }}
    >
      <View
        style={{
          height: theme.sizes[40],
          width: theme.sizes[40],
          backgroundColor: theme.colors.warmGray[300],
          borderRadius: theme.sizes[6],
          marginTop: theme.sizes[8]
        }}
      >
      </View>
      <Pressable
        style={{
          marginTop: theme.sizes[3],
          marginBottom: theme.sizes[6]
        }}
      >
        <Text
          style={{
            fontSize: theme.sizes[3],
            color: theme.colors.primary[400]
          }}
        >
          Add Cover
        </Text>
      </Pressable>
      <View
        style={{
          width: '100%',
          paddingHorizontal: theme.sizes['3.5']
        }}
      >
        <View
          style={{
            paddingVertical: theme.sizes[4],
            borderRadius: theme.sizes[4],
            backgroundColor: theme.colors.light[50],
            paddingHorizontal: theme.sizes[5]
          }}
        >
          <TextInput 
            value={title}
            onChangeText={setTitle}
            placeholder='Title'
            keyboardType='default'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export {AddCollectionModal};