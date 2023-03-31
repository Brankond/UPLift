// external dependencies
import {memo, useContext, useState} from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

// internal dependencies
import {
  generalStyles,
  fieldStyles,
} from '../../features/global/authentication/authStyles';
import {ThemeContext} from 'contexts';

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
type TextFieldProps = TextInputProps & {
  // placeHolder: string;
  // value: string;
  // setValue: React.Dispatch<React.SetStateAction<string>>;
  fieldType: FieldType;
  focusedField: FieldType;
  setFocusedField: React.Dispatch<React.SetStateAction<FieldType>>;
  // secureEntry?: boolean;
  icon?: React.ReactNode;
  // autoFocus?: boolean;
  // maxLength?: number;
  appearance?: InputAppearance;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const TextField = memo(
  ({
    // Native textinput props
    editable,
    placeholder,
    value,
    onChangeText,
    onEndEditing,
    secureTextEntry = false,
    icon,
    autoFocus = false,
    maxLength = 50,

    // Custom props
    fieldType,
    focusedField,
    setFocusedField,
    appearance = InputAppearance.Square,
    containerStyle,
    textStyle,
  }: TextFieldProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

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
          containerStyle,
        ]}>
        <TextInput
          editable={editable}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocusedField(fieldType);
          }}
          onEndEditing={onEndEditing}
          onBlur={() => {
            setFocusedField(FieldType.None);
          }}
          autoFocus={autoFocus}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.gray[400]}
          style={[
            generalStyles(theme).text,
            {
              flex: 1,
              // clear extra-padding on android devices
              padding: 0,
            },
            fieldStyles(theme, focusedField === fieldType).fieldText,
            textStyle,
          ]}
        />
        {icon}
      </View>
    );
  },
);
