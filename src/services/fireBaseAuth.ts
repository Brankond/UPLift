// external dependencies
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export enum LoginErrors {
  INVALID_EMAIL,
  USER_DISABLED,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
}

export const createUserWithCredentials = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    // send verification email
    await user.sendEmailVerification();
    // keep the user signed out before email verification
    await auth().signOut();
  } catch (error) {
    console.log('Error: ', error);
  }
};

export const newUserEmailPasswordLogin = async (
  email: string,
  password: string,
) => {
  await auth().signInWithEmailAndPassword(email, password);
};

export const emailPasswordLogin = async (
  email: string,
  password: string,
  setLoginErrorType: React.Dispatch<React.SetStateAction<LoginErrors | null>>,
) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
    setLoginErrorType(null);
  } catch (error) {
    switch ((error as FirebaseAuthTypes.NativeFirebaseAuthError).code) {
      case 'auth/invalid-email':
        setLoginErrorType(LoginErrors.INVALID_EMAIL);
        break;
      case 'auth/user-not-found':
        setLoginErrorType(LoginErrors.USER_NOT_FOUND);
        break;
      case 'auth/wrong-password':
        setLoginErrorType(LoginErrors.WRONG_PASSWORD);
        break;
      case 'auth/user-disabled':
        setLoginErrorType(LoginErrors.USER_DISABLED);
        break;
    }
  }
};
