// external dependencies
import {useContext, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {SafeAreaView, ScrollView, View, Text, Pressable, useWindowDimensions} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

// internal dependencies
import {SetProps} from "screens/navigation-types";
import {RootState} from "store";
import {selectSetById} from "store/slices/setsSlice";
import {ThemeContext} from "contexts";
import {Divider} from "components";

interface SectionHeaderProps {
    title: string,
    onEditButtonPressed: () => void
}

const SectionHeader = ({title, onEditButtonPressed}: SectionHeaderProps) => {
    const {theme} = useContext(ThemeContext);

    return (
        <>
            <Divider 
                style={{
                    marginVertical: 0,
                    marginHorizontal: theme.sizes[4],
                    marginBottom: theme.sizes[3],
                    backgroundColor: theme.colors.primary[300],
                }}
            />
            <View
                style={{
                    paddingHorizontal: theme.sizes[4],
                    marginBottom: theme.sizes[4],
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Text
                    style={{
                        fontWeight: theme.fontWeights.bold,
                        fontSize: theme.sizes[6],
                        textTransform: 'capitalize',
                        color: theme.colors.primary[400]
                    }}
                >
                    {title}
                </Text>
                <Pressable
                    onPress={() => {
                        onEditButtonPressed();
                    }}
                >
                    <Text
                        style={{
                            fontSize: theme.sizes["3.5"],
                            color: theme.colors.primary[400]
                        }}
                    >
                        Edit
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

const playAudio = () => {
    console.log('Play Audio')
}

const IASet = ({navigation, route}: SetProps) => {
    const {width} = useWindowDimensions();
    const {theme} = useContext(ThemeContext);
    const set_id = route.params.set_id;
    const set = useSelector((state: RootState) => selectSetById(state, set_id));

    useEffect(() => {
        navigation.setOptions({
            headerTitle: set ? set.image_title.charAt(0).toUpperCase() + set.image_title.slice(1) : undefined
        })
    });

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.light[50]
            }}
        >
            <ScrollView>
                <View
                    style={{
                        marginBottom: theme.sizes[6]
                    }}
                >
                    <SectionHeader 
                        title='image'
                        onEditButtonPressed={() => {console.log('Hi')}}
                    />
                    <View
                        style={{
                            width: width,
                            height: width,
                            backgroundColor: theme.colors.warmGray[100]
                        }}
                    >
                    </View>
                </View>
                <View>
                    <SectionHeader 
                        title='audio'
                        onEditButtonPressed={() => {console.log('Hi')}}
                    />
                    <View
                        style={{
                            padding: theme.sizes[4],
                            backgroundColor: theme.colors.primary[400],
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Pressable
                                style={{
                                    backgroundColor: theme.colors.light[50],
                                    height: theme.sizes[12],
                                    width: theme.sizes[12],
                                    borderRadius: theme.sizes[6],
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: theme.sizes[4]
                                }}
                                onPress={() => {playAudio()}}
                            >   
                                <MaterialIcon 
                                    name='play-arrow'
                                    color={theme.colors.primary[400]}
                                    size={theme.sizes[6]}
                                />
                            </Pressable>
                            <Text
                                style={{
                                    fontWeight: theme.fontWeights.semibold,
                                    color: theme.colors.light[50],
                                    textTransform: 'capitalize'
                                }}
                            >
                                {set?.audio_title}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

export {IASet};