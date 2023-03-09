// external dependencies
import {memo, useContext, useState} from 'react';
import {View, TextInput} from 'react-native';

// internal dependencies
import {
  generalStyles,
  fieldStyles,
} from '../../features/global/authentication/authStyles';
import {ThemeContext} from 'contexts';
import {Input} from 'native-base';

// field type enum
export enum FieldType {
  Email,
  Username,
  Password,
  Phone,
  OTP,
  ConfirmPassword,
  RecipientCode,
  None,
}

// appearance enum
export enum InputAppearance {
  Square,
  Round,
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
  appearance?: InputAppearance;
}

export const TextField = memo(
  ({
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
    appearance = InputAppearance.Square,
  }: TextFieldProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    // states
    const [focused, setFocused] = useState<boolean>(false);

    return (
      <View
        style={[
          generalStyles(theme).row,
          {
            borderColor: theme.colors.primary[400],
            borderRadius: appearance === InputAppearance.Square ? 8 : 20,
          },
          {
            paddingVertical: appearance === InputAppearance.Square ? 8 : 10,
            paddingHorizontal: appearance === InputAppearance.Square ? 8 : 16,
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
            },
            fieldStyles(theme, focusedField === fieldType).fieldText,
          ]}
        />
        {icon}
      </View>
    );
  },
);
