// external dependencies
import {StyleSheet} from 'react-native';

// internal dependencies
import {ThemeType} from 'contexts/ThemeContext/ThemeContext';

export const typography = (theme: ThemeType) => {
  const fontFamily = theme.fonts.main;

  const middleText = {
    fontFamily,
    fontWeight: theme.fontWeights.medium,
  };

  const boldText = {
    fontFamily,
    fontWeight: theme.fontWeights.bold,
  };

  return StyleSheet.create({
    lgHeadingText: {
      ...boldText,
      fontSize: 32,
      color: theme.colors.primary[400],
    },
    mdHeadingText: {
      ...boldText,
      fontSize: 24,
      color: theme.colors.primary[400],
    },
    lgBodyTextPrimary: {
      fontFamily,
      fontSize: 16,
      color: theme.colors.primary[400],
    },
    lgBodyTextDark: {
      fontFamily,
      fontSize: 16,
      color: theme.colors.darkText,
    },
    mdBodyTextDark: {
      fontFamily,
      fontSize: 14,
      color: theme.colors.darkText,
    },
    mdBodyTextPrimary: {
      fontFamily,
      fontSize: 14,
      color: theme.colors.primary[400],
    },
    smEmphasizeTextPrimary: {
      ...middleText,
      fontSize: 14,
      color: theme.colors.primary[400],
    },
    smEmphasizeTextShallow: {
      ...middleText,
      fontSize: 14,
      color: theme.colors.tintedGrey[500],
    },
    lgSecondaryText: {
      fontFamily,
      fontSize: 14,
      color: theme.colors.tintedGrey[600],
    },
    smSecondaryText: {
      fontFamily,
      fontSize: 12,
      color: theme.colors.tintedGrey[600],
    },
  });
};

export const layout = (theme: ThemeType) => {
  return StyleSheet.create({
    rowAlignCentered: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowSpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export const dimensions = (theme: ThemeType) => {
  return StyleSheet.create({
    androidTextSize: {
      padding: 0,
      margin: 0,
      height: 20,
    },
  });
};
