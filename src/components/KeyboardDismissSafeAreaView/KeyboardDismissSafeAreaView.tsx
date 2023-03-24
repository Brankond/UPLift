/**
 * A safe-area-view that dismisses keyboard upon press events
 */

// external dependencies
import {memo, useContext} from 'react';
import {Keyboard, Pressable, SafeAreaView, ViewProps} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';

interface KeyboardDismissSafeAreaViewProps {
  children?: React.ReactNode;
}

const KeyboardDismissSafeAreaView = memo(
  ({style, children}: KeyboardDismissSafeAreaViewProps & ViewProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    return (
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor: theme.colors.light[50],
          },
        ]}>
        <Pressable
          style={[
            {
              flex: 1,
            },
            style,
          ]}
          onPress={() => {
            Keyboard.dismiss();
          }}>
          {children}
        </Pressable>
      </SafeAreaView>
    );
  },
);

export {KeyboardDismissSafeAreaView};
