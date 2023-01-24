import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
    'Role Selection': undefined,
    'Caregiver': undefined
};

export type CaregiverTabParamList = {
    'Image to Speech': undefined,
    'Forum': undefined,
    'Settings': undefined
};

export type ImageToSpeechStackParamList = {
    'Recipient Selection': undefined
};

export type ForumStackParamList = {
    'Home': undefined
};

export type SettingsStackParamList = {
    'Main Menu': undefined
};

// Screen Props
export type RoleSelectionProps = NativeStackScreenProps<RootStackParamList, 'Role Selection'>;
export type CaregiverBottomTabNavigatorProps = NativeStackScreenProps<RootStackParamList, 'Caregiver'>;

export type ImageToSpeechStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Image to Speech'>;
export type RecipientSelectionProps = NativeStackScreenProps<ImageToSpeechStackParamList, 'Recipient Selection'>;

export type ForumStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Forum'>;
export type HomeProps = NativeStackScreenProps<ForumStackParamList, 'Home'>

export type SettingsStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Settings'>;
export type MainMenuProps = NativeStackScreenProps<SettingsStackParamList, 'Main Menu'>
