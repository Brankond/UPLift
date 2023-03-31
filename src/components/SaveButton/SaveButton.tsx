// external dependencies
import {Pressable, Text} from 'react-native';
import {useContext} from 'react';

// internal dependencies
import {ThemeContext} from 'contexts';

interface SaveButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const SaveButton = ({onPress, disabled = false}: SaveButtonProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <Pressable
      onPress={() => {
        onPress();
      }}
      style={{
        paddingRight: theme.sizes[4],
      }}
      disabled={disabled}>
      <Text
        style={{
          color: disabled
            ? theme.colors.tintedGrey[600]
            : theme.colors.primary[400],
          fontWeight: theme.fontWeights.semibold,
        }}>
        Save
      </Text>
    </Pressable>
  );
};

export {SaveButton};
