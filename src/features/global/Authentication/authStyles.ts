// external dependencies
import {StyleSheet} from 'react-native';

// internal dependencies
import {ThemeType} from 'contexts/theme-context/theme-context';

export const generalStyles = (theme: ThemeType, isFocused?: boolean) =>
  StyleSheet.create({
    bodyContainer: {
      flex: 1,
      backgroundColor: theme.colors.light[50],
    },
    text: {
      color: theme.colors.darkText,
      fontFamily: theme.fonts.main,
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export const fieldStyles = (theme: ThemeType, isFocused?: boolean) =>
  StyleSheet.create({
    fieldContainer: {
      borderColor: isFocused ? theme.colors.primary[400] : '#A9B1BC',
      borderWidth: isFocused ? 1.5 : 1,
    },
    fieldText: {
      fontWeight: theme.fontWeights[isFocused ? 'medium' : 'normal'],
    },
  });
