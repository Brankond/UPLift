// external dependencies
import {View, Text, Pressable, Animated} from 'react-native';
import {useContext, useEffect, useState} from 'react';

// internal dependencies
import {AddButton} from 'components/AddButton';
import {ThemeContext} from 'contexts';
import {fadeIn, fadeOut} from 'utils/animations';

interface HeaderEditToolBarProps {
  setIsEditing: (value: React.SetStateAction<boolean>) => void;
  itemsNumber: number;
  nonEditingUiAnimatedVal: Animated.Value;
  editingUiAnimatedVal: Animated.Value;
  addButtonOnPress: () => void;
  itemType: string;
}

const HeaderEditToolBar = ({
  setIsEditing,
  itemsNumber,
  nonEditingUiAnimatedVal,
  editingUiAnimatedVal,
  addButtonOnPress,
  itemType,
}: HeaderEditToolBarProps) => {
  const {theme} = useContext(ThemeContext);
  const [isNonEditingUiDisplayed, setIsNonEditingUiDisplayed] = useState(true);
  const [isEditingUiDisplayed, setIsEditingUiDisplayed] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {isNonEditingUiDisplayed && (
        <>
          <Animated.View
            style={{
              opacity: nonEditingUiAnimatedVal,
            }}>
            <Pressable
              style={{
                paddingVertical: theme.sizes[2],
                paddingHorizontal: theme.sizes[3],
                marginRight: theme.sizes[2],
                borderRadius: theme.sizes['3.5'],
                backgroundColor: theme.colors.tintedGrey[100],
              }}
              onPress={() => {
                setIsEditing(true);
                fadeOut(nonEditingUiAnimatedVal);
                setTimeout(() => {
                  setIsNonEditingUiDisplayed(false);
                  setIsEditingUiDisplayed(true);
                  fadeIn(editingUiAnimatedVal);
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
              opacity: nonEditingUiAnimatedVal,
            }}>
            <AddButton
              onPress={() => {
                addButtonOnPress();
              }}
            />
          </Animated.View>
        </>
      )}
      {isEditingUiDisplayed && (
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
              setIsEditing(false);
              fadeOut(editingUiAnimatedVal);
              setTimeout(() => {
                setIsEditingUiDisplayed(false);
                setIsNonEditingUiDisplayed(true);
                fadeIn(nonEditingUiAnimatedVal);
              }, 150);
            }}>
            <Animated.Text
              style={{
                color: theme.colors.primary[400],
                opacity: editingUiAnimatedVal,
              }}>
              Cancel
            </Animated.Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export {HeaderEditToolBar};
