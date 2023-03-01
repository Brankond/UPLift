// external dependencies
import {useContext} from 'react';
import {View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// internal dependencies
import {ThemeContext} from 'contexts';

interface TickSelectionProps {
  ticked: boolean;
  style?: {};
}

const TickSelection = ({ticked, style}: TickSelectionProps) => {
  const {theme} = useContext(ThemeContext);
  return (
    <View
      style={[
        {
          position: 'absolute',
          right: theme.sizes[2],
          top: theme.sizes[2],
          alignItems: 'center',
          justifyContent: 'center',
          height: theme.sizes[4],
          width: theme.sizes[4],
          borderColor: theme.colors.light[50],
          borderWidth: 1.25,
          borderRadius: theme.sizes[2],
          zIndex: 1000,
        },
        {...style},
      ]}>
      {ticked && (
        <>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: theme.sizes[2],
              backgroundColor: theme.colors.primary[400],
              opacity: 1,
            }}></View>
          <MaterialIcon name="check" color={theme.colors.light[50]} />
        </>
      )}
    </View>
  );
};

export {TickSelection};
