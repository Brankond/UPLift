import {useContext} from "react";
import {
    Text,
    View,
    StyleSheet
  } from 'react-native';

import {RoleSelectionProps} from "screens/navigation-types";

import {ThemeContext} from 'contexts';
  
import {Button} from 'components/Button';

export const RoleSelection = ({navigation}: RoleSelectionProps) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View
      style={{
        ...styles.logo
      }}
    >
      <View
        style={{
          ...styles.slogan,
          backgroundColor: theme.colors.primary,
        }}
      >
      </View>
      <Text 
        style={{
          ...theme.type.l0_header,
          color: theme.colors.primary,
          marginBottom: 75
        }}
      >
          UPlift
      </Text>
      <Text
        style={{
          ...theme.type.body,
          color: theme.colors.primary,
          marginBottom: 15
        }}
      >
        I am a
      </Text>
      <Button
        title="Caregiver"
        onPress={() => {
          navigation.navigate('Caregiver')
        }}
      />
      <Button
        title="Recipient"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  slogan: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginBottom: 20,
  }
})