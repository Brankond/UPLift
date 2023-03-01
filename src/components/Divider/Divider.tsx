import {View} from "react-native";

import {ThemeContext} from "contexts";
import { useContext } from "react";

type DividerProps = {
    style?: {}
}

const Divider = ({style}: DividerProps) => {
    const {theme} = useContext(ThemeContext);
    return (
        <View
            style={[
                {
                    backgroundColor: theme.colors.warmGray[500],
                    height: 0.5,
                    opacity: 0.3,
                    marginVertical: 20,
                },
                style
            ]}
        >   
        </View>
    )
};

export {Divider};