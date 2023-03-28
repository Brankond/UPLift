import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  PhoneLogin: undefined;
  Signup: undefined;
  'Role Selection': undefined;
  Caregiver: undefined;
  Recipient: NavigatorScreenParams<RecipientStackParamList>;
};

export type CaregiverStackParamList = {
  'Caregiver Home': undefined;
  'Image to Speech': NavigatorScreenParams<ImageToSpeechStackParamList>;
  Forum: NavigatorScreenParams<ForumStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type RecipientStackParamList = {
  'Recipient Verification': undefined;
  'Recipient View': {
    recipientId: string;
  };
};

export type CaregiverTabParamList = {
  Home: undefined;
  'Recipient Selection': undefined;
  'Main Menu': undefined;
};

export enum SetEditType {
  Image = 'Image',
  Audio = 'Audio',
}

export type ImageToSpeechStackParamList = {
  'Recipient Selection': undefined;
  'Collection Selection': {
    recipientFirstName: string;
    recipientId: string;
  };
  Gallery: {
    recipientId: string;
    recipientFirstName: string;
    collectionId: string;
    collectionTitle: string;
  };
  Set: {
    recipientId: string;
    setId: string;
  };
  'Add Collection': {
    recipientId: string;
    collectionId: string | undefined;
  };
  'Add Set': {
    recipientId: string;
    collectionId: string | undefined;
    setId: string | undefined;
    editType: SetEditType | undefined;
  };
};

export type ForumStackParamList = {
  Home: undefined;
};

export type SettingsStackParamList = {
  'Main Menu': undefined;
  'Recipient Profile': {
    recipientId: string;
  };
  'Add Recipient': undefined;
  'Add Contact': {
    recipientId: string;
    contactId: string | undefined;
  };
  'Select Relationship': undefined;
};

// Screen Props

// authentication
export type LoginProps = StackScreenProps<RootStackParamList, 'Login'>;
export type PhoneLoginProps = StackScreenProps<
  RootStackParamList,
  'PhoneLogin'
>;
export type SignupProps = StackScreenProps<RootStackParamList, 'Signup'>;

// root stack
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

// recipient verification
export type RecipientVerificationProps = StackScreenProps<
  RecipientStackParamList,
  'Recipient Verification'
>;

// recipient view
export type RecipientViewProps = StackScreenProps<
  RecipientStackParamList,
  'Recipient View'
>;

// image to speech
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

// forum
export type ForumStackNavigatorProps = StackScreenProps<
  CaregiverStackParamList,
  'Forum'
>;
export type HomeProps = StackScreenProps<ForumStackParamList, 'Home'>;

// settings
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
export type RelationshipSelectionModalProps = StackScreenProps<
  SettingsStackParamList,
  'Select Relationship'
>;
