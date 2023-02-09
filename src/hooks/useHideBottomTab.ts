import {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";

const useHideBottomTab = () => {
    const {getParent} = useNavigation();

    useEffect(() => {
        const parent = getParent();

        parent?.setOptions({
            tabBarStyle: {
                display: 'none'
            }
        });

        return () => {
            parent?.setOptions({
                tabBarStyle: {
                    display: 'flex'
                }
            });
        }
    }, [])
};

export {useHideBottomTab};