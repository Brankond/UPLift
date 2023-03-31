// external dependencies
import {memo, useContext} from 'react';
import {Text, Pressable} from 'react-native';
import {StyleProp, TextStyle, ViewStyle, PressableProps} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {generalStyles} from '../../features/global/authentication/authStyles';

export enum Appearance {
  Stuffed,
  Outlined,
}

type ActionButtonProps = {
  text: string;
  onPress?: () => void;
  appearance?: Appearance;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
} & PressableProps;

// login button
export const ActionButton = memo(
  ({
    text,
    disabled,
    onPress,
    appearance = Appearance.Stuffed,
    containerStyle,
    textStyle,
  }: ActionButtonProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    return (
      <Pressable
        style={[
          {
            height: 48,
            borderRadius: 24,
            backgroundColor:
              appearance === Appearance.Stuffed
                ? theme.colors.primary[400]
                : undefined,
            borderColor:
              appearance === Appearance.Stuffed
                ? undefined
                : theme.colors.primary[400],
            borderWidth: appearance === Appearance.Stuffed ? undefined : 3,
            alignItems: 'center',
            justifyContent: 'center',
          },
          containerStyle,
        ]}
        disabled={disabled}
        onPress={() => {
          if (!onPress) return;
          onPress();
        }}>
        <Text
          style={[
            generalStyles(theme).text,
            {
              color:
                appearance === Appearance.Stuffed
                  ? theme.colors.light[50]
                  : theme.colors.primary[400],
              fontWeight: theme.fontWeights.bold,
            },
            textStyle,
          ]}>
          {text}
        </Text>
      </Pressable>
    );
  },
);
