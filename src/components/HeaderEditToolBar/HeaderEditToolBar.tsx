// external dependencies
import {View, Text, Pressable, Animated} from 'react-native';
import {useContext} from 'react';

// internal dependencies
import {AddButton} from 'components/AddButton';
import {ThemeContext} from 'contexts';

interface HeaderEditToolBarProps {
  isEditing: boolean;
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
  itemsNumber: number;
  enterAnim: Animated.CompositeAnimation;
  exitAnim: Animated.CompositeAnimation;
  opacity_scale: Animated.Value;
  opacity_scale_reversed: Animated.AnimatedSubtraction<string | number>;
  addButtonOnPress: () => void;
  itemType: string;
}

const HeaderEditToolBar = ({
  isEditing,
  setIsEditing,
  itemsNumber,
  enterAnim,
  exitAnim,
  opacity_scale,
  opacity_scale_reversed,
  addButtonOnPress,
  itemType,
}: HeaderEditToolBarProps) => {
  const {theme} = useContext(ThemeContext);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {isEditing && (
        <>
          {itemsNumber > 0 && (
            <Text
              style={{
                color: theme.colors.primary[400],
                marginRight: theme.sizes['2.5'],
              }}>
              <Text style={{fontWeight: theme.fontWeights.bold}}>
                {itemsNumber}
              </Text>{' '}
              {itemsNumber === 1 ? itemType : itemType + 's'}
            </Text>
          )}
          <Pressable
            style={{
              marginRight: theme.sizes[4],
            }}
            onPress={() => {
              exitAnim.start();
              setTimeout(() => {
                setIsEditing(false);
              }, 150);
            }}>
            <Animated.Text
              style={{
                color: theme.colors.primary[400],
                opacity: opacity_scale,
              }}>
              Cancel
            </Animated.Text>
          </Pressable>
        </>
      )}
      {!isEditing && (
        <>
          <Animated.View
            style={{
              opacity: opacity_scale_reversed,
            }}>
            <Pressable
              style={{
                paddingVertical: theme.sizes[2],
                paddingHorizontal: theme.sizes[3],
                marginRight: theme.sizes[2],
                borderRadius: theme.sizes['3.5'],
                backgroundColor: theme.colors.light[200],
              }}
              onPress={() => {
                enterAnim.start();
                setTimeout(() => {
                  setIsEditing(true);
                }, 150);
              }}>
              <Text
                style={{
                  color: theme.colors.primary[400],
                  fontSize: theme.sizes[3],
                  fontWeight: theme.fontWeights.semibold,
                }}>
                Select
              </Text>
            </Pressable>
          </Animated.View>
          <Animated.View
            style={{
              opacity: opacity_scale_reversed,
            }}>
            <AddButton
              onPress={() => {
                addButtonOnPress();
              }}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

export {HeaderEditToolBar};
