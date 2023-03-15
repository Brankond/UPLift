// external dependencies
import {memo, useContext} from 'react';
import {View, Pressable, StyleSheet, Platform} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

// internal dependencies
import {ThemeContext} from 'contexts';
import {appleLogin, googleLogin, facebookLogin} from 'services/fireBaseAuth';
import {TextDivider} from 'components/TextDivider/TextDivider';

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
          onPress={async () => {
            await googleLogin();
          }}>
          <AntIcon name="google" color={theme.colors.light[50]} size={20} />
        </Pressable>
        {/* facebook authentication disabled as Facebook Login API is only for business usage */}
        {/* <Pressable
          style={[
            styles.iconButton,
            {marginHorizontal: 24, paddingTop: 1, paddingLeft: 1},
          ]}
          onPress={async () => {
            await facebookLogin();
          }}>
          <MaterialIcon
            name="facebook"
            color={theme.colors.light[50]}
            size={24}
          />
        </Pressable> */}
        {Platform.OS === 'ios' && (
          <Pressable
            style={[styles.iconButton]}
            onPress={async () => {
              await appleLogin();
            }}>
            <AntIcon name="apple1" color={theme.colors.light[50]} size={20} />
          </Pressable>
        )}
      </View>
    </View>
  );
});
