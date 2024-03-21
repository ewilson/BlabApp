import {StyleSheet, View} from 'react-native';
import {useState} from "react";
import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
  androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  return await GoogleSignin.signIn();
}

export default function App() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signinInProgress, isSigninInProgress] = useState(false);
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      isSigninInProgress(true);
      const response = await GoogleLogin();
      isSigninInProgress(false);
      const { idToken, user } = response;
      console.log('ID Token', idToken);
      console.log('User', user);

      // UNCOMMENT WHEN READY TO SEND TO BACK END
      // if (idToken) {
      //   const resp = await authAPI.validateToken({
      //     token: idToken,
      //     email: user.email,
      //   });
      //   await handlePostLoginData(resp.data);
      // }
      // DELETE WHEN BACK END IMPLEMENTS SOMETHING LIKE THE FOLLOWING
      // await axios({
      //   method: 'get',
      //   url: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`,
      //   withCredentials: true,
      // });
    } catch (apiError) {
      setError(
          apiError?.response?.data?.error?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleLogin}
        disabled={signinInProgress}
      />
    </View>
  );
}

async function handleGoogleLogout() {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.log('Google Sign-Out Error:', error)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9df',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
