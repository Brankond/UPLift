// external dependencies
import {useContext} from 'react';
import {Text, View, StyleSheet} from 'react-native';

// internal dependencies
import {RoleSelectionProps} from 'navigators/navigation-types';
import {ThemeContext} from 'contexts';
import {Button} from 'components/Button';

export const RoleSelection = ({navigation}: RoleSelectionProps) => {
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
      <View
        style={{
          ...styles.slogan,
          backgroundColor: theme.colors.primary[400],
        }}></View>
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.fontSizes['5xl'],
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.primary[400],
          marginBottom: 75,
        }}>
        UPlift
      </Text>
      <Text
        style={{
          fontSize: theme.fontSizes.md,
          color: theme.colors.primary[400],
          marginBottom: 15,
        }}>
        I am a
      </Text>
      <Button
        title="Caregiver"
        onPress={() => {
          navigation.navigate('Caregiver');
        }}
      />
      <Button
        title="Recipient"
        onPress={() => {
          navigation.navigate('Recipient');
        }}
      />
    </View>
  );
};
