// external dependencies
import {memo, useContext} from 'react';
import {View, TextInput} from 'react-native';

// internal dependencies
import {generalStyles, fieldStyles} from '../authStyles';
import {ThemeContext} from 'contexts';

// field type enum
export enum FieldType {
  Email,
  Username,
  Password,
  Phone,
  OTP,
  ConfirmPassword,
  None,
}

// props type
interface TextFieldProps {
  placeHolder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  fieldType: FieldType;
  focusedField: FieldType;
  setFocusedField: React.Dispatch<React.SetStateAction<FieldType>>;
  secureEntry?: boolean;
  icon?: React.ReactNode;
  autoFocus?: boolean;
  maxLength?: number;
}

export const TextField = ({
  placeHolder,
  value,
  setValue,
  fieldType,
  focusedField,
  setFocusedField,
  secureEntry = false,
  icon,
  autoFocus = false,
  maxLength = 50,
}: TextFieldProps) => {
  // context values
  const {theme} = useContext(ThemeContext);
  return (
    <View
      style={[
        generalStyles(theme).row,
        {
          borderColor: theme.colors.primary[400],
          borderRadius: 8,
        },
        fieldStyles(theme, focusedField === fieldType).fieldContainer,
      ]}>
      <TextInput
        maxLength={maxLength}
        secureTextEntry={secureEntry}
        value={value}
        onChangeText={setValue}
        onFocus={() => {
          setFocusedField(fieldType);
        }}
        onBlur={() => {
          setFocusedField(FieldType.None);
        }}
        autoFocus={autoFocus}
        placeholder={placeHolder}
        placeholderTextColor={theme.colors.gray[400]}
        style={[
          generalStyles(theme).text,
          {
            flex: 1,
            padding: 8,
          },
          fieldStyles(theme, focusedField === fieldType).fieldText,
        ]}
      />
      {icon}
    </View>
  );
};
