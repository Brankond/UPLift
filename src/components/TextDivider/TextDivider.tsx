// external dependencies
import {memo, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// internal dependencies
import {ThemeContext} from 'contexts';
import {generalStyles} from '../../features/global/authentication/authStyles';

export const TextDivider = memo(
  ({text, width = '70%'}: {text: string; width?: string}) => {
    // context values
    const {theme} = useContext(ThemeContext);

    // styles
    const styles = StyleSheet.create({
      sideLineBreak: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        opacity: 0.5,
        backgroundColor: theme.colors.tintedGrey[800],
      },
    });

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
        <View style={[styles.sideLineBreak]}></View>
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
        <View style={[styles.sideLineBreak]}></View>
      </View>
    );
  },
);
