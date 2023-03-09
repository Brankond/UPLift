// external dependencies
import {memo, useContext} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

// internal dependencies
import {ThemeContext} from 'contexts';
import {TextDivider} from '../../../../components/TextDivider/TextDivider';

export const ExternalLogin = memo(() => {
  // context values
  const {theme} = useContext(ThemeContext);

  // styles
  const styles = StyleSheet.create({
    iconButton: {
      height: 36,
      width: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.primary[400],
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={[{alignItems: 'center'}]}>
      <TextDivider text="Or Via" />
      <View
        style={[
          {
            marginTop: 14,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Pressable
          style={[styles.iconButton, {paddingTop: 1, paddingLeft: 1}]}
          onPress={() => {}}>
          <AntIcon name="google" color={theme.colors.light[50]} size={20} />
        </Pressable>
        <Pressable
          style={[
            styles.iconButton,
            {marginHorizontal: 24, paddingTop: 1, paddingLeft: 1},
          ]}>
          <MaterialIcon
            name="facebook"
            color={theme.colors.light[50]}
            size={24}
          />
        </Pressable>
        <Pressable style={[styles.iconButton]}>
          <AntIcon name="apple1" color={theme.colors.light[50]} size={20} />
        </Pressable>
      </View>
    </View>
  );
});
