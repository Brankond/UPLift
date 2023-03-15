// external dependencies
import {useContext, useState, useLayoutEffect, memo} from 'react';
import {
  ViewStyle,
  TextStyle,
  View,
  TextInput,
  Pressable,
  Text,
  Keyboard,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {layout, typography, dimensions} from 'features/global/globalStyles';
import {ThemeContext} from 'contexts';

// props
// allow for customising icon, and styles for both container and textinput
// allow for set custom value and onTextChange callback
interface SearchBarProps {
  containerStyle?: ViewStyle;
  searchBoxStyle?: ViewStyle;
  textStyle?: TextStyle;
  cancelButtonStyle?: ViewStyle;
  icon?: React.ReactNode;
  value?: string | undefined;
  onChangeText?: ((text: string) => void) | undefined;
}

const SearchBar = memo(
  ({
    containerStyle,
    searchBoxStyle,
    textStyle,
    cancelButtonStyle,
    icon,
    value,
    onChangeText,
  }: SearchBarProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    // states
    const [isCancelButtonEnabled, setIsCancelButtonEnabled] =
      useState<boolean>(false);
    const [cancelButtonWidth, setCancelButtonWidth] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    // animated values
    const searchBoxWidth = useSharedValue(0);
    const cancelButtonOpacity = useSharedValue(0);

    // effects
    useLayoutEffect(() => {
      searchBoxWidth.value = containerWidth;
    }, [containerWidth]);

    // animated styles
    const searchBoxAnimatedStyles = useAnimatedStyle(() => {
      return {
        width: withTiming(searchBoxWidth.value),
      };
    });

    const cancelButtonAnimatedStyles = useAnimatedStyle(() => {
      return {
        opacity: withTiming(cancelButtonOpacity.value),
      };
    });

    return (
      <View
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
        style={[layout(theme).rowSpaceBetween, containerStyle]}>
        {/* search box */}
        <Animated.View
          style={[
            layout(theme).rowAlignCentered,
            {
              // flex: 1,
              backgroundColor: theme.colors.tintedGrey[100],
              padding: 16,
              borderRadius: 8,
            },
            searchBoxStyle,
            searchBoxAnimatedStyles,
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
            onFocus={() => {
              searchBoxWidth.value = containerWidth - cancelButtonWidth;
              setTimeout(() => {
                cancelButtonOpacity.value = 1;
                setIsCancelButtonEnabled(true);
              }, 300);
            }}
            onBlur={() => {
              cancelButtonOpacity.value = 0;
              setTimeout(() => {
                setIsCancelButtonEnabled(false);
                searchBoxWidth.value = containerWidth;
              }, 300);
            }}
            placeholder="Search"
            placeholderTextColor={theme.colors.tintedGrey[600]}
            style={[
              typography(theme).mdBodyTextDark,
              Platform.OS === 'android' && dimensions(theme).androidTextSize,
              {
                flex: 1,
                marginLeft: 12,
              },
              textStyle,
            ]}
          />
        </Animated.View>
        {/* cancel button */}
        <Animated.View
          onLayout={event =>
            setCancelButtonWidth(event.nativeEvent.layout.width)
          }
          style={[
            {
              position: 'absolute',
              right: 0,
              paddingLeft: 8,
            },
            cancelButtonStyle,
            cancelButtonAnimatedStyles,
          ]}>
          <Pressable
            style={[layout(theme).rowAlignCentered]}
            disabled={!isCancelButtonEnabled}
            onPress={() => {
              setIsCancelButtonEnabled(false);
              Keyboard.dismiss();
            }}>
            <Text style={[typography(theme).mdBodyTextPrimary]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  },
);

export {SearchBar};
