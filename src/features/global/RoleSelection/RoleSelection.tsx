// external dependencies
import {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';

// internal dependencies
import {RoleSelectionProps} from 'navigators/navigation-types';
import {ThemeContext, AuthContext} from 'contexts';
import {Button} from 'components/Button';
import auth from '@react-native-firebase/auth';

export const RoleSelection = ({navigation}: RoleSelectionProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  const styles = StyleSheet.create({
    logo: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.colors.light[50],
    },
    slogan: {
      height: 100,
      width: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
  });

  return (
    <View
      style={{
        ...styles.logo,
      }}>
      {/* <View
        style={{
          ...styles.slogan,
          backgroundColor: theme.colors.primary[400],
        }}></View> */}
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.fontSizes['5xl'],
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.primary[400],
          marginBottom: 24,
        }}>
        Welcome!
      </Text>
      {/* <Text
        style={{
          fontSize: theme.fontSizes.md,
          color: theme.colors.primary[400],
          marginBottom: 15,
        }}>
        I am a
      </Text> */}
      <Button
        title="Caregiver View"
        onPress={() => {
          navigation.navigate('Caregiver');
        }}
      />
      <Button
        title="Recipient View"
        onPress={() => {
          navigation.navigate('Recipient', {screen: 'Recipient Verification'});
        }}
      />
      <Button
        title="Sign Out"
        onPress={async () => {
          await auth().signOut();
        }}
      />
    </View>
  );
};
