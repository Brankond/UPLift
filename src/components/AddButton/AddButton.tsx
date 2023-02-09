// external dependencies
import {Pressable} from 'react-native';
import {useContext} from 'react';
import FeatherIcon from "react-native-vector-icons/Feather";

// internal dependencies
import {theme, ThemeContext} from 'contexts';

interface AddButtonProps {
  onPress: () => void,
  disabled?: boolean,
  color?: string
};

const AddButton = ({onPress, disabled = false, color}: AddButtonProps) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Pressable
        disabled={disabled}
        style={{
            paddingRight: theme.sizes[3]
        }}
        onPress={() => {
          onPress();
        }}
    >
        <FeatherIcon
            name='plus'
            color={color === undefined ? theme.colors.primary[400] : color}
            size={theme.sizes[5]}
        />
    </Pressable>
  );
}

export {AddButton};
