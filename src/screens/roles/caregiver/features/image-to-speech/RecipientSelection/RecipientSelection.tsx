import {useContext, useState} from "react";
import {Text, TextInput, View, Pressable, StyleSheet, Platform, ScrollView} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {RecipientSelectionProps} from "screens/navigation-types";

import {ThemeContext} from "contexts";

// psudo data
import {recipients_data} from 'data/index'

const RecipientSelection = ({navigation}: RecipientSelectionProps) => {
    const {theme} = useContext(ThemeContext);
    const [recipients, setRecipients] = useState(recipients_data);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: 20
        },
        header: {
            marginTop: Platform.OS === 'ios' ? 70 : 20,
        },
        heading_text: {
            ...theme.type.l1_header,
            color: theme.colors.primary,
            marginBottom: 20
        },
        search_bar_container: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        search_bar: {
            flex: 1,
            height: 32,
            fontSize: 14,
            padding: 8,
            marginLeft: 5,
            backgroundColor: '#E8E8E8',
            borderRadius: 7
        },
        hr: {
            backgroundColor: theme.colors.grey[500],
            height: 0.5,
            opacity: 0.3,
            marginVertical: 20,
        },
        recipients_list_container: {
            marginTop: -15,
            alignSelf: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        recipient_card_container: {
            width: '50%',
            height: 120,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10
        },
        recipient_card: {
            width: '95%',
            height: '90%',
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            borderRadius: 20
        },
        recipient_text: {
            ...theme.type.l2_header,
            color: theme.colors.background,
            textAlign: 'center',
        }
    });

    const recipients_list = recipients_data.map((recipient) => {
        return (
            <Pressable 
                style={styles.recipient_card_container}
            >
                <View style={styles.recipient_card}>
                    <Text style={styles.recipient_text}>
                        {recipient.name}
                    </Text>
                </View>
            </Pressable>
        )
    })

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <Text style={styles.heading_text}>
                    Recipients
                </Text>
                <View style={styles.search_bar_container}>
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
            <ScrollView contentContainerStyle={styles.recipients_list_container}>
                {recipients_list}
            </ScrollView>
        </View>
    );
}

export {RecipientSelection}