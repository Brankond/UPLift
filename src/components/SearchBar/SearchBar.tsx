// external dependencies
import {useContext} from 'react';
import {ViewStyle, TextStyle, View, TextInput} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {layout, typography} from 'features/global/globalStyles';
import {ThemeContext} from 'contexts';

// props
// allow for customising icon, and styles for both container and textinput
// allow for set custom value and onTextChange callback
interface SearchBarProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
}

const SearchBar = ({
  containerStyle,
  textStyle,
  icon,
  value,
  onChangeText,
}: SearchBarProps) => {
  // context values
  const {theme} = useContext(ThemeContext);

  return (
    <View
      style={[
        layout(theme).rowAlignCentered,
        {
          backgroundColor: theme.colors.tintedGrey[100],
          padding: 16,
          borderRadius: 8,
        },
        containerStyle,
      ]}>
      {icon || (
        <FeatherIcon
          name="search"
          size={16}
          color={theme.colors.tintedGrey[800]}
        />
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        placeholderTextColor={theme.colors.tintedGrey[600]}
        style={[
          typography(theme).mdBodyTextDark,
          {
            flex: 1,
            marginLeft: 12,
          },
          textStyle,
        ]}
      />
    </View>
  );
};

export {SearchBar};
