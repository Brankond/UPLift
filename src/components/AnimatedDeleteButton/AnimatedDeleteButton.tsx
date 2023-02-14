// external dependencies
import {Animated, StyleSheet, Pressable} from 'react-native';
import {useContext} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from 'contexts';

interface AnimatedDeleteButtonProps {
  editButtonAnim: Animated.Value;
  onPress: () => void;
}

const AnimatedDeleteButton = ({
  editButtonAnim,
  onPress,
}: AnimatedDeleteButtonProps) => {
  // import theme
  const {theme} = useContext(ThemeContext);
  const styles = StyleSheet.create({
    editionPanelDeleteButton: {
      height: theme.sizes[16],
      width: theme.sizes[16],
      borderRadius: theme.sizes[8],
      backgroundColor: theme.colors.light[50],
      shadowColor: theme.colors.dark[300],
      shadowOffset: {
        width: theme.sizes[1],
        height: theme.sizes[1],
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      position: 'absolute',
      left: '50%',
      transform: [{translateX: -theme.sizes[4]}],
      bottom: theme.sizes[4],
    },
  });
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);

  return (
    <Animated.View
      style={[
        styles.editionPanelDeleteButton,
        {
          opacity: editButtonAnim,
        },
      ]}>
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          onPress();
        }}>
        <AnimatedIcon
          name="delete"
          color={theme.colors.danger[500]}
          size={theme.sizes[8]}
          style={{
            transform: [{scale: editButtonAnim}],
          }}
        />
      </Pressable>
    </Animated.View>
  );
};

export {AnimatedDeleteButton};
