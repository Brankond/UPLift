import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  'Role Selection': undefined;
  Caregiver: undefined;
  Recipient: undefined;
};

export type CaregiverStackParamList = {
  'Caregiver Home': undefined;
  'Image to Speech': NavigatorScreenParams<ImageToSpeechStackParamList>;
  Forum: NavigatorScreenParams<ForumStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RecipientStackParamList = {};

export type CaregiverTabParamList = {
  Home: undefined;
  'Recipient Selection': undefined;
  'Main Menu': undefined;
};

export enum SetEditType {
  Image,
  Audio,
}

export type ImageToSpeechStackParamList = {
  'Recipient Selection': undefined;
  'Collection Selection': {
    recipient_first_name: string;
    recipient_id: string;
  };
  Gallery: {
    recipient_id: string;
    recipient_first_name: string;
    collection_id: string;
    collection_title: string;
  };
  Set: {
    set_id: string;
  };
  'Add Collection': {
    recipient_id: string;
    collection_id: string | undefined;
  };
  'Add Set': {
    recipient_id: string | undefined;
    collection_id: string | undefined;
    set_id: string | undefined;
    editType: SetEditType | undefined;
  };
};

export type ForumStackParamList = {
  Home: undefined;
};

export type SettingsStackParamList = {
  'Main Menu': undefined;
  'Recipient Profile': {
    recipient_id: string;
  };
  'Add Recipient': {
    recipient_id: string | undefined;
  };
  'Add Contact': {
    recipient_id: string;
    contact_id: string | undefined;
  };
};

// Screen Props
export type RoleSelectionProps = StackScreenProps<
  RootStackParamList,
  'Role Selection'
>;
export type CaregiverStackNavigatorProps = StackScreenProps<
  RootStackParamList,
  'Caregiver'
>;
export type RecipientStackNavigatorProps = StackScreenProps<
  RootStackParamList,
  'Recipient'
>;

export type CaregiverBottomTabNavigatorProps = StackScreenProps<
  CaregiverStackParamList,
  'Caregiver Home'
>;

export type ImageToSpeechStackNavigatorProps = StackScreenProps<
  CaregiverStackParamList,
  'Image to Speech'
>;
export type RecipientSelectionProps = CompositeScreenProps<
  BottomTabScreenProps<CaregiverTabParamList, 'Recipient Selection'>,
  StackScreenProps<ImageToSpeechStackParamList, 'Recipient Selection'>
>;
export type CollectionSelectionProps = StackScreenProps<
  ImageToSpeechStackParamList,
  'Collection Selection'
>;
export type GalleryProps = StackScreenProps<
  ImageToSpeechStackParamList,
  'Gallery'
>;
export type SetProps = StackScreenProps<ImageToSpeechStackParamList, 'Set'>;

export type AddCollectionModalProps = StackScreenProps<
  ImageToSpeechStackParamList,
  'Add Collection'
>;
export type AddSetModalProps = StackScreenProps<
  ImageToSpeechStackParamList,
  'Add Set'
>;

export type ForumStackNavigatorProps = StackScreenProps<
  CaregiverStackParamList,
  'Forum'
>;
export type HomeProps = StackScreenProps<ForumStackParamList, 'Home'>;

export type SettingsStackNavigatorProps = StackScreenProps<
  CaregiverStackParamList,
  'Settings'
>;
export type MainMenuProps = BottomTabScreenProps<
  CaregiverTabParamList,
  'Main Menu'
>;
export type RecipientProfileProps = StackScreenProps<
  SettingsStackParamList,
  'Recipient Profile'
>;
export type AddRecipientModalProps = StackScreenProps<
  SettingsStackParamList,
  'Add Recipient'
>;
export type AddContactModalProps = StackScreenProps<
  SettingsStackParamList,
  'Add Contact'
>;
