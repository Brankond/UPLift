// external dependencies
import {memo, useContext} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  PressableProps,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

// internal dependencies
import {ThemeContext} from 'contexts';
import {appleLogin, googleLogin, facebookLogin} from 'services/fireBaseAuth';
import {TextDivider} from 'components/TextDivider/TextDivider';
import {layout, typography} from 'features/global/globalStyles';

const appleIconXml = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg height="512px" id="形状_1_1_" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="形状_1"><g><path d="M381.604,270.943c-0.585-58.285,47.526-86.241,49.673-87.647    c-27.032-39.536-69.153-44.961-84.15-45.572c-35.81-3.645-69.92,21.096-88.095,21.096c-18.129,0-46.203-20.566-75.902-20.046    c-39.08,0.585-75.09,22.731-95.201,57.711c-40.577,70.387-10.375,174.71,29.162,231.845c19.334,27.92,42.385,59.346,72.624,58.195    c29.152-1.151,40.158-18.859,75.391-18.859c35.234,0,45.135,18.859,75.968,18.266c31.343-0.567,51.216-28.459,70.395-56.496    c22.185-32.44,31.326-63.848,31.865-65.446C442.656,363.678,382.232,340.526,381.604,270.943z M323.665,99.913    c16.037-19.471,26.904-46.531,23.955-73.464c-23.151,0.94-51.171,15.389-67.784,34.842    c-14.887,17.261-27.909,44.741-24.421,71.189C281.232,134.481,307.572,119.348,323.665,99.913z" style="fill-rule:evenodd;clip-rule:evenodd;fill:#1B1B1B;"/></g></g></svg>`;

const googleIconXml = `<?xml version="1.0" ?><!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 1.1//EN'  'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'><svg enable-background="new 0 0 128 128" id="Social_Icons" version="1.1" viewBox="0 0 128 128" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="_x31__stroke"><g id="Google"><rect clip-rule="evenodd" fill="none" fill-rule="evenodd" height="128" width="128"/><path clip-rule="evenodd" d="M27.585,64c0-4.157,0.69-8.143,1.923-11.881L7.938,35.648    C3.734,44.183,1.366,53.801,1.366,64c0,10.191,2.366,19.802,6.563,28.332l21.558-16.503C28.266,72.108,27.585,68.137,27.585,64" fill="#FBBC05" fill-rule="evenodd"/><path clip-rule="evenodd" d="M65.457,26.182c9.031,0,17.188,3.2,23.597,8.436L107.698,16    C96.337,6.109,81.771,0,65.457,0C40.129,0,18.361,14.484,7.938,35.648l21.569,16.471C34.477,37.033,48.644,26.182,65.457,26.182" fill="#EA4335" fill-rule="evenodd"/><path clip-rule="evenodd" d="M65.457,101.818c-16.812,0-30.979-10.851-35.949-25.937    L7.938,92.349C18.361,113.516,40.129,128,65.457,128c15.632,0,30.557-5.551,41.758-15.951L86.741,96.221    C80.964,99.86,73.689,101.818,65.457,101.818" fill="#34A853" fill-rule="evenodd"/><path clip-rule="evenodd" d="M126.634,64c0-3.782-0.583-7.855-1.457-11.636H65.457v24.727    h34.376c-1.719,8.431-6.397,14.912-13.092,19.13l20.474,15.828C118.981,101.129,126.634,84.861,126.634,64" fill="#4285F4" fill-rule="evenodd"/></g></g></svg>`;

const phoneIconXml = `<?xml version="1.0" ?><svg data-name="01-phone" id="_01-phone" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><rect class="cls-1" height="30" rx="2" ry="2" width="18" x="7" y="1"/><line class="cls-1" x1="15" x2="17" y1="27" y2="27"/><path class="cls-1" d="M20,1V3a2,2,0,0,1-2,2H14a2,2,0,0,1-2-2V1"/></svg>`;

export enum PasswordLessLoginTypes {
  Google,
  Apple,
  Phone,
}

type PasswordLessLoginButtonProps = {
  type: PasswordLessLoginTypes;
  containerStyle?: StyleProp<ViewStyle>;
} & PressableProps;

const mapLoginTypeToXml = (type: PasswordLessLoginTypes): string => {
  switch (type) {
    case PasswordLessLoginTypes.Google:
      return googleIconXml;
    case PasswordLessLoginTypes.Apple:
      return appleIconXml;
    case PasswordLessLoginTypes.Phone:
      return phoneIconXml;
  }
};

const mapLoginTypeToText = (type: PasswordLessLoginTypes): string => {
  switch (type) {
    case PasswordLessLoginTypes.Google:
      return 'Google';
    case PasswordLessLoginTypes.Apple:
      return 'Apple';
    case PasswordLessLoginTypes.Phone:
      return 'Phone Number';
  }
};

export const PasswordLessLogin = memo(
  ({type, onPress, containerStyle}: PasswordLessLoginButtonProps) => {
    // context values
    const {theme} = useContext(ThemeContext);

    return (
      <Pressable
        style={[
          layout(theme).rowAlignCentered,
          {
            backgroundColor: theme.colors.tintedGrey[100],
            padding: 16,
            borderRadius: 20,
            gap: 16,
          },
          containerStyle,
        ]}
        onPress={onPress}>
        {/* external provider icon */}
        <View
          style={[
            {
              height: 20,
              width: 20,
            },
          ]}>
          <SvgCss
            xml={mapLoginTypeToXml(type)}
            height={'100%'}
            width={'100%'}
          />
        </View>
        <Text
          style={[
            typography(theme).mdBodyTextDark,
            {
              fontWeight: theme.fontWeights.semibold,
            },
          ]}>
          {`Login with ${mapLoginTypeToText(type)}`}
        </Text>
      </Pressable>
    );
  },
);
