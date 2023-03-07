// external dependencies
import {memo, useContext} from 'react';
import {Text, Pressable} from 'react-native';
import {ViewProps} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {generalStyles} from '../authStyles';

export enum Appearance {
  Stuffed,
  Outlined,
}

type ActionButtonProps = {
  text: string;
  onPress?: () => void;
  appearance?: Appearance;
};

// login button
export const ActionButton = memo(
  ({text, onPress, appearance = Appearance.Stuffed}: ActionButtonProps) => {
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
        ]}
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
          ]}>
          {text}
        </Text>
      </Pressable>
    );
  },
);
