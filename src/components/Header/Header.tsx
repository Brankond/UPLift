import {Text, Pressable, TextInput, StyleSheet} from 'react-native';
import {useContext} from 'react';

import Ionicon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {Box} from 'native-base';

import {ThemeContext} from 'contexts';

import {Divider} from 'components/Divider';
import {color} from 'native-base/lib/typescript/theme/styled-system';

type HeaderProps = {
  title: string;
  searchBarShown?: boolean;
};

const Header = ({title, searchBarShown = true}: HeaderProps) => {
  const {theme} = useContext(ThemeContext);
  const styles = StyleSheet.create({
    /** header container */
    heading_text: {
      fontFamily: theme.fonts.main,
      fontWeight: theme.fontWeights.bold,
      fontSize: theme.fontSizes['3.5xl'],
      color: theme.colors.primary[400],
      marginBottom: searchBarShown ? theme.sizes[5] : 0,
      textTransform: 'capitalize',
    },

    // search bar
    search_bar: {
      flex: 1,
      height: 32,
      fontSize: 14,
      padding: 8,
      marginLeft: 5,
      backgroundColor: theme.colors.tintedGrey[100],
      borderRadius: 7,
    },
  });

  return (
    <Box mb={5}>
      <Text style={styles.heading_text}>{title}</Text>
      {searchBarShown && (
        <Box flexDirection={'row'} alignItems={'center'}>
          <Ionicon
            name="search"
            size={16}
            color={theme.colors.tintedGrey[800]}
          />
          <TextInput
            style={[
              styles.search_bar,
              {
                fontFamily: theme.fonts.main,
              },
            ]}
            placeholder="Search"
            placeholderTextColor={theme.colors.tintedGrey[500]}
          />
        </Box>
      )}
    </Box>
  );
};

export {Header};
