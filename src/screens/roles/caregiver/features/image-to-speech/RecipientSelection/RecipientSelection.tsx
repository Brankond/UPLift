import {useContext, useState} from "react";
import {Text, TextInput, View, Pressable, StyleSheet, Platform, SectionList} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

import {RecipientSelectionProps} from "screens/navigation-types";

import {ThemeContext} from "contexts";

// psudo data
import {alphabetic_ordered_recipients_data} from 'data/index'

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
    const {theme} = useContext(ThemeContext);
    const [recipients, setRecipients] = useState(alphabetic_ordered_recipients_data);

    const styles = StyleSheet.create({
        /** body container */
        container: {
            flex: 1,
            paddingHorizontal: 20,
            backgroundColor: theme.colors.background
        },

        /** header */
        header: {
            marginTop: Platform.OS === 'ios' ? 70 : 20,
        },
        heading_text: {
            ...theme.type.l1_header,
            color: theme.colors.primary,
            marginBottom: 20
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

        /** shared elements */
        hr: {
            backgroundColor: theme.colors.grey[500],
            height: 0.5,
            opacity: 0.3,
            marginVertical: 20,
        },

        /** utilities */
        row_centered_flex_box: {
            flexDirection: 'row',
            alignItems: 'center'
        }
    });

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <Text style={styles.heading_text}>
                    Recipients
                </Text>
                <View style={styles.row_centered_flex_box}>
                    <Ionicons 
                        name="search"
                        size={16}
                    />
                    <TextInput 
                        style={styles.search_bar}
                        placeholder="Search"
                    />
                </View>
                <View style={styles.hr}></View>
            </View>

            {/* recipients list */}
            <SectionList 
                sections={alphabetic_ordered_recipients_data}
                renderItem={
                    ({item}) => (
                        <Pressable key={item.id} >
                            <View
                                style={{
                                    ...styles.row_centered_flex_box,
                                    marginTop: 20,
                                    marginBottom: 28
                                }}
                            >   
                                <View
                                    style={{
                                        height: 48,
                                        width: 48,
                                        borderRadius: 24,
                                        backgroundColor: theme.colors.grey[300]
                                    }}
                                >
                                </View>
                                <View
                                    style={{
                                        marginLeft: 16
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: theme.font_family.semi_bold,
                                        }}
                                    >
                                        {item.name}
                                    </Text>
                                    <View
                                        style={{
                                            ...styles.row_centered_flex_box,
                                            marginTop: 7
                                        }}
                                    >
                                        <MaterialIcons 
                                            name='location-on'
                                            color={theme.colors.primary}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: theme.font_family.semi_bold,
                                                color: theme.colors.primary,
                                                fontSize: 12
                                            }}
                                        >
                                            at
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: theme.font_size.extra_small,
                                                marginLeft: 6
                                            }}
                                        >
                                            The realtime location of this recipient
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View 
                                style={{
                                    ...styles.hr,
                                    marginVertical: 0,
                                }}
                            ></View>
                        </Pressable>
                    )
                }
                renderSectionHeader={
                    ({section}) => (
                        <>
                            <View style={{backgroundColor: theme.colors.background}}>
                                <Text 
                                    style={{
                                        fontSize: theme.font_size.extra_small
                                    }}
                                >
                                    {section.alphabet}
                                </Text>
                                <View
                                    style={{
                                        ...styles.hr,
                                        marginBottom: 0,
                                        marginTop: 6
                                    }}
                                ></View>
                            </View>
                        </>
                    )
                }
                renderSectionFooter={
                    ({section}) => (
                        <View style={{marginBottom: theme.spacing.l}}></View>
                    )
                }
            />
        </View>
    );
}

export {RecipientSelection}