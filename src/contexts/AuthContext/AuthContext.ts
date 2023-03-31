// external dependencies
import {createContext} from 'react';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  setUser?: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
});
