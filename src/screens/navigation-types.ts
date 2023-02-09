import {StackScreenProps} from "@react-navigation/stack";
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
    'Recipient Selection': undefined,
    'Collection Selection': {
        recipient_first_name: string,
        recipient_id: string,
    },
    'Gallery': {
        recipient_id: string,
        recipient_first_name: string,
        collection_id: string,
        collection_title: string
    },
    'Set': {
        set_id: string
    },
    'Add Recipient': undefined,
    'Add Collection': {
        recipient_id: string
    }
};

export type ForumStackParamList = {
    'Home': undefined
};

export type SettingsStackParamList = {
    'Main Menu': undefined
};

// Screen Props
export type RoleSelectionProps = StackScreenProps<RootStackParamList, 'Role Selection'>;
export type CaregiverBottomTabNavigatorProps = StackScreenProps<RootStackParamList, 'Caregiver'>;

export type ImageToSpeechStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Image to Speech'>;
export type RecipientSelectionProps = StackScreenProps<ImageToSpeechStackParamList, 'Recipient Selection'>;
export type CollectionSelectionProps = StackScreenProps<ImageToSpeechStackParamList, 'Collection Selection'>
export type GalleryProps = StackScreenProps<ImageToSpeechStackParamList, 'Gallery'>;
export type SetProps = StackScreenProps<ImageToSpeechStackParamList, 'Set'>;
export type AddRecipientModalProps = StackScreenProps<ImageToSpeechStackParamList, 'Add Recipient'>;
export type AddCollectionModalProps = StackScreenProps<ImageToSpeechStackParamList, 'Add Collection'>;

export type ForumStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Forum'>;
export type HomeProps = StackScreenProps<ForumStackParamList, 'Home'>

export type SettingsStackNavigatorProps = BottomTabScreenProps<CaregiverTabParamList, 'Settings'>;
export type MainMenuProps = StackScreenProps<SettingsStackParamList, 'Main Menu'>
