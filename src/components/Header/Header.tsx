import {Text, Pressable, TextInput, StyleSheet} from "react-native";
import {useContext} from "react";

import Ionicon from "react-native-vector-icons/Ionicons";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import {Box} from "native-base";

import {ThemeContext} from "contexts";

import {Divider} from "components/Divider";
import { color } from "native-base/lib/typescript/theme/styled-system";

type HeaderProps = {
    title: string,
}

const Header = ({title}: HeaderProps) => {
    const {theme} = useContext(ThemeContext);
    const styles = StyleSheet.create({
        /** header container */
        heading_text: {
            fontWeight: theme.fontWeights.bold,
            fontSize: theme.fontSizes["3.5xl"],
            color: theme.colors.primary[400],
            marginBottom: theme.sizes[5],
            textTransform: 'capitalize'
        },
        
        // search bar
        search_bar: {
            flex: 1,
            height: 32,
            fontSize: 14,
            padding: 8,
            marginLeft: 5,
            backgroundColor: '#E8E8E8',
            borderRadius: 7
        },
    })

    return (
        <Box
            mb={5}
        >               
            <Text style={styles.heading_text}>
                {title}
            </Text>
            <Box
                flexDirection={'row'}
                alignItems={'center'}
            >
                <Ionicon 
                    name="search"
                    size={16}
                />
                <TextInput 
                    style={styles.search_bar}
                    placeholder="Search"
                />
            </Box>
        </Box>
    )

}

export {Header}