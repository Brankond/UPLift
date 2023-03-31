// external dependencies
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

export enum LoginErrors {
  INVALID_EMAIL,
  USER_DISABLED,
  USER_NOT_FOUND,
  WRONG_PASSWORD,
}

/**
 * Email and password authentication
 */
export const createUserEmailPassword = async (
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

// login the new user upon successful sign up
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

/**
 * Apple authentication
 */
export const appleLogin = async () => {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }

  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  // Sign the user in with the credential
  return auth().signInWithCredential(appleCredential);
};

/**
 * Google authentication
 */
GoogleSignin.configure({
  webClientId:
    '469786346755-otvot4c7jfnnmi0425h120vvk0ldcstd.apps.googleusercontent.com',
});

export const googleLogin = async () => {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

/**
 * Facebook authentication
 */
export const facebookLogin = async () => {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
};
