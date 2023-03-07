// external dependencies
import {memo, useContext} from 'react';
import {View, Text} from 'native-base';

// internal dependencies
import {ThemeContext} from 'contexts';
import {generalStyles} from '../authStyles';

export const TextDivider = memo(
  ({text, width = '70%'}: {text: string; width?: string}) => {
    // context values
    const {theme} = useContext(ThemeContext);
    return (
      <View
        style={[
          {
            width: width,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View
          style={[
            {
              flex: 1,
              borderBottomColor: theme.colors.tintedGrey[900],
              borderBottomWidth: 0.5,
            },
          ]}></View>
        <Text
          style={[
            generalStyles(theme).text,
            {
              marginHorizontal: 8,
              fontSize: 14,
            },
          ]}>
          {text}
        </Text>
        <View
          style={[
            {
              flex: 1,
              borderBottomColor: theme.colors.tintedGrey[900],
              borderBottomWidth: 0.5,
            },
          ]}></View>
      </View>
    );
  },
);
