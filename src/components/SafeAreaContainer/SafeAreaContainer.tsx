// external dependencies
import React from "react";
import {SafeAreaView, View} from "react-native";
import {useContext} from "react";

// internal dependencies
import {ThemeContext} from "contexts";

type Props = {
    child: React.ReactNode
}

const SafeAreaContainer = ({child}: Props) => {
    const {theme} = useContext(ThemeContext);
    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.colors.light[50],
                flex: 1
            }}
        >   
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: theme.sizes[4]
                }}
            >
                {child}
            </View>
        </SafeAreaView>
    )
};

export {SafeAreaContainer};
