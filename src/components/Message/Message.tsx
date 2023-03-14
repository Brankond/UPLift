// external dependencies
import {memo, useContext} from 'react';
import {View, Text, StyleProp, ViewStyle, TextStyle} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import FeatherIcon from 'react-native-vector-icons/Feather';

// internal dependencies
import {ThemeContext} from 'contexts';
import {layout} from 'features/global/globalStyles';
import {generalStyles} from 'features/global/authentication/authStyles';

export enum MessageType {
  Instruction,
  Success,
  Danger,
}

type MessageProps = {
  type: MessageType;
  message: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const Message = memo(
  ({type, message, containerStyle, textStyle}: MessageProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[
          layout(theme).rowAlignCentered,
          {
            paddingHorizontal: 16,
          },
          containerStyle,
        ]}>
        {type === MessageType.Success && (
          <FeatherIcon
            name="check"
            color={theme.colors.success[500]}
            size={12}
          />
        )}
        <Text
          style={[
            generalStyles(theme).text,
            {
              color:
                type === MessageType.Danger
                  ? theme.colors.danger[500]
                  : theme.colors.darkText,
              fontSize: 12,
              marginHorizontal: type === MessageType.Success ? 8 : 0,
            },
            textStyle,
          ]}>
          {message}
        </Text>
      </Animated.View>
    );
  },
);

export {Message};
