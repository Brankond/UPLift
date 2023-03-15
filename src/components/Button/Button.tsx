import {useContext} from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {ThemeContext} from 'contexts/index';

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

const Button = ({title, onPress}: ButtonProps) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Pressable
      style={{
        ...styles.button,
        borderColor: theme.colors.primary[400],
      }}
      onPress={() => {
        if (onPress) onPress();
      }}>
      <Text
        style={{
          fontFamily: theme.fonts.main,
          fontSize: theme.fontSizes.md,
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.primary[400],
        }}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 125,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export {Button};
